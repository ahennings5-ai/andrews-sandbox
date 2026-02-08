import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// Sleeper API constants
const SLEEPER_USER_ID = "1131697729031434240";
const SLEEPER_LEAGUE_ID = "1180181459838525440";
const ROSTER_ID = 1;

// Fetch helper
async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

// Calculate Drew Value based on source values and adjustments
function calculateDrewValue(
  ktcValue: number | null,
  fcValue: number | null,
  position: string,
  age: number | null,
  mode: string,
  rosterNeeds: Record<string, number>
): { value: number; recommendation: string; reason: string } {
  // Base value from sources (KTC weighted 55%, FC 45%)
  const ktc = ktcValue || 0;
  const fc = fcValue || 0;
  let baseValue = ktc > 0 && fc > 0 
    ? Math.round(ktc * 0.55 + fc * 0.45)
    : ktc || fc || 0;

  // Large roster depth factor (+5% for flex-worthy players)
  if (baseValue > 1000 && baseValue < 5000) {
    baseValue = Math.round(baseValue * 1.05);
  }

  // Age-based adjustments (sites have some, but we add mode-specific)
  let ageMultiplier = 1.0;
  const playerAge = age || 25;
  
  if (mode === "tank") {
    // Tanking: prefer youth
    if (playerAge <= 23) ageMultiplier = 1.15;
    else if (playerAge <= 25) ageMultiplier = 1.05;
    else if (playerAge >= 28 && position === "RB") ageMultiplier = 0.75;
    else if (playerAge >= 29) ageMultiplier = 0.85;
    else if (playerAge >= 30) ageMultiplier = 0.70;
  } else if (mode === "contend") {
    // Contending: prefer prime age
    if (playerAge >= 24 && playerAge <= 28) ageMultiplier = 1.10;
    else if (playerAge <= 22) ageMultiplier = 0.90;
  }

  // Positional need multiplier
  const needMultiplier = rosterNeeds[position] || 1.0;

  const drewValue = Math.round(baseValue * ageMultiplier * needMultiplier);

  // Determine recommendation
  let recommendation = "hold";
  let reason = "Solid asset for your roster";

  if (mode === "tank") {
    if (playerAge >= 28 && position === "RB") {
      recommendation = "sell";
      reason = "Aging RB - value will decline. Sell to contender.";
    } else if (playerAge >= 29) {
      recommendation = "sell";
      reason = "Older player in tank mode - convert to picks/youth.";
    } else if (playerAge <= 24 && baseValue > 3000) {
      recommendation = "hold";
      reason = "Young asset - core piece for future contention.";
    }
  } else if (mode === "contend") {
    if (playerAge >= 30 && baseValue < 2000) {
      recommendation = "sell";
      reason = "Declining asset - sell before further drop.";
    }
  }

  return { value: drewValue, recommendation, reason };
}

