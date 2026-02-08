import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Andrew's Sleeper info (hardcoded for now)
const SLEEPER_USER_ID = "1131697729031434240";
const SLEEPER_USERNAME = "hendawg55";
const SLEEPER_LEAGUE_ID = "1180181459838525440";
const ROSTER_ID = 1;

// GET dynasty settings
export async function GET() {
  try {
    let settings = await prisma.dynastySettings.findUnique({
      where: { leagueId: SLEEPER_LEAGUE_ID },
    });

    // Create default settings if not exists
    if (!settings) {
      settings = await prisma.dynastySettings.create({
        data: {
          leagueId: SLEEPER_LEAGUE_ID,
          leagueName: "Midd Baseball Dynasty",
          userId: SLEEPER_USER_ID,
          username: SLEEPER_USERNAME,
          rosterId: ROSTER_ID,
          teamName: "Da Claw",
          mode: "tank",
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to fetch dynasty settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// POST - update settings (mainly mode)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mode } = body;

    if (!["tank", "retool", "contend"].includes(mode)) {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    const settings = await prisma.dynastySettings.upsert({
      where: { leagueId: SLEEPER_LEAGUE_ID },
      update: { mode },
      create: {
        leagueId: SLEEPER_LEAGUE_ID,
        leagueName: "Midd Baseball Dynasty",
        userId: SLEEPER_USER_ID,
        username: SLEEPER_USERNAME,
        rosterId: ROSTER_ID,
        teamName: "Da Claw",
        mode,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to update dynasty settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
