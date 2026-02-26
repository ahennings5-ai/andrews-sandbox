import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

const SLEEPER_LEAGUE_ID = "1180181459838525440";

function getTier(value: number): string {
  if (value >= 9000) return "Elite";
  if (value >= 7000) return "Star";
  if (value >= 5000) return "Starter";
  if (value >= 3000) return "Flex";
  if (value >= 1500) return "Bench";
  return "Clogger";
}

interface Player {
  name: string;
  position: string;
  team: string | null;
  age: number | null;
  value: number;
  tier: string;
}

interface TeamData {
  rosterId: number;
  username: string;
  teamName: string | null;
  mode: string;
  totalValue: number;
  avgAge: number;
  strengths: string[];
  weaknesses: string[];
  players: Player[];
  eliteCount: number;
  starCount: number;
  cloggerCount: number;
}

interface TradeRecommendation {
  type: "sell" | "buy" | "swap";
  priority: "high" | "medium" | "low";
  targetTeam: string;
  give: string[];
  receive: string[];
  rationale: string;
  valueGiven: number;
  valueReceived: number;
}

interface Roadmap {
  team: TeamData;
  summary: string;
  phase: "contend" | "retool" | "rebuild" | "tank";
  keyActions: string[];
  sellCandidates: { player: string; reason: string; targetValue: string }[];
  buyCandidates: { player: string; owner: string; reason: string }[];
  tradeRecommendations: TradeRecommendation[];
  draftStrategy: string;
  timeline: string;
}

// Helper to parse JSON arrays from Prisma
function parseJsonArray(val: unknown): string[] {
  if (Array.isArray(val)) return val as string[];
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return []; }
  }
  return [];
}