// POST - sync all data from Sleeper
export async function POST() {
  try {
    // Get current settings
    const settings = await prisma.dynastySettings.findUnique({
      where: { leagueId: SLEEPER_LEAGUE_ID },
    });
    const mode = settings?.mode || "tank";

    // Fetch Sleeper data
    const [rosters, users, allPlayers, tradedPicks, transactions] = await Promise.all([
      fetchJson(`https://api.sleeper.app/v1/league/${SLEEPER_LEAGUE_ID}/rosters`),
      fetchJson(`https://api.sleeper.app/v1/league/${SLEEPER_LEAGUE_ID}/users`),
      fetchJson(`https://api.sleeper.app/v1/players/nfl`),
      fetchJson(`https://api.sleeper.app/v1/league/${SLEEPER_LEAGUE_ID}/traded_picks`),
      fetchJson(`https://api.sleeper.app/v1/league/${SLEEPER_LEAGUE_ID}/transactions/17`), // Last week of season
    ]);

    // Create user lookup
    const userLookup: Record<string, { username: string; teamName?: string }> = {};
    for (const user of users) {
      userLookup[user.user_id] = {
        username: user.display_name,
        teamName: user.metadata?.team_name,
      };
    }

    // Find Andrew's roster
    const myRoster = rosters.find((r: { roster_id: number }) => r.roster_id === ROSTER_ID);
    const myPlayerIds: string[] = myRoster?.players || [];

    // Analyze roster needs (simple count-based)
    const positionCounts: Record<string, number> = { QB: 0, RB: 0, WR: 0, TE: 0 };
    for (const playerId of myPlayerIds) {
      const player = allPlayers[playerId];
      if (player?.position && positionCounts[player.position] !== undefined) {
        positionCounts[player.position]++;
      }
    }

    // Calculate need multipliers (fewer = higher need)
    const avgCount = Object.values(positionCounts).reduce((a, b) => a + b, 0) / 4;
    const rosterNeeds: Record<string, number> = {};
    for (const [pos, count] of Object.entries(positionCounts)) {
      if (count < avgCount * 0.7) rosterNeeds[pos] = 1.15;
      else if (count < avgCount) rosterNeeds[pos] = 1.05;
      else rosterNeeds[pos] = 1.0;
    }

    // Process and upsert players (Andrew's roster)
    const playerUpdates = [];
    for (const playerId of myPlayerIds) {
      const player = allPlayers[playerId];
      if (!player || !player.full_name) continue;

      // For now, use placeholder values (real integration would fetch from KTC/FC APIs)
      // These would be replaced with actual API calls
      const ktcValue = player.search_rank ? Math.max(0, 10000 - player.search_rank * 10) : null;
      const fcValue = ktcValue ? Math.round(ktcValue * (0.9 + Math.random() * 0.2)) : null;

      const { value, recommendation, reason } = calculateDrewValue(
        ktcValue,
        fcValue,
        player.position || "UNKNOWN",
        player.age,
        mode,
        rosterNeeds
      );

      playerUpdates.push(
        prisma.dynastyPlayer.upsert({
          where: { sleeperId: playerId },
          update: {
            name: player.full_name,
            position: player.position || "UNKNOWN",
            team: player.team,
            age: player.age,
            ktcValue,
            fcValue,
            drewValue: value,
            recommendation,
            recommendReason: reason,
            isOwned: true,
          },
          create: {
            sleeperId: playerId,
            name: player.full_name,
            position: player.position || "UNKNOWN",
            team: player.team,
            age: player.age,
            ktcValue,
            fcValue,
            drewValue: value,
            recommendation,
            recommendReason: reason,
            isOwned: true,
          },
        })
      );
    }
    await Promise.all(playerUpdates);

    // Process draft picks
    const myPicks: { season: string; round: number; pick?: number; originalOwner: string }[] = [
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
      // Value picks based on round and year
      let drewValue = 0;
      if (pick.round === 1) {
        drewValue = pick.pick ? 8000 - (pick.pick - 1) * 400 : 6000; // 1.01 = 8000, 1.12 = 3600
      } else if (pick.round === 2) {
        drewValue = pick.pick ? 3000 - (pick.pick - 1) * 150 : 2000;
      } else {
        drewValue = 1000;
      }
      // Future picks worth slightly less
      if (pick.season === "2027") drewValue = Math.round(drewValue * 0.9);
      if (pick.season === "2028") drewValue = Math.round(drewValue * 0.8);

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
    await Promise.all(pickUpdates);

    // Process league teams
    const teamUpdates = [];
    for (const roster of rosters) {
      const owner = Object.entries(userLookup).find(
        ([userId]) => roster.owner_id === userId
      );
      const username = owner ? owner[1].username : `Team ${roster.roster_id}`;
      const teamName = owner ? owner[1].teamName : undefined;

      // Calculate team value
      let totalValue = 0;
      const posStrengths: Record<string, number> = { QB: 0, RB: 0, WR: 0, TE: 0 };
      
      for (const playerId of roster.players || []) {
        const player = allPlayers[playerId];
        if (!player) continue;
        const val = player.search_rank ? Math.max(0, 10000 - player.search_rank * 10) : 0;
        totalValue += val;
        if (player.position && posStrengths[player.position] !== undefined) {
          posStrengths[player.position] += val;
        }
      }

      // Determine strengths/weaknesses
      const avgPos = Object.values(posStrengths).reduce((a, b) => a + b, 0) / 4;
      const strengths = Object.entries(posStrengths)
        .filter(([, v]) => v > avgPos * 1.2)
        .map(([k]) => k);
      const weaknesses = Object.entries(posStrengths)
        .filter(([, v]) => v < avgPos * 0.8)
        .map(([k]) => k);

      // Estimate team mode based on record and roster age
      const wins = roster.settings?.wins || 0;
      const estMode = wins >= 8 ? "contending" : wins <= 4 ? "rebuilding" : "retooling";

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
    }
    await Promise.all(teamUpdates);

    // Update last sync time
    await prisma.dynastySettings.update({
      where: { leagueId: SLEEPER_LEAGUE_ID },
      data: { lastSync: new Date() },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Sync complete",
      playersUpdated: myPlayerIds.length,
      teamsUpdated: rosters.length,
    });
  } catch (error) {
    console.error("Failed to sync dynasty data:", error);
    return NextResponse.json({ error: "Failed to sync" }, { status: 500 });
  }
}

// GET - check sync status
export async function GET() {
  try {
    const settings = await prisma.dynastySettings.findUnique({
      where: { leagueId: SLEEPER_LEAGUE_ID },
      select: { lastSync: true },
    });

    return NextResponse.json({
      lastSync: settings?.lastSync,
      needsSync: !settings?.lastSync || 
        (new Date().getTime() - new Date(settings.lastSync).getTime()) > 7 * 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    console.error("Failed to check sync status:", error);
    return NextResponse.json({ error: "Failed to check sync" }, { status: 500 });
  }
}
