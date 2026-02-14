import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET single idea
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const idea = await prisma.businessIdea.findUnique({
      where: { id },
    });
    
    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }
    
    return NextResponse.json(idea);
  } catch (error) {
    console.error("Failed to fetch idea:", error);
    return NextResponse.json(
      { error: "Failed to fetch idea" },
      { status: 500 }
    );
  }
}

// PATCH update idea
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Remove id from body if present
    const { id: _, ...updateData } = body;
    
    const idea = await prisma.businessIdea.update({
      where: { id },
      data: updateData,
    });
    
    return NextResponse.json(idea);
  } catch (error) {
    console.error("Failed to update idea:", error);
    return NextResponse.json(
      { error: "Failed to update idea" },
      { status: 500 }
    );
  }
}

// DELETE idea (archives it)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const idea = await prisma.businessIdea.update({
      where: { id },
      data: { status: "archived" },
    });
    
    return NextResponse.json({ success: true, idea });
  } catch (error) {
    console.error("Failed to delete idea:", error);
    return NextResponse.json(
      { error: "Failed to delete idea" },
      { status: 500 }
    );
  }
}
