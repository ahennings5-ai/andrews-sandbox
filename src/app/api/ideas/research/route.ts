import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

// POST - trigger research on an idea (generates business case)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    
    const idea = await prisma.businessIdea.findUnique({ where: { id } });
    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }
    
    // Mark as researching
    await prisma.businessIdea.update({
      where: { id },
      data: { status: "researching" },
    });
    
    // Return immediately - actual research happens via cron/agent
    return NextResponse.json({
      success: true,
      message: "Research queued",
      idea: {
        id: idea.id,
        name: idea.name,
        status: "researching",
      },
    });
  } catch (error) {
    console.error("Failed to queue research:", error);
    return NextResponse.json(
      { error: "Failed to queue research" },
      { status: 500 }
    );
  }
}

// GET - list ideas pending research
export async function GET() {
  try {
    const ideas = await prisma.businessIdea.findMany({
      where: {
        OR: [
          { status: "researching" },
          {
            AND: [
              { layer: 2 },
              { businessCase: { equals: Prisma.DbNull } },
            ],
          },
          {
            AND: [
              { layer: 3 },
              { executionPlan: { equals: Prisma.DbNull } },
            ],
          },
        ],
      },
      orderBy: { updatedAt: "asc" },
    });
    
    return NextResponse.json(ideas);
  } catch (error) {
    console.error("Failed to fetch research queue:", error);
    return NextResponse.json(
      { error: "Failed to fetch research queue" },
      { status: 500 }
    );
  }
}
