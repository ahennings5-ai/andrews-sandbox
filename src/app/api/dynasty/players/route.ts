import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// GET all owned players
export async function GET() {
  try {
    const players = await prisma.dynastyPlayer.findMany({
      where: { isOwned: true },
      orderBy: { drewValue: "desc" },
    });

    const picks = await prisma.dynastyPick.findMany({
      where: { isOwned: true },
      orderBy: [{ season: "asc" }, { round: "asc" }, { pick: "asc" }],
    });

    // Calculate totals
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
