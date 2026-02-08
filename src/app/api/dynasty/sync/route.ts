import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { getPlayerValue, getPickValue, recommendPhase, PROSPECTS_2026, PROSPECTS_2027 } from "@/lib/dynasty-values";

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
        
        const { value, tier } = getPlayerValue(playerId);
        totalValue += value;
        
        if (player.position && posStrengths[player.position] !== undefined) {
          posStrengths[player.position] += value;
        }
        
        if (player.age) {
          playerAges.push(player.age);
        }

        rosterPlayers.push({
          sleeperId: playerId,
          name: player.full_name || player.first_name + " " + player.last_name,
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

    // Andrew's confirmed draft picks
    const myPicks = [
      { season: "2026", round: 1, pick: 2, originalOwner: "ldnmetsturtle" },
      { season: "2026", round: 1, pick: 5, originalOwner: "agough" },
      { season: "2026", round: 2, pick: 2, originalOwner: "ldnmetsturtle" },
      { season: "2026", round: 2, pick: 4, originalOwner: "brookscarroll" },
      { season: "2026", round: 2, pick: 11, originalOwner: "tmeredith21" },
      { season: "2026", round: 2, pick: 12, originalOwner: "agyankees8" },
      { season: "2027", round: 1, originalOwner: "brookscarroll" },
      { season: "2027", round: 1, originalOwner: "agough" },
      { season: "2027", round: 1, originalOwner: "Woodhaus71" },
      { season: "2027", round: 1, originalOwner: "colbymorris08" },
      { season: "2027", round: 1, originalOwner: "trund1e" },
      { season: "2027", round: 1, originalOwner: "Hendawg55" },
      { season: "2028", round: 1, originalOwner: "trund1e" },
      { season: "2028", round: 1, originalOwner: "tmeredith21" },
      { season: "2028", round: 2, originalOwner: "Woodhaus71" },
      { season: "2028", round: 2, originalOwner: "trund1e" },
    ];

    const pickUpdates = myPicks.map((pick) => {
      const drewValue = getPickValue(pick.season, pick.round, pick.pick);
      return prisma.dynastyPick.upsert({
        where: {
          season_round_originalOwner: {
            season: pick.season,
            round: pick.round,
            originalOwner: pick.originalOwner,
          },
        },
        update: {
          pick: pick.pick,
          currentOwner: "Hendawg55",
          isOwned: true,
          drewValue,
        },
        create: {
          season: pick.season,
          round: pick.round,
          pick: pick.pick,
          originalOwner: pick.originalOwner,
          currentOwner: "Hendawg55",
          isOwned: true,
          drewValue,
        },
      });
    });

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
    const totalPickValue = myPicks.reduce((sum, p) => sum + getPickValue(p.season, p.round, p.pick), 0);
    
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

    return NextResponse.json({ 
      success: true, 
      message: "Sync complete",
      teamsUpdated: rosters.length,
      playersUpdated: myTeam ? (rosters.find((r: { roster_id: number }) => r.roster_id === MY_ROSTER_ID)?.players?.length || 0) : 0,
      prospectsUpdated: PROSPECTS_2026.length + PROSPECTS_2027.length,
      phaseRecommendation,
      totalTeamValue: myTeam ? myTeam.totalValue + totalPickValue : 0,
      leagueRank,
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
