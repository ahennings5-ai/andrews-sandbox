import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// GET all owned players - uses LIVE values from database (synced from FantasyCalc)
export async function GET() {
  try {
    const dbPlayers = await prisma.dynastyPlayer.findMany({
      where: { isOwned: true },
      orderBy: { drewValue: "desc" },
    });

    // Use LIVE values from DB (set by sync from FantasyCalc API)
    const players = dbPlayers.map(p => {
      const value = p.drewValue || 100;
      const tier = value >= 9000 ? "Elite" :
                   value >= 7000 ? "Star" :
                   value >= 5000 ? "Starter" :
                   value >= 3000 ? "Flex" :
                   value >= 1500 ? "Bench" : "Clogger";
      return {
        ...p,
        tier,
      };
    }).sort((a, b) => (b.drewValue || 0) - (a.drewValue || 0));

    const picks = await prisma.dynastyPick.findMany({
      where: { isOwned: true },
      orderBy: [{ season: "asc" }, { round: "asc" }, { pick: "asc" }],
    });

    // Calculate totals with LIVE values
    const totalPlayerValue = players.reduce((sum, p) => sum + (p.drewValue || 0), 0);
    const totalPickValue = picks.reduce((sum, p) => sum + (p.drewValue || 0), 0);

    // Group by position
    const byPosition: Record<string, typeof players> = {};
    for (const player of players) {
      if (!byPosition[player.position]) byPosition[player.position] = [];
      byPosition[player.position].push(player);
    }

    // Identify sell candidates
    const sellCandidates = players.filter((p) => p.recommendation === "sell");

    return NextResponse.json({
      players,
      picks,
      byPosition,
      sellCandidates,
      totalPlayerValue,
      totalPickValue,
      totalValue: totalPlayerValue + totalPickValue,
    });
  } catch (error) {
    console.error("Failed to fetch players:", error);
    return NextResponse.json({ error: "Failed to fetch players" }, { status: 500 });
  }
}
