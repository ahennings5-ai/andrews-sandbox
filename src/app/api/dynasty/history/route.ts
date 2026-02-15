import { NextResponse } from "next/server";

const LEAGUE_ID = "1180181459838525440";

interface SleeperTransaction {
  type: string;
  status: string;
  transaction_id: string;
  status_updated: number;
  roster_ids: number[];
  adds: Record<string, number> | null;
  drops: Record<string, number> | null;
  draft_picks: {
    season: string;
    round: number;
    roster_id: number;
    previous_owner_id: number;
    owner_id: number;
  }[] | null;
  waiver_budget: { sender: number; receiver: number; amount: number }[] | null;
}

interface PlayerInfo {
  full_name: string;
  position: string;
  team: string;
}

// GET trade history from Sleeper
export async function GET() {
  try {
    // Fetch transactions from Sleeper
    const txRes = await fetch(
      `https://api.sleeper.app/v1/league/${LEAGUE_ID}/transactions/1`,
      { next: { revalidate: 300 } }
    );
    
    if (!txRes.ok) {
      return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
    }
    
    const transactions: SleeperTransaction[] = await txRes.json();
    
    // Filter to completed trades only
    const trades = transactions.filter(
      (tx) => tx.type === "trade" && tx.status === "complete"
    );
    
    // Fetch player names
    const playersRes = await fetch("https://api.sleeper.app/v1/players/nfl", {
      next: { revalidate: 86400 },
    });
    const allPlayers: Record<string, PlayerInfo> = await playersRes.json();
    
    // Fetch rosters for username mapping
    const rostersRes = await fetch(
      `https://api.sleeper.app/v1/league/${LEAGUE_ID}/rosters`
    );
    const rosters = await rostersRes.json();
    
    const usersRes = await fetch(
      `https://api.sleeper.app/v1/league/${LEAGUE_ID}/users`
    );
    const users = await usersRes.json();
    
    // Build roster ID to username map
    const rosterToUser: Record<number, string> = {};
    for (const roster of rosters) {
      const user = users.find((u: { user_id: string }) => u.user_id === roster.owner_id);
      rosterToUser[roster.roster_id] = user?.display_name || `Team ${roster.roster_id}`;
    }
    
    // Format trades
    const formattedTrades = trades.map((trade) => {
      const date = new Date(trade.status_updated);
      const teams = trade.roster_ids.map((rid) => rosterToUser[rid] || `Team ${rid}`);
      
      // Build assets for each side
      const sides: Record<number, { players: string[]; picks: string[] }> = {};
      for (const rid of trade.roster_ids) {
        sides[rid] = { players: [], picks: [] };
      }
      
      // Players
      if (trade.adds) {
        for (const [playerId, rosterId] of Object.entries(trade.adds)) {
          const player = allPlayers[playerId];
          if (player && sides[rosterId]) {
            sides[rosterId].players.push(
              `${player.full_name} (${player.position})`
            );
          }
        }
      }
      
      // Picks
      if (trade.draft_picks) {
        for (const pick of trade.draft_picks) {
          if (sides[pick.owner_id]) {
            sides[pick.owner_id].picks.push(
              `${pick.season} Round ${pick.round}`
            );
          }
        }
      }
      
      return {
        id: trade.transaction_id,
        date: date.toISOString(),
        dateFormatted: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        teams,
        sides: trade.roster_ids.map((rid) => ({
          team: rosterToUser[rid],
          receives: sides[rid],
        })),
      };
    });
    
    return NextResponse.json({
      success: true,
      trades: formattedTrades.slice(0, 50), // Last 50 trades
      count: formattedTrades.length,
    });
  } catch (error) {
    console.error("Failed to fetch trade history:", error);
    return NextResponse.json(
      { error: "Failed to fetch trade history" },
      { status: 500 }
    );
  }
}
