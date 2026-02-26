import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPlayerValue, getPickValue } from "@/lib/dynasty-values";

interface TradeSuggestion {
  id: string;
  targetTeam: string;
  targetRosterId: number;
  tradeType: "buy" | "sell" | "swap";
  priority: "high" | "medium" | "low";
  rationale: string;
  yourSide: {
    players: Array<{ name: string; position: string; value: number }>;
    picks: Array<{ name: string; value: number }>;
    totalValue: number;
  };
  theirSide: {
    players: Array<{ name: string; position: string; value: number }>;
    picks: Array<{ name: string; value: number }>;
    totalValue: number;
  };
  valueDiff: number;
  fit: string;
}

export async function GET() {
  try {
    // Get settings and all teams
    const settings = await prisma.dynastySettings.findFirst();
    if (!settings) {
      return NextResponse.json({ error: "Settings not found" }, { status: 404 });
    }

    const myTeam = await prisma.dynastyTeam.findFirst({
      where: { leagueId: settings.leagueId, ownerUsername: settings.username },
    });

    const allTeams = await prisma.dynastyTeam.findMany({
      where: { leagueId: settings.leagueId },
    });

    const myPicks = await prisma.dynastyPick.findMany({
      where: { isOwned: true },
    });

    if (!myTeam) {
      return NextResponse.json({ error: "Your team not found" }, { status: 404 });
    }

    const myRoster = myTeam.rosterJson ? JSON.parse(myTeam.rosterJson) : [];
    const myStrengths = myTeam.strengths as string[] || [];
    const myWeaknesses = myTeam.weaknesses as string[] || [];
    const myMode = settings.mode;

    const suggestions: TradeSuggestion[] = [];
    let idCounter = 0;

    // Analyze each other team for trade opportunities
    for (const team of allTeams) {
      if (team.rosterId === myTeam.rosterId) continue;

      const theirRoster = team.rosterJson ? JSON.parse(team.rosterJson) : [];
      const theirStrengths = team.strengths as string[] || [];
      const theirWeaknesses = team.weaknesses as string[] || [];
      const theirMode = team.mode;

      // Find complementary needs
      const myNeedsTheyHave = myWeaknesses.filter((w: string) => theirStrengths.includes(w));
      const theirNeedsWeHave = theirWeaknesses.filter((w: string) => myStrengths.includes(w));

      // === SELL OPPORTUNITIES (Tank mode prioritizes these) ===
      if (myMode === "tank" || myMode === "retool") {
        // Find aging players on my roster that contenders might want
        const sellCandidates = myRoster.filter((p: { age?: number; value: number; position: string }) => 
          (p.age || 25) >= 27 && p.value >= 3000 && theirWeaknesses.includes(p.position)
        );

        for (const player of sellCandidates) {
          // Find picks or young players they might give
          const theirPicks = team.draftCapital as Array<{ season: string; round: number; originalOwner: string }> || [];
          const theirYoungPlayers = theirRoster.filter((p: { age?: number; value: number }) => 
            (p.age || 25) < 26 && p.value >= 2000
          );

          if (theirPicks.length > 0 || theirYoungPlayers.length > 0) {
            const targetReturn = player.value * 1.1; // Ask for 10% premium
            
            // Try to build a package
            let packageValue = 0;
            const theirPackage: { players: Array<{ name: string; position: string; value: number }>; picks: Array<{ name: string; value: number }> } = { players: [], picks: [] };
            
            // Add picks first (preferred in tank mode)
            for (const pick of theirPicks) {
              if (packageValue >= targetReturn) break;
              const pickValue = getPickValue(pick.season, pick.round);
              theirPackage.picks.push({ 
                name: `${pick.season} ${pick.round === 1 ? "1st" : pick.round === 2 ? "2nd" : "3rd"} (${pick.originalOwner})`,
                value: pickValue 
              });
              packageValue += pickValue;
            }

            // Add young players if needed
            if (packageValue < targetReturn * 0.9) {
              for (const yp of theirYoungPlayers.slice(0, 2)) {
                if (packageValue >= targetReturn) break;
                theirPackage.players.push({ name: yp.name, position: yp.position, value: yp.value });
                packageValue += yp.value;
              }
            }

            if (packageValue >= player.value * 0.85) {
              suggestions.push({
                id: `trade-${idCounter++}`,
                targetTeam: team.ownerUsername,
                targetRosterId: team.rosterId,
                tradeType: "sell",
                priority: theirMode === "contending" && player.value >= 5000 ? "high" : "medium",
                rationale: `${team.ownerUsername} needs ${player.position} and is ${theirMode}. Sell ${player.name} for future assets.`,
                yourSide: {
                  players: [{ name: player.name, position: player.position, value: player.value }],
                  picks: [],
                  totalValue: player.value,
                },
                theirSide: {
                  ...theirPackage,
                  totalValue: packageValue,
                },
                valueDiff: packageValue - player.value,
                fit: `You strengthen your rebuild with picks/youth; they get a ${player.position} for their push.`,
              });
            }
          }
        }
      }

      // === BUY OPPORTUNITIES (Contend mode prioritizes these) ===
      if (myMode === "contend" || myMode === "retool") {
        // Find players on rebuilding teams we might want
        const buyCandidates = theirRoster.filter((p: { age?: number; value: number; position: string }) => 
          p.value >= 4000 && myWeaknesses.includes(p.position)
        );

        for (const player of buyCandidates) {
          // What can we offer?
          const offerValue = player.value * 1.15; // Expect to pay premium
          let packageValue = 0;
          const ourPackage: { players: Array<{ name: string; position: string; value: number }>; picks: Array<{ name: string; value: number }> } = { players: [], picks: [] };

          // Offer picks first
          for (const pick of myPicks) {
            if (packageValue >= offerValue) break;
            const pickValue = pick.drewValue || getPickValue(pick.season, pick.round, pick.pick || undefined);
            ourPackage.picks.push({
              name: `${pick.season} ${pick.round === 1 ? "1st" : pick.round === 2 ? "2nd" : "3rd"}`,
              value: pickValue,
            });
            packageValue += pickValue;
          }

          // Add expendable players if needed
          const expendable = myRoster.filter((p: { age?: number; value: number; position: string }) => 
            !myWeaknesses.includes(p.position) && p.value >= 2000 && p.value < 5000 && (p.age || 25) >= 26
          );

          for (const ep of expendable.slice(0, 2)) {
            if (packageValue >= offerValue) break;
            ourPackage.players.push({ name: ep.name, position: ep.position, value: ep.value });
            packageValue += ep.value;
          }

          if (packageValue >= player.value * 0.9 && packageValue <= player.value * 1.3) {
            suggestions.push({
              id: `trade-${idCounter++}`,
              targetTeam: team.ownerUsername,
              targetRosterId: team.rosterId,
              tradeType: "buy",
              priority: player.value >= 6000 && myWeaknesses.includes(player.position) ? "high" : "medium",
              rationale: `Acquire ${player.name} to fill your ${player.position} need. ${team.ownerUsername} is ${theirMode}.`,
              yourSide: {
                ...ourPackage,
                totalValue: packageValue,
              },
              theirSide: {
                players: [{ name: player.name, position: player.position, value: player.value }],
                picks: [],
                totalValue: player.value,
              },
              valueDiff: player.value - packageValue,
              fit: `${player.name} fills your ${player.position} weakness and strengthens your championship push.`,
            });
          }
        }
      }

      // === COMPLEMENTARY SWAPS ===
      if (myNeedsTheyHave.length > 0 && theirNeedsWeHave.length > 0) {
        const pos1 = myNeedsTheyHave[0];
        const pos2 = theirNeedsWeHave[0];

        const theirAsset = theirRoster
          .filter((p: { position: string; value: number }) => p.position === pos1 && p.value >= 3000)
          .sort((a: { value: number }, b: { value: number }) => b.value - a.value)[0];

        const myAsset = myRoster
          .filter((p: { position: string; value: number }) => p.position === pos2 && p.value >= 3000)
          .sort((a: { value: number }, b: { value: number }) => b.value - a.value)[0];

        if (theirAsset && myAsset) {
          const valueDiff = Math.abs(theirAsset.value - myAsset.value);
          
          if (valueDiff < Math.min(theirAsset.value, myAsset.value) * 0.3) {
            suggestions.push({
              id: `trade-${idCounter++}`,
              targetTeam: team.ownerUsername,
              targetRosterId: team.rosterId,
              tradeType: "swap",
              priority: valueDiff < 500 ? "high" : "medium",
              rationale: `Positional swap: you need ${pos1}, they need ${pos2}. Values are close.`,
              yourSide: {
                players: [{ name: myAsset.name, position: myAsset.position, value: myAsset.value }],
                picks: [],
                totalValue: myAsset.value,
              },
              theirSide: {
                players: [{ name: theirAsset.name, position: theirAsset.position, value: theirAsset.value }],
                picks: [],
                totalValue: theirAsset.value,
              },
              valueDiff: theirAsset.value - myAsset.value,
              fit: `Both teams address needs. You upgrade at ${pos1}, they upgrade at ${pos2}.`,
            });
          }
        }
      }
    }

    // Sort by priority and value
    suggestions.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return Math.abs(b.valueDiff) - Math.abs(a.valueDiff);
    });

    // Group by type
    const byType = {
      buy: suggestions.filter(s => s.tradeType === "buy"),
      sell: suggestions.filter(s => s.tradeType === "sell"),
      swap: suggestions.filter(s => s.tradeType === "swap"),
    };

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      yourMode: myMode,
      totalSuggestions: suggestions.length,
      suggestions: suggestions.slice(0, 20),
      byType,
      topPriority: suggestions.filter(s => s.priority === "high").slice(0, 5),
    });
  } catch (error) {
    console.error("Failed to generate trade suggestions:", error);
    return NextResponse.json({ 
      error: "Failed to generate trade suggestions",
      details: String(error)
    }, { status: 500 });
  }
}
