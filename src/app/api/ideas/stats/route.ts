import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - pipeline stats
export async function GET() {
  try {
    const [total, layer1, layer2, layer3, archived, byCategory] =
      await Promise.all([
        prisma.businessIdea.count({
          where: { status: { not: "archived" } },
        }),
        prisma.businessIdea.count({
          where: { layer: 1, status: { not: "archived" } },
        }),
        prisma.businessIdea.count({
          where: { layer: 2, status: { not: "archived" } },
        }),
        prisma.businessIdea.count({
          where: { layer: 3, status: { not: "archived" } },
        }),
        prisma.businessIdea.count({
          where: { status: "archived" },
        }),
        prisma.businessIdea.groupBy({
          by: ["category"],
          where: { status: { not: "archived" } },
          _count: true,
        }),
      ]);
    
    // Get top ideas by score
    const ideas = await prisma.businessIdea.findMany({
      where: { status: { not: "archived" } },
      select: {
        id: true,
        name: true,
        layer: true,
        scores: true,
      },
    });
    
    // Calculate composite scores
    const scored = ideas.map((idea) => {
      const scores = (idea.scores as Record<string, number>) || {};
      const values = Object.values(scores).filter(
        (v) => typeof v === "number"
      );
      const avg = values.length > 0
        ? values.reduce((a, b) => a + b, 0) / values.length
        : 0;
      return { ...idea, avgScore: Math.round(avg * 10) / 10 };
    });
    
    const topByScore = scored
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 5);
    
    const categories = byCategory.reduce(
      (acc, { category, _count }) => {
        acc[category] = _count;
        return acc;
      },
      {} as Record<string, number>
    );
    
    return NextResponse.json({
      pipeline: {
        total,
        layer1,
        layer2,
        layer3,
        archived,
      },
      categories,
      topByScore: topByScore.map((i) => ({
        id: i.id,
        name: i.name,
        layer: i.layer,
        score: i.avgScore,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
