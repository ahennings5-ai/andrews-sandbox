import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Get current week's deals
export async function GET() {
  try {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
    const weekOf = startOfWeek.toISOString().split("T")[0];

    const plan = await prisma.mealPlan.findUnique({
      where: { weekOf },
      select: { deals: true, updatedAt: true },
    });

    return NextResponse.json({
      deals: plan?.deals || null,
      updatedAt: plan?.updatedAt || null,
    });
  } catch (error) {
    console.error("Failed to fetch deals:", error);
    return NextResponse.json({ error: "Failed to fetch deals" }, { status: 500 });
  }
}

// Update deals (for Agent Drew to post deal insights)
export async function POST(req: NextRequest) {
  try {
    const { deals, weekOf: customWeekOf } = await req.json();

    // Use custom weekOf or calculate current week
    let weekOf = customWeekOf;
    if (!weekOf) {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
      weekOf = startOfWeek.toISOString().split("T")[0];
    }

    const plan = await prisma.mealPlan.upsert({
      where: { weekOf },
      update: { deals },
      create: {
        weekOf,
        planData: [],
        deals,
      },
    });

    return NextResponse.json({ success: true, deals: plan.deals });
  } catch (error) {
    console.error("Failed to update deals:", error);
    return NextResponse.json({ error: "Failed to update deals" }, { status: 500 });
  }
}
