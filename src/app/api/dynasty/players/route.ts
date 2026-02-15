import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { PLAYER_VALUES_BY_NAME } from "@/lib/dynasty-values";

// Normalize name for matching
function normalizeName(name: string): string {
  return name
    .replace(/\s+(Jr\.?|Sr\.?|II|III|IV)$/i, "")
    .replace(/[.']/g, "")
    .trim();
}

// Build lookup map
const normalizedValues: Record<string, number> = {};
for (const [name, data] of Object.entries(PLAYER_VALUES_BY_NAME)) {
  normalizedValues[normalizeName(name)] = data.value;
  normalizedValues[name] = data.value;
}

// GET all owned players
export async function GET() {
  try {
    const dbPlayers = await prisma.dynastyPlayer.findMany({
      where: { isOwned: true },
      orderBy: { drewValue: "desc" },
    });

    // Enrich with LIVE values from dynasty-values.ts
    const players = dbPlayers.map(p => {
      const liveValue = normalizedValues[p.name] || normalizedValues[normalizeName(p.name)] || p.drewValue || 100;
      const tier = liveValue >= 9000 ? "Elite" :
                   liveValue >= 7000 ? "Star" :
                   liveValue >= 5000 ? "Starter" :
                   liveValue >= 3000 ? "Flex" :
                   liveValue >= 1500 ? "Bench" : "Clogger";
      return {
        ...p,
        drewValue: liveValue,
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
