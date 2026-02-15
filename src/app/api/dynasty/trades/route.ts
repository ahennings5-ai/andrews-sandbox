import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { PLAYER_VALUES_BY_NAME } from "@/lib/dynasty-values";

const SLEEPER_LEAGUE_ID = "1180181459838525440";
const MY_ROSTER_ID = 1;

// Normalize name for matching
function normalizeName(name: string): string {
  return name
    .replace(/\s+(Jr\.?|Sr\.?|II|III|IV)$/i, "")
    .replace(/[.']/g, "")
    .trim();
}

// Build lookup map
const normalizedValues: Record<string, number> = {};
for (const [name, data] of Object.entries(PLAYER_VALUES_BY_NAME)) {
  normalizedValues[normalizeName(name)] = data.value;
  normalizedValues[name] = data.value;
}

function getLiveValue(name: string): number {
  return normalizedValues[name] || normalizedValues[normalizeName(name)] || 100;
}

function getTier(value: number): string {
  if (value >= 9000) return "Elite";
  if (value >= 7000) return "Star";
  if (value >= 5000) return "Starter";
  if (value >= 3000) return "Flex";
  if (value >= 1500) return "Bench";
  return "Clogger";
}

interface TeamAnalysis {
  rosterId: number;
  username: string;
  mode: string;
  totalValue: number;
  avgAge: number;
  strengths: string[];
  weaknesses: string[];
  wantsPicks: boolean; // rebuilders want picks
  wantsVets: boolean;  // contenders want proven players
  hasPicksToTrade: boolean;
  players: {
    name: string;
    position: string;
    value: number;
    age: number | null;
    tier: string;
  }[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseJsonArray(val: any): string[] {
  if (Array.isArray(val)) return val as string[];
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return []; }
  }
  return [];
}

interface TradeSuggestion {
  targetTeam: string;
  targetMode: string;
  rationale: string;
  yourSide: {
    players: string[];
    picks: string[];
    totalValue: number;
  };
  theirSide: {
    players: string[];
    picks: string[];
    totalValue: number;
  };
  type: "sell-high" | "buy-low" | "value-swap" | "picks-for-players" | "players-for-picks";
  priority: "high" | "medium" | "low";
}

// GET - Generate trade suggestions
export async function GET() {
  try {
    // Get all teams
    const teams = await prisma.dynastyTeam.findMany({
      where: { leagueId: SLEEPER_LEAGUE_ID },
    });

    // Get my team's settings
    const settings = await prisma.dynastySettings.findUnique({
      where: { leagueId: SLEEPER_LEAGUE_ID },
    });
    const myMode = settings?.mode || "tank";

    // Get my picks
    const myPicks = await prisma.dynastyPick.findMany({
      where: { isOwned: true },
    });

    // Parse team data with LIVE values
    const teamAnalyses: TeamAnalysis[] = teams.map((team) => {
      const rawPlayers = team.rosterJson ? JSON.parse(team.rosterJson as string) : [];
      const players = rawPlayers.map((p: { name: string; position: string; age: number | null }) => {
        const liveValue = getLiveValue(p.name);
        return {
          name: p.name,
          position: p.position,
          value: liveValue,
          age: p.age,
          tier: getTier(liveValue),
        };
      });
      const playersWithAge = players.filter((p: { age: number | null }) => p.age);
      const avgAge = playersWithAge.length > 0 
        ? playersWithAge.reduce((sum: number, p: { age: number }) => sum + p.age, 0) / playersWithAge.length
        : 25;
      const totalValue = players.reduce((sum: number, p: { value: number }) => sum + p.value, 0);

      return {
        rosterId: team.rosterId,
        username: team.ownerUsername,
        mode: team.mode || "unknown",
        totalValue,
        avgAge,
        strengths: parseJsonArray(team.strengths),
        weaknesses: parseJsonArray(team.weaknesses),
        wantsPicks: team.mode === "rebuilding" || team.mode === "tank",
        wantsVets: team.mode === "contending",
        hasPicksToTrade: team.mode === "contending", // contenders often trade picks
        players,
      };
    });

    const myTeam = teamAnalyses.find(t => t.rosterId === MY_ROSTER_ID);
    const otherTeams = teamAnalyses.filter(t => t.rosterId !== MY_ROSTER_ID);

    if (!myTeam) {
      return NextResponse.json({ error: "Your team not found" }, { status: 404 });
    }

    const suggestions: TradeSuggestion[] = [];

    // Generate trade suggestions based on my mode
    for (const targetTeam of otherTeams) {
      // Skip if no complementary needs
      if (targetTeam.mode === myMode) continue;

      // REBUILDING MODE: I want picks, they want my vets
      if (myMode === "tank" || myMode === "rebuilding") {
        // Find my aging/veteran players to sell
        const myVetsToSell = myTeam.players.filter(p => 
          (p.age && p.age >= 27 && p.position === "RB") ||
          (p.age && p.age >= 29 && ["WR", "TE"].includes(p.position)) ||
          (p.age && p.age >= 32 && p.position === "QB")
        ).filter(p => p.value >= 1000); // Only valuable vets

        // If target is contending and needs my positions
        if (targetTeam.mode === "contending") {
          for (const vet of myVetsToSell) {
            if (targetTeam.weaknesses.includes(vet.position)) {
              suggestions.push({
                targetTeam: targetTeam.username,
                targetMode: targetTeam.mode,
                rationale: `${targetTeam.username} is contending and weak at ${vet.position}. They'll overpay for ${vet.name}.`,
                yourSide: {
                  players: [vet.name],
                  picks: [],
                  totalValue: vet.value,
                },
                theirSide: {
                  players: [],
                  picks: ["2027 1st or 2nd"],
                  totalValue: Math.round(vet.value * 1.1), // They'll pay premium
                },
                type: "players-for-picks",
                priority: vet.value >= 3000 ? "high" : "medium",
              });
            }
          }

          // Also suggest buying their young players cheap
          const theirYoungStars = targetTeam.players.filter(p =>
            p.age && p.age <= 25 && p.value >= 3000
          );

          for (const young of theirYoungStars.slice(0, 2)) {
            suggestions.push({
              targetTeam: targetTeam.username,
              targetMode: targetTeam.mode,
              rationale: `${targetTeam.username} is win-now and may undervalue ${young.name}'s future. Buy low.`,
              yourSide: {
                players: [],
                picks: ["2027 1st", "2027 2nd"],
                totalValue: Math.round(young.value * 0.85),
              },
              theirSide: {
                players: [young.name],
                picks: [],
                totalValue: young.value,
              },
              type: "buy-low",
              priority: young.tier === "Elite" ? "high" : "medium",
            });
          }
        }
      }

      // CONTENDING MODE: I want vets, they want my picks
      if (myMode === "contend" || myMode === "contending") {
        if (targetTeam.mode === "rebuilding" || targetTeam.mode === "tank") {
          // Find their vets I could acquire
          const theirVets = targetTeam.players.filter(p =>
            p.value >= 2000 && p.age && p.age >= 26
          );

          for (const vet of theirVets.slice(0, 3)) {
            if (myTeam.weaknesses.includes(vet.position)) {
              suggestions.push({
                targetTeam: targetTeam.username,
                targetMode: targetTeam.mode,
                rationale: `${targetTeam.username} is rebuilding and wants to move ${vet.name}. You need ${vet.position} help.`,
                yourSide: {
                  players: [],
                  picks: ["Future 2nd"],
                  totalValue: Math.round(vet.value * 0.7),
                },
                theirSide: {
                  players: [vet.name],
                  picks: [],
                  totalValue: vet.value,
                },
                type: "buy-low",
                priority: "high",
              });
            }
          }
        }
      }

      // VALUE SWAPS: Find position mismatches regardless of mode
      const myExcess = myTeam.strengths.filter(s => targetTeam.weaknesses.includes(s));
      const theirExcess = targetTeam.strengths.filter(s => myTeam.weaknesses.includes(s));

      if (myExcess.length > 0 && theirExcess.length > 0) {
        const myExcessPos = myExcess[0];
        const theirExcessPos = theirExcess[0];

        const myExcessPlayer = myTeam.players
          .filter(p => p.position === myExcessPos && p.value >= 2000)
          .sort((a, b) => b.value - a.value)[0];

        const theirExcessPlayer = targetTeam.players
          .filter(p => p.position === theirExcessPos && p.value >= 2000)
          .sort((a, b) => b.value - a.value)[0];

        if (myExcessPlayer && theirExcessPlayer) {
          const valueDiff = Math.abs(myExcessPlayer.value - theirExcessPlayer.value);
          if (valueDiff <= 2000) { // Reasonable value match
            suggestions.push({
              targetTeam: targetTeam.username,
              targetMode: targetTeam.mode,
              rationale: `Position swap: You have excess ${myExcessPos}, they have excess ${theirExcessPos}. Both teams improve.`,
              yourSide: {
                players: [myExcessPlayer.name],
                picks: valueDiff > 500 && myExcessPlayer.value < theirExcessPlayer.value ? ["Late pick"] : [],
                totalValue: myExcessPlayer.value,
              },
              theirSide: {
                players: [theirExcessPlayer.name],
                picks: valueDiff > 500 && theirExcessPlayer.value < myExcessPlayer.value ? ["Late pick"] : [],
                totalValue: theirExcessPlayer.value,
              },
              type: "value-swap",
              priority: "medium",
            });
          }
        }
      }
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    // Summary stats
    const leagueOverview = {
      contenders: otherTeams.filter(t => t.mode === "contending").length,
      rebuilders: otherTeams.filter(t => t.mode === "rebuilding" || t.mode === "tank").length,
      middle: otherTeams.filter(t => t.mode === "retooling").length,
      myMode,
      myPicks: myPicks.map(p => `${p.season} R${p.round}`),
    };

    return NextResponse.json({
      success: true,
      myTeam: {
        username: myTeam.username,
        mode: myMode,
        totalValue: myTeam.totalValue,
        strengths: myTeam.strengths,
        weaknesses: myTeam.weaknesses,
        avgAge: myTeam.avgAge,
      },
      leagueOverview,
      suggestions: suggestions.slice(0, 15), // Top 15 suggestions
      allTeams: teamAnalyses.map(t => ({
        username: t.username,
        mode: t.mode,
        totalValue: t.totalValue,
        strengths: t.strengths,
        weaknesses: t.weaknesses,
        wantsPicks: t.wantsPicks,
        wantsVets: t.wantsVets,
      })),
    });
  } catch (error) {
    console.error("Failed to generate trade suggestions:", error);
    return NextResponse.json({ error: "Failed to generate suggestions", details: String(error) }, { status: 500 });
  }
}
