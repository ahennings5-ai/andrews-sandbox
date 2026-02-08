import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

const SLEEPER_LEAGUE_ID = "1180181459838525440";

// GET all league teams or single team with roster
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rosterId = searchParams.get("rosterId");

  try {
    if (rosterId) {
      // Get single team with full roster and history
      const team = await prisma.dynastyTeam.findUnique({
        where: {
          leagueId_rosterId: {
            leagueId: SLEEPER_LEAGUE_ID,
            rosterId: parseInt(rosterId),
          },
        },
      });

      // Parse roster JSON if available
      let roster = [];
      if (team?.rosterJson) {
        try {
          roster = JSON.parse(team.rosterJson);
        } catch {
          roster = [];
        }
      }

      const history = await prisma.dynastyTeamHistory.findMany({
        where: {
          leagueId: SLEEPER_LEAGUE_ID,
          rosterId: parseInt(rosterId),
        },
        orderBy: { recordedAt: "asc" },
        take: 52, // Last year of data points
      });

      const trades = await prisma.dynastyTrade.findMany({
        where: {
          leagueId: SLEEPER_LEAGUE_ID,
          OR: [
            { team1RosterId: parseInt(rosterId) },
            { team2RosterId: parseInt(rosterId) },
          ],
        },
        orderBy: { tradedAt: "desc" },
        take: 10,
      });

      return NextResponse.json({ 
        team: { ...team, roster }, 
        history: history.map(h => ({ date: h.recordedAt.toISOString().split("T")[0], value: h.totalValue })),
        trades 
      });
    }

    // Get all teams
    const teams = await prisma.dynastyTeam.findMany({
      where: { leagueId: SLEEPER_LEAGUE_ID },
      orderBy: { totalValue: "desc" },
    });

    // Get history for chart
    const history = await prisma.dynastyTeamHistory.findMany({
      where: { leagueId: SLEEPER_LEAGUE_ID },
      orderBy: { recordedAt: "asc" },
    });

    // Group history by team
    const historyByTeam: Record<number, { date: string; value: number }[]> = {};
    for (const h of history) {
      if (!historyByTeam[h.rosterId]) historyByTeam[h.rosterId] = [];
      historyByTeam[h.rosterId].push({
        date: h.recordedAt.toISOString().split("T")[0],
        value: h.totalValue,
      });
    }

    return NextResponse.json({ teams, historyByTeam });
  } catch (error) {
    console.error("Failed to fetch teams:", error);
    return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 });
  }
}
