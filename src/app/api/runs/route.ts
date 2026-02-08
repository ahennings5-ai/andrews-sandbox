import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET all run logs
export async function GET() {
  try {
    const logs = await prisma.runLog.findMany({
      orderBy: [{ week: "desc" }, { day: "desc" }],
    });
    return NextResponse.json(logs);
  } catch (error) {
    console.error("Failed to fetch run logs:", error);
    return NextResponse.json({ error: "Failed to fetch run logs" }, { status: 500 });
  }
}

// POST a new run log (or update if exists)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { week, day, date, actualMiles, duration, pace, feeling, notes, splits, coachingFeedback } = body;

    const log = await prisma.runLog.upsert({
      where: { week_day: { week, day } },
      update: { date, actualMiles, duration, pace, feeling, notes, splits, coachingFeedback },
      create: { week, day, date, actualMiles, duration, pace, feeling, notes, splits, coachingFeedback },
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error("Failed to save run log:", error);
    return NextResponse.json({ error: "Failed to save run log" }, { status: 500 });
  }
}

// DELETE a run log
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const week = parseInt(searchParams.get("week") || "0");
    const day = parseInt(searchParams.get("day") || "0");

    await prisma.runLog.delete({
      where: { week_day: { week, day } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete run log:", error);
    return NextResponse.json({ error: "Failed to delete run log" }, { status: 500 });
  }
}
