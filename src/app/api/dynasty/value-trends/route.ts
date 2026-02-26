import { NextResponse } from "next/server";

// FantasyCalc API - includes 30-day trends
const FANTASYCALC_API = "https://api.fantasycalc.com/values/current?isDynasty=true&numQbs=2&numTeams=12&ppr=1";

export interface ValueTrend {
  name: string;
  sleeperId: string | null;
  position: string;
  team: string | null;
  age: number | null;
  currentValue: number;
  trend30Day: number;
  trendPercent: number;
  direction: "rising" | "falling" | "stable";
  rank: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") || "all"; // all, rising, falling, owned
  const limit = parseInt(searchParams.get("limit") || "50");

  try {
    const res = await fetch(FANTASYCALC_API, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`FantasyCalc API error: ${res.status}`);
    }

    const data = await res.json();

    const trends: ValueTrend[] = [];

    for (const item of data) {
      if (!item.player) continue;

      const trend30 = item.trend30Day || 0;
      const value = item.value || 0;
      const trendPercent = value > 0 ? (trend30 / value) * 100 : 0;

      trends.push({
        name: item.player.name,
        sleeperId: item.player.sleeperId || null,
        position: item.player.position,
        team: item.player.maybeTeam || null,
        age: item.player.maybeAge || null,
        currentValue: value,
        trend30Day: trend30,
        trendPercent,
        direction: trend30 > 50 ? "rising" : trend30 < -50 ? "falling" : "stable",
        rank: item.overallRank,
      });
    }

    // Filter based on request
    let filtered = trends;
    if (filter === "rising") {
      filtered = trends.filter(t => t.trend30Day > 100).sort((a, b) => b.trend30Day - a.trend30Day);
    } else if (filter === "falling") {
      filtered = trends.filter(t => t.trend30Day < -100).sort((a, b) => a.trend30Day - b.trend30Day);
    } else {
      // All - sort by absolute trend magnitude
      filtered = [...trends].sort((a, b) => Math.abs(b.trend30Day) - Math.abs(a.trend30Day));
    }

    // Separate risers and fallers for the summary
    const risers = trends
      .filter(t => t.trend30Day > 100)
      .sort((a, b) => b.trend30Day - a.trend30Day)
      .slice(0, 15);

    const fallers = trends
      .filter(t => t.trend30Day < -100)
      .sort((a, b) => a.trend30Day - b.trend30Day)
      .slice(0, 15);

    // Position-specific movers
    const byPosition = {
      QB: {
        risers: trends.filter(t => t.position === "QB" && t.trend30Day > 50).sort((a, b) => b.trend30Day - a.trend30Day).slice(0, 5),
        fallers: trends.filter(t => t.position === "QB" && t.trend30Day < -50).sort((a, b) => a.trend30Day - b.trend30Day).slice(0, 5),
      },
      RB: {
        risers: trends.filter(t => t.position === "RB" && t.trend30Day > 50).sort((a, b) => b.trend30Day - a.trend30Day).slice(0, 5),
        fallers: trends.filter(t => t.position === "RB" && t.trend30Day < -50).sort((a, b) => a.trend30Day - b.trend30Day).slice(0, 5),
      },
      WR: {
        risers: trends.filter(t => t.position === "WR" && t.trend30Day > 50).sort((a, b) => b.trend30Day - a.trend30Day).slice(0, 5),
        fallers: trends.filter(t => t.position === "WR" && t.trend30Day < -50).sort((a, b) => a.trend30Day - b.trend30Day).slice(0, 5),
      },
      TE: {
        risers: trends.filter(t => t.position === "TE" && t.trend30Day > 50).sort((a, b) => b.trend30Day - a.trend30Day).slice(0, 5),
        fallers: trends.filter(t => t.position === "TE" && t.trend30Day < -50).sort((a, b) => a.trend30Day - b.trend30Day).slice(0, 5),
      },
    };

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      totalPlayers: trends.length,
      risers,
      fallers,
      byPosition,
      filtered: filtered.slice(0, limit),
    });
  } catch (error) {
    console.error("Failed to fetch value trends:", error);
    return NextResponse.json({ 
      error: "Failed to fetch value trends",
      details: String(error)
    }, { status: 500 });
  }
}
