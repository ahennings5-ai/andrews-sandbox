import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET all meal preferences
export async function GET() {
  try {
    const preferences = await prisma.mealPreference.findMany({
      orderBy: { updatedAt: "desc" },
    });
    
    // Convert to a lookup object: { mealId: { andrew: rating, olivia: rating, household: rating } }
    const lookup: Record<string, Record<string, number>> = {};
    preferences.forEach((pref) => {
      if (!lookup[pref.mealId]) lookup[pref.mealId] = {};
      lookup[pref.mealId][pref.person || "household"] = pref.rating;
    });
    
    return NextResponse.json({ preferences: lookup, raw: preferences });
  } catch (error) {
    console.error("Failed to fetch preferences:", error);
    return NextResponse.json({ preferences: {}, raw: [] });
  }
}

// POST/update a preference
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mealId, mealType, mealName, rating, person } = body;
    
    if (!mealId || !mealType || !mealName || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // Check if preference exists
    const existing = await prisma.mealPreference.findFirst({
      where: {
        mealId,
        person: person || null,
      },
    });
    
    let preference;
    if (existing) {
      preference = await prisma.mealPreference.update({
        where: { id: existing.id },
        data: { rating, mealName, mealType },
      });
    } else {
      preference = await prisma.mealPreference.create({
        data: {
          mealId,
          mealType,
          mealName,
          rating,
          person: person || null,
        },
      });
    }
    
    return NextResponse.json({ success: true, preference });
  } catch (error) {
    console.error("Failed to save preference:", error);
    return NextResponse.json({ error: "Failed to save preference" }, { status: 500 });
  }
}

// DELETE a preference
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mealId = searchParams.get("mealId");
    const person = searchParams.get("person");
    
    if (!mealId) {
      return NextResponse.json({ error: "Missing mealId" }, { status: 400 });
    }
    
    // Find and delete the preference
    const existing = await prisma.mealPreference.findFirst({
      where: {
        mealId,
        person: person || null,
      },
    });
    
    if (existing) {
      await prisma.mealPreference.delete({
        where: { id: existing.id },
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete preference:", error);
    return NextResponse.json({ error: "Failed to delete preference" }, { status: 500 });
  }
}
