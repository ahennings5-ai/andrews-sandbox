import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET all ideas (optionally filter by status)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    
    const where = status ? { status } : { status: { not: "archived" } };
    
    const ideas = await prisma.businessIdea.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    
    return NextResponse.json(ideas);
  } catch (error) {
    console.error("Failed to fetch ideas:", error);
    return NextResponse.json(
      { error: "Failed to fetch ideas" },
      { status: 500 }
    );
  }
}

// POST new idea
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const idea = await prisma.businessIdea.create({
      data: {
        name: body.name,
        oneLiner: body.oneLiner,
        category: body.category,
        source: body.source,
        whyNow: body.whyNow,
        scores: body.scores,
        personalFit: body.personalFit,
        status: "new",
        layer: 1,
      },
    });
    
    return NextResponse.json(idea);
  } catch (error) {
    console.error("Failed to create idea:", error);
    return NextResponse.json(
      { error: "Failed to create idea" },
      { status: 500 }
    );
  }
}

// PATCH - upvote, downvote, or update idea
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action, businessCase, executionPlan, notes } = body;
    
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    
    const idea = await prisma.businessIdea.findUnique({ where: { id } });
    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }
    
    let updateData: Record<string, unknown> = {};
    
    if (action === "upvote") {
      if (idea.layer === 1) {
        // First upvote: move to layer 2, status researched
        updateData = {
          layer: 2,
          status: "researched",
          businessCase: businessCase || null,
        };
      } else if (idea.layer === 2) {
        // Second upvote: move to layer 3, status ready
        updateData = {
          layer: 3,
          status: "ready",
          executionPlan: executionPlan || null,
        };
      }
      // Layer 3 upvote does nothing extra
    } else if (action === "downvote") {
      // Archive the idea
      updateData = { status: "archived" };
    } else if (action === "update") {
      // Generic update (notes, businessCase, executionPlan)
      if (notes !== undefined) updateData.notes = notes;
      if (businessCase !== undefined) updateData.businessCase = businessCase;
      if (executionPlan !== undefined) updateData.executionPlan = executionPlan;
    }
    
    const updated = await prisma.businessIdea.update({
      where: { id },
      data: updateData,
    });
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update idea:", error);
    return NextResponse.json(
      { error: "Failed to update idea" },
      { status: 500 }
    );
  }
}
