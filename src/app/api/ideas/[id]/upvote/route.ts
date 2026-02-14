import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST - upvote an idea (moves it up layers)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { businessCase, executionPlan } = body;
    
    const idea = await prisma.businessIdea.findUnique({ where: { id } });
    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }
    
    let updateData: Record<string, unknown> = {};
    let message = "";
    
    if (idea.layer === 1) {
      // Layer 1 → 2: Needs business case
      updateData = {
        layer: 2,
        status: "researched",
        businessCase: businessCase || null,
      };
      message = `Moved to Layer 2 (Research). ${businessCase ? "Business case added." : "Awaiting business case."}`;
    } else if (idea.layer === 2) {
      // Layer 2 → 3: Needs execution plan
      updateData = {
        layer: 3,
        status: "ready",
        executionPlan: executionPlan || null,
      };
      message = `Moved to Layer 3 (Ready). ${executionPlan ? "Execution plan added." : "Awaiting execution plan."}`;
    } else {
      // Already at layer 3
      updateData = { status: "active" };
      message = "Marked as actively pursuing.";
    }
    
    const updated = await prisma.businessIdea.update({
      where: { id },
      data: updateData,
    });
    
    return NextResponse.json({
      success: true,
      message,
      idea: updated,
    });
  } catch (error) {
    console.error("Failed to upvote idea:", error);
    return NextResponse.json(
      { error: "Failed to upvote idea" },
      { status: 500 }
    );
  }
}
