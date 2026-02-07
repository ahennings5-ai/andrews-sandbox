import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Get the Monday of the current week
function getCurrentWeekMonday(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split("T")[0];
}

// GET current meal plan
export async function GET() {
  try {
    const weekOf = getCurrentWeekMonday();
    const plan = await prisma.mealPlan.findUnique({
      where: { weekOf },
    });
    return NextResponse.json(plan);
  } catch (error) {
    console.error("Failed to fetch meal plan:", error);
    return NextResponse.json({ error: "Failed to fetch meal plan" }, { status: 500 });
  }
}

// POST save/update meal plan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planData, checkedItems, attendance } = body;
    const weekOf = getCurrentWeekMonday();

    const plan = await prisma.mealPlan.upsert({
      where: { weekOf },
      update: { planData, checkedItems, attendance },
      create: { weekOf, planData, checkedItems, attendance },
    });

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Failed to save meal plan:", error);
    return NextResponse.json({ error: "Failed to save meal plan" }, { status: 500 });
  }
}

// PATCH update just checked items (for grocery list)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { checkedItems } = body;
    const weekOf = getCurrentWeekMonday();

    const plan = await prisma.mealPlan.update({
      where: { weekOf },
      data: { checkedItems },
    });

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Failed to update checked items:", error);
    return NextResponse.json({ error: "Failed to update checked items" }, { status: 500 });
  }
}
