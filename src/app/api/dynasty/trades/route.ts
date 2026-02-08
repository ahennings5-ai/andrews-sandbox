import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

const SLEEPER_LEAGUE_ID = "1180181459838525440";

// GET all league trades
export async function GET() {
  try {
    const trades = await prisma.dynastyTrade.findMany({
      where: { leagueId: SLEEPER_LEAGUE_ID },
      orderBy: { tradedAt: "desc" },
    });

    // Calculate winners if not set
    const tradesWithWinners = trades.map((trade) => {
      if (!trade.winner && trade.team1Value && trade.team2Value) {
        const diff = trade.team1Value - trade.team2Value;
        let winner = "fair";
        if (diff > 500) winner = "team2"; // Team 2 got more value
        else if (diff < -500) winner = "team1"; // Team 1 got more value
        return { ...trade, winner };
      }
      return trade;
    });

    // Group by month for visualization
    const byMonth: Record<string, typeof trades> = {};
    for (const trade of tradesWithWinners) {
      const month = trade.tradedAt.toISOString().slice(0, 7);
      if (!byMonth[month]) byMonth[month] = [];
      byMonth[month].push(trade);
    }

    // Stats
    const totalTrades = trades.length;
    const team1Wins = tradesWithWinners.filter((t) => t.winner === "team1").length;
    const team2Wins = tradesWithWinners.filter((t) => t.winner === "team2").length;
    const fairTrades = tradesWithWinners.filter((t) => t.winner === "fair").length;

    return NextResponse.json({
      trades: tradesWithWinners,
      byMonth,
      stats: { totalTrades, team1Wins, team2Wins, fairTrades },
    });
  } catch (error) {
    console.error("Failed to fetch trades:", error);
    return NextResponse.json({ error: "Failed to fetch trades" }, { status: 500 });
  }
}