// GET roadmap for a specific team or all teams
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rosterId = searchParams.get("rosterId");

  try {
    const teams = await prisma.dynastyTeam.findMany({
      where: { leagueId: SLEEPER_LEAGUE_ID },
    });

    const picks = await prisma.dynastyPick.findMany({
      where: { season: { in: ["2026", "2027", "2028"] } },
    });

    // Parse all team data
    const allTeams: TeamData[] = teams.map((team) => {
      const rawPlayers = team.rosterJson ? JSON.parse(team.rosterJson as string) : [];
      const players: Player[] = rawPlayers.map((p: { name: string; position: string; team: string | null; age: number | null; value?: number }) => ({
        name: p.name,
        position: p.position,
        team: p.team,
        age: p.age,
        value: p.value || 100,
        tier: getTier(p.value || 100),
      }));

      const playersWithAge = players.filter(p => p.age);
      const avgAge = playersWithAge.length > 0
        ? playersWithAge.reduce((sum, p) => sum + (p.age || 0), 0) / playersWithAge.length
        : 25;

      return {
        rosterId: team.rosterId,
        username: team.ownerUsername,
        teamName: team.teamName,
        mode: team.mode || "unknown",
        totalValue: players.reduce((sum, p) => sum + p.value, 0),
        avgAge: Math.round(avgAge * 10) / 10,
        strengths: parseJsonArray(team.strengths),
        weaknesses: parseJsonArray(team.weaknesses),
        players: players.sort((a, b) => b.value - a.value),
        eliteCount: players.filter(p => p.tier === "Elite").length,
        starCount: players.filter(p => p.tier === "Star").length,
        cloggerCount: players.filter(p => p.tier === "Clogger").length,
      };
    });

    // Get picks by owner
    const picksByOwner: Record<string, typeof picks> = {};
    for (const pick of picks) {
      if (!picksByOwner[pick.currentOwner]) picksByOwner[pick.currentOwner] = [];
      picksByOwner[pick.currentOwner].push(pick);
    }

    // Generate roadmap for each team
    function generateRoadmap(team: TeamData): Roadmap {
      const teamPicks = picksByOwner[team.username] || [];
      const totalPickValue = teamPicks.reduce((sum, p) => sum + (p.drewValue || 0), 0);
      const firstRoundPicks = teamPicks.filter(p => p.round === 1);

      // Determine phase
      let phase: "contend" | "retool" | "rebuild" | "tank";
      if (team.totalValue >= 55000 && team.eliteCount >= 1 && team.avgAge < 28) {
        phase = "contend";
      } else if (team.totalValue >= 45000 || (team.eliteCount >= 1 && team.avgAge < 27)) {
        phase = "retool";
      } else if (team.totalValue >= 30000 || totalPickValue >= 25000) {
        phase = "rebuild";
      } else {
        phase = "tank";
      }

      // Identify sell candidates
      const sellCandidates: Roadmap["sellCandidates"] = [];
      for (const p of team.players) {
        if (p.position === "RB" && p.age && p.age >= 27 && p.value >= 2000) {
          sellCandidates.push({ player: p.name, reason: `Aging RB (${p.age}) - value will decline`, targetValue: "2027 2nd+" });
        } else if (p.position === "WR" && p.age && p.age >= 29 && p.value >= 2000) {
          sellCandidates.push({ player: p.name, reason: `Aging WR (${p.age}) - sell before cliff`, targetValue: "Future 2nd" });
        } else if (p.position === "QB" && p.age && p.age >= 33 && p.value >= 2000) {
          sellCandidates.push({ player: p.name, reason: `Old QB (${p.age}) - limited runway`, targetValue: "2027 3rd" });
        } else if (phase === "rebuild" && p.value >= 3000 && p.age && p.age >= 26) {
          sellCandidates.push({ player: p.name, reason: "Good value but doesn't fit rebuild timeline", targetValue: "1st round pick" });
        }
      }

      // Find buy candidates from other teams
      const buyCandidates: Roadmap["buyCandidates"] = [];
      for (const otherTeam of allTeams) {
        if (otherTeam.rosterId === team.rosterId) continue;
        
        for (const p of otherTeam.players) {
          // Young players on rebuilding teams are buy targets for contenders
          if (phase === "contend" && otherTeam.mode === "rebuilding" && p.value >= 3000 && p.age && p.age >= 27) {
            if (team.weaknesses.includes(p.position)) {
              buyCandidates.push({ player: p.name, owner: otherTeam.username, reason: `Fills ${p.position} need, owner is rebuilding` });
            }
          }
          // Aging stars on contenders are buy targets for rebuilders (cheap future value)
          if ((phase === "rebuild" || phase === "tank") && otherTeam.mode === "contending" && p.value >= 4000 && p.age && p.age <= 25) {
            buyCandidates.push({ player: p.name, owner: otherTeam.username, reason: "Young star on win-now team - may sell for picks" });
          }
        }
      }

      // Generate specific trade recommendations
      const tradeRecommendations: TradeRecommendation[] = [];
      
      for (const otherTeam of allTeams) {
        if (otherTeam.rosterId === team.rosterId) continue;

        // Find complementary trades
        const theirNeeds = otherTeam.weaknesses;
        const myNeeds = team.weaknesses;
        const theirExcess = otherTeam.strengths;
        const myExcess = team.strengths;

        // Position swaps where both teams benefit
        for (const myPos of myExcess) {
          if (theirNeeds.includes(myPos)) {
            for (const theirPos of theirExcess) {
              if (myNeeds.includes(theirPos)) {
                const myPlayer = team.players.find(p => p.position === myPos && p.value >= 2000);
                const theirPlayer = otherTeam.players.find(p => p.position === theirPos && p.value >= 2000);
                
                if (myPlayer && theirPlayer && Math.abs(myPlayer.value - theirPlayer.value) <= 2000) {
                  tradeRecommendations.push({
                    type: "swap",
                    priority: "high",
                    targetTeam: otherTeam.username,
                    give: [myPlayer.name],
                    receive: [theirPlayer.name],
                    rationale: `Position swap: You have excess ${myPos}, they have excess ${theirPos}. Both improve.`,
                    valueGiven: myPlayer.value,
                    valueReceived: theirPlayer.value,
                  });
                }
              }
            }
          }
        }

        // Rebuild/tank teams should sell vets to contenders
        if ((phase === "rebuild" || phase === "tank") && (otherTeam.mode === "contending")) {
          for (const vet of sellCandidates.slice(0, 3)) {
            const player = team.players.find(p => p.name === vet.player);
            if (player && theirNeeds.includes(player.position)) {
              const otherPicks = picksByOwner[otherTeam.username] || [];
              const availablePick = otherPicks.find(p => p.season === "2027" && p.round <= 2);
              if (availablePick) {
                tradeRecommendations.push({
                  type: "sell",
                  priority: "high",
                  targetTeam: otherTeam.username,
                  give: [player.name],
                  receive: [`${availablePick.season} ${availablePick.round === 1 ? "1st" : "2nd"}`],
                  rationale: `${otherTeam.username} is contending and needs ${player.position}. They'll overpay.`,
                  valueGiven: player.value,
                  valueReceived: availablePick.drewValue || 2000,
                });
              }
            }
          }
        }

        // Contenders should buy from rebuilders
        if (phase === "contend" && (otherTeam.mode === "rebuilding" || otherTeam.mode === "tank")) {
          for (const weakness of myNeeds) {
            const theirAsset = otherTeam.players.find(p => p.position === weakness && p.value >= 2500 && p.age && p.age >= 26);
            if (theirAsset) {
              const myPicks = picksByOwner[team.username] || [];
              const myTradePick = myPicks.find(p => p.season === "2027");
              if (myTradePick) {
                tradeRecommendations.push({
                  type: "buy",
                  priority: "high",
                  targetTeam: otherTeam.username,
                  give: [`${myTradePick.season} ${myTradePick.round === 1 ? "1st" : "2nd"}`],
                  receive: [theirAsset.name],
                  rationale: `Fill your ${weakness} weakness. ${otherTeam.username} is rebuilding and wants picks.`,
                  valueGiven: myTradePick.drewValue || 2500,
                  valueReceived: theirAsset.value,
                });
              }
            }
          }
        }
      }

      // Dedupe and limit recommendations
      const uniqueTrades = tradeRecommendations.filter((trade, idx, arr) => 
        arr.findIndex(t => t.targetTeam === trade.targetTeam && t.give[0] === trade.give[0]) === idx
      ).slice(0, 5);

      // Draft strategy
      let draftStrategy = "";
      const first2026Picks = firstRoundPicks.filter(p => p.season === "2026");
      if (first2026Picks.length > 0) {
        const pickNums = first2026Picks.map(p => p.pick || "mid").join(", ");
        if (team.weaknesses.includes("QB") && phase !== "contend") {
          draftStrategy = `You have ${first2026Picks.length} 1st(s) in 2026 (picks ${pickNums}). Prioritize QB if elite prospect available, otherwise BPA RB/WR.`;
        } else if (team.weaknesses.includes("RB")) {
          draftStrategy = `You have ${first2026Picks.length} 1st(s) in 2026 (picks ${pickNums}). Target RB - Jeremiyah Love (RB1) is consensus top pick.`;
        } else {
          draftStrategy = `You have ${first2026Picks.length} 1st(s) in 2026 (picks ${pickNums}). Go BPA - don't reach for need.`;
        }
      } else if (firstRoundPicks.length > 0) {
        draftStrategy = `No 2026 1sts, but you have ${firstRoundPicks.length} future 1st(s). Consider trading back into 2026 if elite talent falls.`;
      } else {
        draftStrategy = "No 1st round picks. Focus on 2nd round upside and waiver wire.";
      }

      // Key actions based on phase
      const keyActions: string[] = [];
      const first2027Picks = teamPicks.filter(p => p.season === "2027" && p.round === 1);
      const first2026Picks = teamPicks.filter(p => p.season === "2026" && p.round === 1);
      
      if (phase === "contend") {
        keyActions.push("Trade future picks for proven win-now talent");
        keyActions.push("Target RB/WR from rebuilding teams");
        keyActions.push("Don't overpay for aging assets");
      } else if (phase === "retool") {
        keyActions.push("Identify if you're closer to contending or rebuilding");
        keyActions.push("Sell aging pieces that won't be relevant when competitive");
        keyActions.push("Buy young upside from contenders");
      } else if (phase === "rebuild" || phase === "tank") {
        // Check if they already have a lot of picks
        if (first2027Picks.length >= 6) {
          keyActions.push(`You have ${first2027Picks.length} 2027 1sts - HOLD and dominate that draft`);
          keyActions.push("Focus on acquiring young players, not more picks");
        } else if (first2027Picks.length >= 4) {
          keyActions.push(`You have ${first2027Picks.length} 2027 1sts - add 1-2 more if cheap`);
        } else {
          keyActions.push("Accumulate 2027 draft picks (target: 5-6 1sts)");
        }
        
        if (first2026Picks.length >= 2) {
          keyActions.push(`Nail your ${first2026Picks.length} 2026 1st(s) - this is the cornerstone draft`);
        }
        
        keyActions.push("Sell any player over 27 for future value");
        keyActions.push("Target undervalued young players from contenders");
        
        if (phase === "tank") {
          keyActions.push("Finish bottom 3 to maximize 2027 pick value");
        }
      }

      // Summary
      const summary = phase === "contend"
        ? `Strong contender with ${team.eliteCount} elite asset(s). Window is NOW - trade picks for proven talent.`
        : phase === "retool"
        ? `Middle of the pack. Decide: push for playoffs or sell for future. Sitting in the middle is worst outcome.`
        : phase === "rebuild"
        ? `Rebuilding with ${first2027Picks.length} 2027 1sts and ${totalPickValue.toLocaleString()} total pick value. Target 2027 competition window.`
        : `Full tank mode. ${first2027Picks.length} 2027 1sts, ${first2026Picks.length} 2026 1sts. Stay the course - you're positioned well.`;

      // Timeline
      const timeline = phase === "contend"
        ? "2026: Championship window. 2027-28: Decline if not replenished."
        : phase === "retool"
        ? "2026: Fringe playoff. 2027: Must commit to direction."
        : phase === "rebuild"
        ? "2026: Tank. 2027: Compete for playoffs. 2028: Serious contender."
        : "2026: Tank. 2027: Rebuild continues. 2028+: Emerge.";

      return {
        team,
        summary,
        phase,
        keyActions,
        sellCandidates: sellCandidates.slice(0, 5),
        buyCandidates: buyCandidates.slice(0, 5),
        tradeRecommendations: uniqueTrades,
        draftStrategy,
        timeline,
      };
    }

    // Generate roadmaps
    const roadmaps = allTeams.map(generateRoadmap);

    // If specific team requested
    if (rosterId) {
      const roadmap = roadmaps.find(r => r.team.rosterId === parseInt(rosterId));
      if (!roadmap) {
        return NextResponse.json({ error: "Team not found" }, { status: 404 });
      }
      return NextResponse.json(roadmap);
    }

    // Return all roadmaps sorted by total value
    return NextResponse.json({
      roadmaps: roadmaps.sort((a, b) => b.team.totalValue - a.team.totalValue),
      summary: {
        contenders: roadmaps.filter(r => r.phase === "contend").length,
        retooling: roadmaps.filter(r => r.phase === "retool").length,
        rebuilding: roadmaps.filter(r => r.phase === "rebuild").length,
        tanking: roadmaps.filter(r => r.phase === "tank").length,
      },
    });
  } catch (error) {
    console.error("Failed to generate roadmaps:", error);
    return NextResponse.json({ error: "Failed to generate roadmaps", details: String(error) }, { status: 500 });
  }
}
// Deployed Thu Feb 26 05:21:57 UTC 2026
