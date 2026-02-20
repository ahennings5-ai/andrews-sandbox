import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { getPickValue, recommendPhase, PROSPECTS_2026, PROSPECTS_2027, PLAYER_VALUES_BY_NAME, getProjectedPickValueByRank } from "@/lib/dynasty-values";

// FantasyCalc API - LIVE dynasty values (Superflex, PPR, 12-team)
const FANTASYCALC_API = "https://api.fantasycalc.com/values/current?isDynasty=true&numQbs=2&numTeams=12&ppr=1";

// Normalize player name for matching (removes Jr., II, III, Sr., etc.)
function normalizeName(name: string): string {
  return name
    .replace(/\s+(Jr\.?|Sr\.?|II|III|IV)$/i, "")
    .replace(/[.']/g, "")
    .trim();
}

// Live values cache (populated at sync time)
let livePlayerValues: Record<string, { value: number; pos: string; team: string | null; age: number | null }> = {};

// Fetch live values from FantasyCalc API
async function fetchLiveValues(): Promise<boolean> {
  try {
    const res = await fetch(FANTASYCALC_API, { cache: 'no-store' });
    if (!res.ok) return false;
    
    const data = await res.json();
    livePlayerValues = {};
    
    for (const item of data) {
      if (item.player) {
        const name = item.player.name;
        const normalized = normalizeName(name);
        const playerData = {
          value: item.value,
          pos: item.player.position,
          team: item.player.maybeTeam || null,
          age: item.player.maybeAge || null,
        };
        livePlayerValues[name] = playerData;
        livePlayerValues[normalized] = playerData;
      }
    }
    
    console.log(`Fetched ${Object.keys(livePlayerValues).length / 2} live player values from FantasyCalc`);
    return true;
  } catch (error) {
    console.error("Failed to fetch live values, using static fallback:", error);
    return false;
  }
}

// Build static fallback lookup map
const staticPlayerValues: Record<string, { value: number; pos: string; team: string | null; age: number | null }> = {};
for (const [name, data] of Object.entries(PLAYER_VALUES_BY_NAME)) {
  const normalized = normalizeName(name);
  staticPlayerValues[normalized] = data;
  staticPlayerValues[name] = data;
}

// Get player value - prefer live, fallback to static
function getPlayerValueLive(playerName: string): { value: number; pos: string; team: string | null; age: number | null } | null {
  const normalized = normalizeName(playerName);
  return livePlayerValues[playerName] || livePlayerValues[normalized] || 
         staticPlayerValues[playerName] || staticPlayerValues[normalized] || null;
}

// Sleeper API constants
const SLEEPER_USER_ID = "1131697729031434240";
const SLEEPER_LEAGUE_ID = "1180181459838525440";
const MY_ROSTER_ID = 1;

// Fetch helper
async function fetchJson(url: string) {
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

// POST - sync all data from Sleeper
export async function POST() {
  try {
    // Fetch LIVE values from FantasyCalc API first
    const usedLiveValues = await fetchLiveValues();
    
    // Get current settings
    let settings = await prisma.dynastySettings.findUnique({
      where: { leagueId: SLEEPER_LEAGUE_ID },
    });
    
    if (!settings) {
      settings = await prisma.dynastySettings.create({
        data: {
          leagueId: SLEEPER_LEAGUE_ID,
          leagueName: "Midd Baseball Dynasty",
          teamName: "Da Claw",
          mode: "tank",
        },
      });
    }
    const mode = settings?.mode || "tank";

    // Fetch Sleeper data
    const [rosters, users, allPlayers] = await Promise.all([
      fetchJson(`https://api.sleeper.app/v1/league/${SLEEPER_LEAGUE_ID}/rosters`),
      fetchJson(`https://api.sleeper.app/v1/league/${SLEEPER_LEAGUE_ID}/users`),
      fetchJson(`https://api.sleeper.app/v1/players/nfl`),
    ]);

    // Create user lookup (owner_id -> username/teamName)
    const userLookup: Record<string, { username: string; teamName?: string }> = {};
    for (const user of users) {
      userLookup[user.user_id] = {
        username: user.display_name,
        teamName: user.metadata?.team_name,
      };
    }

    // Find roster ID by owner lookup
    const rosterOwnerMap: Record<number, string> = {};
    for (const roster of rosters) {
      const owner = userLookup[roster.owner_id];
      if (owner) {
        rosterOwnerMap[roster.roster_id] = owner.username;
      }
    }

    // Process all teams and calculate values
    const teamUpdates = [];
    const teamData: { rosterId: number; totalValue: number; wins: number; losses: number; avgAge: number; username: string }[] = [];
    
    for (const roster of rosters) {
      const owner = userLookup[roster.owner_id];
      const username = owner?.username || `Team ${roster.roster_id}`;
      const teamName = owner?.teamName;
      const isMyTeam = roster.roster_id === MY_ROSTER_ID;

      // Calculate team value and position strengths
      let totalValue = 0;
      const posStrengths: Record<string, number> = { QB: 0, RB: 0, WR: 0, TE: 0 };
      const playerAges: number[] = [];
      const rosterPlayers: { sleeperId: string; name: string; position: string; team: string | null; age: number | null; value: number; tier: string }[] = [];
      
      for (const playerId of roster.players || []) {
        const player = allPlayers[playerId];
        if (!player) continue;
        
        const playerName = player.full_name || `${player.first_name} ${player.last_name}`;
        
        // Look up value - LIVE from FantasyCalc API, fallback to static
        const playerData = getPlayerValueLive(playerName);
        let value = 100; // default for unknown players
        let tier = "Clogger";
        
        if (playerData) {
          value = playerData.value;
          // Calculate tier from value
          tier = value >= 9000 ? "Elite" : 
                 value >= 7000 ? "Star" : 
                 value >= 5000 ? "Starter" : 
                 value >= 3000 ? "Flex" : 
                 value >= 1500 ? "Bench" : "Clogger";
        }
        
        totalValue += value;
        
        if (player.position && posStrengths[player.position] !== undefined) {
          posStrengths[player.position] += value;
        }
        
        if (player.age) {
          playerAges.push(player.age);
        }

        rosterPlayers.push({
          sleeperId: playerId,
          name: playerName,
          position: player.position || "UNKNOWN",
          team: player.team,
          age: player.age,
          value,
          tier,
        });
      }

      const avgAge = playerAges.length > 0 ? playerAges.reduce((a, b) => a + b, 0) / playerAges.length : 25;
      const wins = roster.settings?.wins || 0;
      const losses = roster.settings?.losses || 0;
      
      teamData.push({ rosterId: roster.roster_id, totalValue, wins, losses, avgAge, username });

      // Determine strengths/weaknesses
      const avgPos = Object.values(posStrengths).reduce((a, b) => a + b, 0) / 4;
      const strengths = Object.entries(posStrengths)
        .filter(([, v]) => v > avgPos * 1.2)
        .map(([k]) => k);
      const weaknesses = Object.entries(posStrengths)
        .filter(([, v]) => v < avgPos * 0.8)
        .map(([k]) => k);

      // Estimate team mode based on roster composition
      const estMode = wins >= 9 ? "contending" : wins <= 4 ? "rebuilding" : "retooling";

      teamUpdates.push(
        prisma.dynastyTeam.upsert({
          where: {
            leagueId_rosterId: {
              leagueId: SLEEPER_LEAGUE_ID,
              rosterId: roster.roster_id,
            },
          },
          update: {
            ownerUsername: username,
            teamName,
            totalValue,
            mode: estMode,
            strengths,
            weaknesses,
            needs: weaknesses,
            rosterJson: JSON.stringify(rosterPlayers),
          },
          create: {
            leagueId: SLEEPER_LEAGUE_ID,
            rosterId: roster.roster_id,
            ownerUsername: username,
            teamName,
            totalValue,
            mode: estMode,
            strengths,
            weaknesses,
            needs: weaknesses,
            rosterJson: JSON.stringify(rosterPlayers),
          },
        })
      );

      // Record history point
      teamUpdates.push(
        prisma.dynastyTeamHistory.create({
          data: {
            leagueId: SLEEPER_LEAGUE_ID,
            rosterId: roster.roster_id,
            ownerUsername: username,
            totalValue,
          },
        })
      );

      // If this is my team, update players
      if (isMyTeam) {
        for (const p of rosterPlayers) {
          // Determine sell/hold recommendation based on mode
          let recommendation = "hold";
          let recommendReason = "Solid asset for your roster";
          
          if (mode === "tank") {
            if (p.age && p.age >= 28 && p.position === "RB") {
              recommendation = "sell";
              recommendReason = "Aging RB - value will decline rapidly. Sell to contender for picks/youth.";
            } else if (p.age && p.age >= 29) {
              recommendation = "sell";
              recommendReason = "Veteran in tank mode - convert to picks or younger assets.";
            } else if (p.tier === "Elite" || p.tier === "Star") {
              recommendation = "hold";
              recommendReason = "Core piece for future. Only sell for massive overpay.";
            } else if (p.value < 2000 && p.age && p.age >= 26) {
              recommendation = "sell";
              recommendReason = "Low value aging asset. Package in trades if possible.";
            }
          } else if (mode === "contend") {
            if (p.age && p.age >= 30 && p.value < 3000) {
              recommendation = "sell";
              recommendReason = "Declining asset - sell before further value drop.";
            }
          }

          teamUpdates.push(
            prisma.dynastyPlayer.upsert({
              where: { sleeperId: p.sleeperId },
              update: {
                name: p.name,
                position: p.position,
                team: p.team,
                age: p.age,
                ktcValue: p.value,
                fcValue: Math.round(p.value * 0.95), // Slight variance
                drewValue: p.value,
                tier: p.tier,
                recommendation,
                recommendReason,
                isOwned: true,
              },
              create: {
                sleeperId: p.sleeperId,
                name: p.name,
                position: p.position,
                team: p.team,
                age: p.age,
                ktcValue: p.value,
                fcValue: Math.round(p.value * 0.95),
                drewValue: p.value,
                tier: p.tier,
                recommendation,
                recommendReason,
                isOwned: true,
              },
            })
          );
        }
      }
    }

    // ═══════════════════════════════════════════════════════════
    // TEAM RANKINGS FOR PICK PROJECTIONS
    // Sort by STANDINGS (W-L, then fpts) - worst record = best pick (1.01)
    // ═══════════════════════════════════════════════════════════
    const sortedByStandings = [...teamData].sort((a, b) => {
      // Sort ascending by wins (fewer wins = better pick)
      if (a.wins !== b.wins) return a.wins - b.wins;
      // Tiebreaker: lower points = better pick (not available, use roster value as proxy)
      return a.totalValue - b.totalValue;
    });
    
    // Map username to PICK POSITION (1 = worst team = 1.01, 12 = best team = 1.12)
    const usernameToPickPosition: Record<string, number> = {};
    sortedByStandings.forEach((team, idx) => {
      usernameToPickPosition[team.username] = idx + 1; // 1 = worst record = 1.01
    });
    
    // Also keep roster value ranks for display purposes
    const sortedByValue = [...teamData].sort((a, b) => b.totalValue - a.totalValue);
    const usernameToRank: Record<string, number> = {};
    sortedByValue.forEach((team, idx) => {
      usernameToRank[team.username] = idx + 1; // 1 = best roster
    });

    // ═══════════════════════════════════════════════════════════
    // FETCH TRADED PICKS FROM SLEEPER (LIVE DATA)
    // ═══════════════════════════════════════════════════════════
    const tradedPicks = await fetchJson(`https://api.sleeper.app/v1/league/${SLEEPER_LEAGUE_ID}/traded_picks`);
    
    // Map roster_id to username
    const rosterIdToUsername: Record<number, string> = {};
    for (const team of teamData) {
      rosterIdToUsername[team.rosterId] = team.username;
    }
    
    const totalTeams = teamData.length || 12;
    
    // Clear old picks first
    await prisma.dynastyPick.deleteMany({
      where: { currentOwner: { not: undefined } }
    });
    
    // Process all picks for all teams (2026-2028 only - 2025 draft already happened)
    const pickUpdates: ReturnType<typeof prisma.dynastyPick.upsert>[] = [];
    const seasons = ["2026", "2027", "2028"];
    const rounds = [1, 2, 3];
    
    for (const season of seasons) {
      for (const round of rounds) {
        for (let rosterId = 1; rosterId <= totalTeams; rosterId++) {
          const originalOwnerUsername = rosterIdToUsername[rosterId] || `Team${rosterId}`;
          
          // Check if this pick was traded
          const trade = tradedPicks.find(
            (t: { season: string; round: number; roster_id: number }) => 
              t.season === season && t.round === round && t.roster_id === rosterId
          );
          
          // Determine current owner
          let currentOwnerRosterId = rosterId; // Default: original owner still has it
          if (trade) {
            currentOwnerRosterId = trade.owner_id;
          }
          const currentOwnerUsername = rosterIdToUsername[currentOwnerRosterId] || `Team${currentOwnerRosterId}`;
          
          // Calculate value based on original owner's STANDINGS (pick position)
          // pickPosition: 1 = worst record = 1.01 (most valuable), 12 = best record = 1.12 (least)
          const pickPosition = usernameToPickPosition[originalOwnerUsername] || Math.ceil(totalTeams / 2);
          // Convert to rank format expected by getProjectedPickValueByRank (12 = worst = best pick)
          const ownerRank = totalTeams - pickPosition + 1;
          const baseValue = getPickValue(season, round, undefined);
          const { value: drewValue } = getProjectedPickValueByRank(baseValue, ownerRank, totalTeams);
          
          // Only include 2025+ picks, rounds 1-2 for value
          if (parseInt(season) >= 2025 && round <= 2) {
            pickUpdates.push(
              prisma.dynastyPick.upsert({
                where: {
                  season_round_originalOwner: {
                    season,
                    round,
                    originalOwner: originalOwnerUsername,
                  },
                },
                update: {
                  currentOwner: currentOwnerUsername,
                  isOwned: currentOwnerUsername === "Hendawg55",
                  drewValue,
                },
                create: {
                  season,
                  round,
                  originalOwner: originalOwnerUsername,
                  currentOwner: currentOwnerUsername,
                  isOwned: currentOwnerUsername === "Hendawg55",
                  drewValue,
                },
              })
            );
          }
        }
      }
    }

    // Upsert prospects
    const prospectUpdates: ReturnType<typeof prisma.dynastyProspect.upsert>[] = [];
    
    for (const [idx, p] of PROSPECTS_2026.entries()) {
      const drewScore = 100 - idx * 2 + (p.position === "QB" ? 15 : 0) + (["WR", "TE"].includes(p.position) ? 5 : 0);
      prospectUpdates.push(
        prisma.dynastyProspect.upsert({
          where: { name_draftClass: { name: p.name, draftClass: "2026" } },
          update: {
            position: p.position,
            college: p.college,
            consensus: p.consensus,
            drewRank: idx + 1,
            drewScore,
            notes: p.notes,
          },
          create: {
            name: p.name,
            position: p.position,
            college: p.college,
            draftClass: "2026",
            consensus: p.consensus,
            drewRank: idx + 1,
            drewScore,
            notes: p.notes,
          },
        })
      );
    }
    
    for (const [idx, p] of PROSPECTS_2027.entries()) {
      const drewScore = 100 - idx * 2 + (p.position === "QB" ? 15 : 0) + (["WR", "TE"].includes(p.position) ? 5 : 0);
      prospectUpdates.push(
        prisma.dynastyProspect.upsert({
          where: { name_draftClass: { name: p.name, draftClass: "2027" } },
          update: {
            position: p.position,
            college: p.college,
            consensus: p.consensus,
            drewRank: idx + 1,
            drewScore,
            notes: p.notes,
          },
          create: {
            name: p.name,
            position: p.position,
            college: p.college,
            draftClass: "2027",
            consensus: p.consensus,
            drewRank: idx + 1,
            drewScore,
            notes: p.notes,
          },
        })
      );
    }

    await Promise.all([...teamUpdates, ...pickUpdates, ...prospectUpdates]);

    // Calculate phase recommendation for Andrew's team - ROSTER VALUE ONLY
    const myTeam = teamData.find(t => t.rosterId === MY_ROSTER_ID);
    // Sort by ROSTER value only (not picks) for league rank
    const sortedByRoster = [...teamData].sort((a, b) => b.totalValue - a.totalValue);
    const leagueRank = sortedByRoster.findIndex(t => t.rosterId === MY_ROSTER_ID) + 1;
    
    // Get my picks from the database after upsert
    const myPicksFromDb = await prisma.dynastyPick.findMany({
      where: { currentOwner: "Hendawg55" }
    });
    
    // Calculate total pick value using projected values based on original owner STANDINGS
    const totalPickValue = myPicksFromDb.reduce((sum, p) => {
      const baseValue = getPickValue(p.season, p.round, p.pick || undefined);
      const pickPosition = usernameToPickPosition[p.originalOwner] || Math.ceil(totalTeams / 2);
      const ownerRank = totalTeams - pickPosition + 1;
      const { value } = getProjectedPickValueByRank(baseValue, ownerRank, totalTeams);
      return sum + value;
    }, 0);
    
    let phaseRecommendation = null;
    if (myTeam) {
      // Phase recommendation based on ROSTER only
      phaseRecommendation = recommendPhase(
        myTeam.totalValue, // Roster value only, no picks
        myTeam.avgAge,
        leagueRank,
        myTeam.wins,
        myTeam.losses
      );
    }

    // Update last sync time and phase recommendation
    await prisma.dynastySettings.update({
      where: { leagueId: SLEEPER_LEAGUE_ID },
      data: { 
        lastSync: new Date(),
        phaseRecommendation: phaseRecommendation ? JSON.stringify(phaseRecommendation) : null,
      },
    });

    // Build team rankings for UI (by standings, not roster value)
    const teamRankings = sortedByStandings.map((t, idx) => ({
      username: t.username,
      rosterId: t.rosterId,
      rosterValue: t.totalValue,
      wins: t.wins,
      losses: t.losses,
      standingsRank: totalTeams - idx, // 1 = worst, 12 = best
      projectedPickPosition: idx + 1, // 1 = worst record = 1.01
    }));

    return NextResponse.json({ 
      success: true, 
      message: "Sync complete",
      valuesSource: usedLiveValues ? "FantasyCalc API (LIVE)" : "Static fallback",
      teamsUpdated: rosters.length,
      playersUpdated: myTeam ? (rosters.find((r: { roster_id: number }) => r.roster_id === MY_ROSTER_ID)?.players?.length || 0) : 0,
      prospectsUpdated: PROSPECTS_2026.length + PROSPECTS_2027.length,
      phaseRecommendation,
      totalTeamValue: myTeam ? myTeam.totalValue + totalPickValue : 0,
      leagueRank,
      teamRankings, // For pick projection display
    });
  } catch (error) {
    console.error("Failed to sync dynasty data:", error);
    return NextResponse.json({ error: "Failed to sync", details: String(error) }, { status: 500 });
  }
}

// GET - check sync status
export async function GET() {
  try {
    const settings = await prisma.dynastySettings.findUnique({
      where: { leagueId: SLEEPER_LEAGUE_ID },
      select: { lastSync: true, phaseRecommendation: true },
    });

    return NextResponse.json({
      lastSync: settings?.lastSync,
      phaseRecommendation: settings?.phaseRecommendation ? JSON.parse(settings.phaseRecommendation as string) : null,
      needsSync: !settings?.lastSync || 
        (new Date().getTime() - new Date(settings.lastSync).getTime()) > 7 * 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    console.error("Failed to check sync status:", error);
    return NextResponse.json({ error: "Failed to check sync" }, { status: 500 });
  }
}
