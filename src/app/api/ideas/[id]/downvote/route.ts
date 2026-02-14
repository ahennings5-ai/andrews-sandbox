import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST - downvote/archive an idea
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { reason } = body;
    
    const idea = await prisma.businessIdea.findUnique({ where: { id } });
    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }
    
    const notes = reason
      ? `${idea.notes || ""}\n\n[Archived] ${reason}`.trim()
      : idea.notes;
    
    const updated = await prisma.businessIdea.update({
      where: { id },
      data: {
        status: "archived",
        notes,
      },
    });
    
    return NextResponse.json({
      success: true,
      message: "Idea archived",
      idea: updated,
    });
  } catch (error) {
    console.error("Failed to downvote idea:", error);
    return NextResponse.json(
      { error: "Failed to downvote idea" },
      { status: 500 }
    );
  }
}
