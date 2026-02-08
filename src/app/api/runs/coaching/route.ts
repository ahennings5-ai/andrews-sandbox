import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Add coaching feedback to a specific run
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { week, day, coachingFeedback } = body;

    if (!week || !day || !coachingFeedback) {
      return NextResponse.json(
        { error: "Missing required fields: week, day, coachingFeedback" },
        { status: 400 }
      );
    }

    const log = await prisma.runLog.update({
      where: { week_day: { week, day } },
      data: { coachingFeedback },
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error("Failed to add coaching feedback:", error);
    return NextResponse.json({ error: "Failed to add coaching feedback" }, { status: 500 });
  }
}

// Get recent runs that need coaching feedback
export async function GET() {
  try {
    const logs = await prisma.runLog.findMany({
      where: {
        coachingFeedback: null,
        actualMiles: { gt: 0 },
      },
      orderBy: [{ week: "desc" }, { day: "desc" }],
      take: 10,
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Failed to fetch runs needing coaching:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
