import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { PLAYER_VALUES_BY_NAME } from "@/lib/dynasty-values";

const SLEEPER_LEAGUE_ID = "1180181459838525440";

// Normalize name for matching
function normalizeName(name: string): string {
  return name
    .replace(/\s+(Jr\.?|Sr\.?|II|III|IV)$/i, "")
    .replace(/[.']/g, "")
    .trim();
}

// Build lookup map with ALL player data
const normalizedValues: Record<string, { value: number; pos: string; team: string | null; age: number | null }> = {};
for (const [name, data] of Object.entries(PLAYER_VALUES_BY_NAME)) {
  normalizedValues[normalizeName(name)] = data;
  normalizedValues[name] = data;
}

function getLiveValue(name: string): number {
  const data = normalizedValues[name] || normalizedValues[normalizeName(name)];
  return data?.value || 100;
}

function getTier(value: number): string {
  if (value >= 9000) return "Elite";
  if (value >= 7000) return "Star";
  if (value >= 5000) return "Starter";
  if (value >= 3000) return "Flex";
  if (value >= 1500) return "Bench";
  return "Clogger";
}

interface LeaguePlayer {
  name: string;
  position: string;
  team: string | null;
  age: number | null;
  drewValue: number;
  tier: string;
  owner: string;
  rosterId: number;
  isOwned: boolean; // by Andrew
}

// GET all league players with gems analysis
export async function GET() {
  try {
    const teams = await prisma.dynastyTeam.findMany({
      where: { leagueId: SLEEPER_LEAGUE_ID },
    });

    const allPlayers: LeaguePlayer[] = [];
    
    for (const team of teams) {
      if (!team.rosterJson) continue;
      
      try {
        const roster = JSON.parse(team.rosterJson);
        for (const p of roster) {
          const drewValue = getLiveValue(p.name);
          allPlayers.push({
            name: p.name,
            position: p.position,
            team: p.team,
            age: p.age,
            drewValue,
            tier: getTier(drewValue),
            owner: team.ownerUsername,
            rosterId: team.rosterId,
            isOwned: team.rosterId === 1, // Andrew's roster
          });
        }
      } catch {
        continue;
      }
    }

    // Sort by value descending
    allPlayers.sort((a, b) => b.drewValue - a.drewValue);

    // Find gems on OTHER teams (not Andrew's) - young players with high value
    const buyTargets = allPlayers
      .filter(p => !p.isOwned && p.drewValue >= 3000)
      .map(p => ({
        ...p,
        // Calculate "gem score" - value relative to age for upside
        gemScore: p.position === "QB" 
          ? (p.age && p.age < 28 ? p.drewValue * 1.2 : p.drewValue)
          : p.position === "RB"
          ? (p.age && p.age < 26 ? p.drewValue * 1.3 : p.age && p.age < 28 ? p.drewValue : p.drewValue * 0.8)
          : p.position === "WR"
          ? (p.age && p.age < 26 ? p.drewValue * 1.2 : p.drewValue)
          : p.drewValue,
      }))
      .sort((a, b) => b.gemScore - a.gemScore)
      .slice(0, 20);

    // Find undervalued young players (age < 26, value 2000-5000 range)
    const hiddenGems = allPlayers
      .filter(p => !p.isOwned && p.age && p.age < 26 && p.drewValue >= 2000 && p.drewValue < 6000)
      .sort((a, b) => b.drewValue - a.drewValue)
      .slice(0, 15);

    // Find aging assets on contending teams (sell high candidates elsewhere)
    const agingAssets = allPlayers
      .filter(p => {
        if (p.isOwned) return false;
        if (p.position === "RB" && p.age && p.age >= 27) return p.drewValue >= 3000;
        if (p.position === "WR" && p.age && p.age >= 29) return p.drewValue >= 3000;
        if (p.position === "QB" && p.age && p.age >= 33) return p.drewValue >= 3000;
        return false;
      })
      .sort((a, b) => b.drewValue - a.drewValue)
      .slice(0, 10);

    // Position-specific opportunities
    const qbGems = allPlayers
      .filter(p => !p.isOwned && p.position === "QB" && p.drewValue >= 4000)
      .slice(0, 10);
    
    const rbGems = allPlayers
      .filter(p => !p.isOwned && p.position === "RB" && p.age && p.age < 27 && p.drewValue >= 3000)
      .slice(0, 10);
    
    const wrGems = allPlayers
      .filter(p => !p.isOwned && p.position === "WR" && p.age && p.age < 27 && p.drewValue >= 3000)
      .slice(0, 10);

    return NextResponse.json({
      allPlayers,
      buyTargets,
      hiddenGems,
      agingAssets,
      byPosition: {
        QB: qbGems,
        RB: rbGems,
        WR: wrGems,
      },
      totalLeaguePlayers: allPlayers.length,
    });
  } catch (error) {
    console.error("Failed to fetch league gems:", error);
    return NextResponse.json({ error: "Failed to fetch gems" }, { status: 500 });
  }
}
