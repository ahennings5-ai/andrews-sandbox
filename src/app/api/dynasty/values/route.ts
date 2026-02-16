import { NextResponse } from "next/server";

// FantasyCalc API - Live dynasty values
// Superflex (numQbs=2), PPR, 12-team
const FANTASYCALC_API = "https://api.fantasycalc.com/values/current?isDynasty=true&numQbs=2&numTeams=12&ppr=1";

// DynastyProcess CSV - backup source
const DYNASTYPROCESS_CSV = "https://raw.githubusercontent.com/dynastyprocess/data/master/files/values.csv";

export interface LivePlayerValue {
  name: string;
  sleeperId: string | null;
  position: string;
  team: string | null;
  age: number | null;
  value: number;
  rank: number;
  positionRank: number;
  tier: number;
  trend30Day: number;
}

export interface LivePickValue {
  pick: string;
  value: number;
  rank: number;
}

// GET live values from FantasyCalc
export async function GET() {
  try {
    // Fetch from FantasyCalc API
    const res = await fetch(FANTASYCALC_API, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      throw new Error(`FantasyCalc API error: ${res.status}`);
    }

    const data = await res.json();

    // Transform to our format
    const players: LivePlayerValue[] = [];
    const picks: LivePickValue[] = [];

    for (const item of data) {
      if (item.player) {
        players.push({
          name: item.player.name,
          sleeperId: item.player.sleeperId || null,
          position: item.player.position,
          team: item.player.maybeTeam || null,
          age: item.player.maybeAge || null,
          value: item.value,
          rank: item.overallRank,
          positionRank: item.positionRank,
          tier: item.maybeTier || 0,
          trend30Day: item.trend30Day || 0,
        });
      } else if (item.pick) {
        // Pick values from FantasyCalc
        picks.push({
          pick: item.pick.name || `Pick`,
          value: item.value,
          rank: item.overallRank,
        });
      }
    }

    // Sort by value
    players.sort((a, b) => b.value - a.value);

    // Calculate tier labels
    const enrichedPlayers = players.map(p => ({
      ...p,
      tierLabel: p.value >= 9000 ? "Elite" :
                 p.value >= 7000 ? "Star" :
                 p.value >= 5000 ? "Starter" :
                 p.value >= 3000 ? "Flex" :
                 p.value >= 1500 ? "Bench" : "Clogger"
    }));

    return NextResponse.json({
      source: "FantasyCalc",
      updatedAt: new Date().toISOString(),
      playerCount: players.length,
      pickCount: picks.length,
      players: enrichedPlayers,
      picks,
      topPlayers: enrichedPlayers.slice(0, 25),
    });
  } catch (error) {
    console.error("Failed to fetch live values:", error);
    
    // Fallback to DynastyProcess CSV
    try {
      const csvRes = await fetch(DYNASTYPROCESS_CSV);
      const csvText = await csvRes.text();
      
      // Parse CSV
      const lines = csvText.split('\n');
      const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
      
      const players: LivePlayerValue[] = [];
      const picks: LivePickValue[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.replace(/"/g, ''));
        if (values.length < 5) continue;
        
        const name = values[0];
        const pos = values[1];
        const team = values[2];
        const age = parseFloat(values[3]) || null;
        const value2qb = parseInt(values[9]) || 0; // value_2qb column
        
        if (pos === "PICK") {
          picks.push({ pick: name, value: value2qb, rank: picks.length + 1 });
        } else {
          players.push({
            name,
            sleeperId: values[11] || null, // fp_id as fallback
            position: pos,
            team: team || null,
            age,
            value: value2qb,
            rank: players.length + 1,
            positionRank: 0,
            tier: 0,
            trend30Day: 0,
          });
        }
      }

      return NextResponse.json({
        source: "DynastyProcess (fallback)",
        updatedAt: new Date().toISOString(),
        playerCount: players.length,
        pickCount: picks.length,
        players: players.slice(0, 300),
        picks,
      });
    } catch (fallbackError) {
      return NextResponse.json({ 
        error: "Failed to fetch live values from all sources",
        details: String(error)
      }, { status: 500 });
    }
  }
}
