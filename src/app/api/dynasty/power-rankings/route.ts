import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPlayerValue, getPickValue } from "@/lib/dynasty-values";

interface PowerRankingTeam {
  rosterId: number;
  owner: string;
  teamName: string | null;
  mode: string | null;
  totalValue: number;
  rank: number;
  tier: string;
  positionBreakdown: {
    QB: { value: number; count: number; avgAge: number };
    RB: { value: number; count: number; avgAge: number };
    WR: { value: number; count: number; avgAge: number };
    TE: { value: number; count: number; avgAge: number };
  };
  pickValue: number;
  starPlayers: string[];
  strengths: string[];
  weaknesses: string[];
  outlook: string;
  contenderScore: number;
  rebuildScore: number;
  championship: number; // 0-100 championship probability
}

export async function GET() {
  try {
    // Get all teams from DB
    const teams = await prisma.dynastyTeam.findMany({
      orderBy: { totalValue: "desc" },
    });

    if (teams.length === 0) {
      return NextResponse.json({
        error: "No teams found. Sync your league first.",
      }, { status: 404 });
    }

    // Get history for trend calculation
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const history = await prisma.dynastyTeamHistory.findMany({
      where: {
        recordedAt: { gte: thirtyDaysAgo },
      },
    });

    // Build power rankings
    const rankings: PowerRankingTeam[] = [];
    let maxValue = 0;
    let minValue = Infinity;

    for (const team of teams) {
      if (!team.totalValue) continue;
      maxValue = Math.max(maxValue, team.totalValue);
      minValue = Math.min(minValue, team.totalValue);
    }

    const valueRange = maxValue - minValue || 1;

    for (let i = 0; i < teams.length; i++) {
      const team = teams[i];
      const roster = team.rosterJson ? JSON.parse(team.rosterJson) : [];
      const strengths = team.strengths as string[] || [];
      const weaknesses = team.weaknesses as string[] || [];

      // Calculate position breakdown
      const posBreakdown = {
        QB: { value: 0, count: 0, totalAge: 0 },
        RB: { value: 0, count: 0, totalAge: 0 },
        WR: { value: 0, count: 0, totalAge: 0 },
        TE: { value: 0, count: 0, totalAge: 0 },
      };

      const starPlayers: string[] = [];

      for (const player of roster) {
        const pos = player.position as keyof typeof posBreakdown;
        if (posBreakdown[pos]) {
          posBreakdown[pos].value += player.value || 0;
          posBreakdown[pos].count += 1;
          posBreakdown[pos].totalAge += player.age || 25;
        }
        if (player.value >= 5000) {
          starPlayers.push(player.name);
        }
      }

      // Calculate pick value
      const pickCapital = team.draftCapital as Array<{ season: string; round: number; pick?: number }> || [];
      let pickValue = 0;
      for (const pick of pickCapital) {
        pickValue += getPickValue(pick.season, pick.round, pick.pick);
      }

      // Calculate contender vs rebuild score
      const avgAge = roster.reduce((sum: number, p: { age?: number }) => sum + (p.age || 25), 0) / (roster.length || 1);
      const eliteCount = roster.filter((p: { value: number }) => p.value >= 7000).length;
      const youngStarCount = roster.filter((p: { value: number; age?: number }) => p.value >= 5000 && (p.age || 25) < 26).length;

      const contenderScore = Math.min(100, 
        (eliteCount * 15) + 
        ((team.totalValue || 0) / 1000) + 
        (30 - avgAge) * 2 +
        (strengths.length * 5)
      );

      const rebuildScore = Math.min(100,
        (pickValue / 500) +
        (youngStarCount * 10) +
        ((30 - avgAge) * 3) +
        (roster.filter((p: { age?: number }) => (p.age || 25) < 25).length * 3)
      );

      // Determine tier
      const normalizedValue = ((team.totalValue || 0) - minValue) / valueRange;
      let tier = "Middle";
      if (normalizedValue >= 0.75) tier = "Elite";
      else if (normalizedValue >= 0.5) tier = "Contender";
      else if (normalizedValue >= 0.25) tier = "Middle";
      else tier = "Rebuilding";

      // Championship probability (simple model)
      const championship = Math.round(
        Math.min(30, (eliteCount * 5)) +
        Math.min(30, normalizedValue * 30) +
        Math.min(20, contenderScore / 5) +
        Math.min(20, (avgAge < 27 ? 20 : avgAge < 29 ? 10 : 0))
      );

      // Generate outlook
      let outlook = "";
      if (tier === "Elite") {
        outlook = "Championship window wide open. This team has the firepower to win now.";
      } else if (tier === "Contender") {
        outlook = "Solid contender with a clear path to the championship. One or two moves away from elite.";
      } else if (team.mode === "rebuilding" || rebuildScore > contenderScore) {
        outlook = "Building for the future. Focus on accumulating young talent and picks.";
      } else {
        outlook = "In transition. Could push for playoffs with the right moves or pivot to rebuilding.";
      }

      rankings.push({
        rosterId: team.rosterId,
        owner: team.ownerUsername,
        teamName: team.teamName,
        mode: team.mode,
        totalValue: team.totalValue || 0,
        rank: i + 1,
        tier,
        positionBreakdown: {
          QB: { value: posBreakdown.QB.value, count: posBreakdown.QB.count, avgAge: posBreakdown.QB.count ? posBreakdown.QB.totalAge / posBreakdown.QB.count : 0 },
          RB: { value: posBreakdown.RB.value, count: posBreakdown.RB.count, avgAge: posBreakdown.RB.count ? posBreakdown.RB.totalAge / posBreakdown.RB.count : 0 },
          WR: { value: posBreakdown.WR.value, count: posBreakdown.WR.count, avgAge: posBreakdown.WR.count ? posBreakdown.WR.totalAge / posBreakdown.WR.count : 0 },
          TE: { value: posBreakdown.TE.value, count: posBreakdown.TE.count, avgAge: posBreakdown.TE.count ? posBreakdown.TE.totalAge / posBreakdown.TE.count : 0 },
        },
        pickValue,
        starPlayers,
        strengths,
        weaknesses,
        outlook,
        contenderScore: Math.round(contenderScore),
        rebuildScore: Math.round(rebuildScore),
        championship,
      });
    }

    // Re-sort by total value to ensure proper ranking
    rankings.sort((a, b) => b.totalValue - a.totalValue);
    rankings.forEach((r, i) => r.rank = i + 1);

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      teamCount: rankings.length,
      rankings,
      summary: {
        avgValue: Math.round(rankings.reduce((s, r) => s + r.totalValue, 0) / rankings.length),
        medianValue: rankings[Math.floor(rankings.length / 2)]?.totalValue || 0,
        topTeam: rankings[0],
        bottomTeam: rankings[rankings.length - 1],
      },
    });
  } catch (error) {
    console.error("Failed to generate power rankings:", error);
    return NextResponse.json({ 
      error: "Failed to generate power rankings",
      details: String(error)
    }, { status: 500 });
  }
}
