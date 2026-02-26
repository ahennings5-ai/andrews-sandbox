import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

const SLEEPER_LEAGUE_ID = "1180181459838525440";

function getTier(value: number): string {
  if (value >= 9000) return "Elite";
  if (value >= 7000) return "Star";
  if (value >= 5000) return "Starter";
  if (value >= 3000) return "Flex";
  if (value >= 1500) return "Bench";
  return "Clogger";
}

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

      // Parse roster JSON - values already set by sync from FantasyCalc API
      let roster: { name: string; position: string; team: string | null; age: number | null; value: number; tier: string }[] = [];
      if (team?.rosterJson) {
        try {
          const parsed = JSON.parse(team.rosterJson);
          roster = parsed.map((p: { name: string; position: string; team: string | null; age: number | null; value?: number }) => {
            const value = p.value || 100;
            return {
              ...p,
              value,
              tier: getTier(value),
            };
          });
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

      // Recalculate totalValue with LIVE values
      const liveTotal = roster.reduce((sum, p) => sum + p.value, 0);

      return NextResponse.json({ 
        team: { ...team, roster, totalValue: liveTotal }, 
        history: history.map(h => ({ date: h.recordedAt.toISOString().split("T")[0], value: h.totalValue })),
        trades 
      });
    }

    // Get all teams - values already set by sync from FantasyCalc API
    const dbTeams = await prisma.dynastyTeam.findMany({
      where: { leagueId: SLEEPER_LEAGUE_ID },
    });

    const teams = dbTeams.map(team => {
      // Use totalValue from DB (set by sync from FantasyCalc)
      return { ...team };
    }).sort((a, b) => (b.totalValue || 0) - (a.totalValue || 0));

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
