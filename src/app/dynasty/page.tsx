"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell } from "recharts";
import Link from "next/link";

// Types
interface Settings {
  id: string;
  leagueId: string;
  leagueName: string;
  teamName: string;
  mode: "tank" | "retool" | "contend";
  lastSync: string | null;
  phaseRecommendation?: { phase: string; reason: string } | null;
}

interface RosterPlayer {
  sleeperId: string;
  name: string;
  position: string;
  team: string | null;
  age: number | null;
  value: number;
  tier: string;
  trend30Day?: number;
}

interface ValueHistory {
  date: string;
  value: number;
}

interface Player {
  id: string;
  sleeperId: string;
  name: string;
  position: string;
  team: string | null;
  age: number | null;
  ktcValue: number | null;
  fcValue: number | null;
  drewValue: number | null;
  recommendation: string | null;
  recommendReason: string | null;
  trend30Day?: number;
}

interface Pick {
  id: string;
  season: string;
  round: number;
  pick: number | null;
  originalOwner: string;
  currentOwner?: string;
  drewValue: number | null;
}

interface Prospect {
  id: string;
  name: string;
  position: string;
  college: string;
  draftClass: string;
  consensus: number | null;
  drewRank: number | null;
  drewScore: number | null;
  notes: string | null;
  athleticScores: Record<string, number> | null;
  buzz: { title: string; url: string; source: string }[] | null;
}

interface Team {
  id: string;
  rosterId: number;
  ownerUsername: string;
  teamName: string | null;
  totalValue: number | null;
  mode: string | null;
  strengths: string[] | null;
  weaknesses: string[] | null;
  needs: string[] | null;
  roster?: RosterPlayer[];
}

interface TradeAsset {
  type: "player" | "pick";
  id: string;
  name: string;
  position?: string;
  value: number;
  trend30Day?: number;
}

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

interface ValueTrend {
  name: string;
  sleeperId: string | null;
  position: string;
  team: string | null;
  age: number | null;
  currentValue: number;
  trend30Day: number;
  trendPercent: number;
  direction: "rising" | "falling" | "stable";
  rank: number;
}

interface PowerRankingTeam {
  rosterId: number;
  owner: string;
  teamName: string | null;
  mode: string | null;
  totalValue: number;
  rank: number;
  tier: string;
  positionBreakdown: {
    QB: { value: number; count: number; avgAge: number };
    RB: { value: number; count: number; avgAge: number };
    WR: { value: number; count: number; avgAge: number };
    TE: { value: number; count: number; avgAge: number };
  };
  pickValue: number;
  starPlayers: string[];
  strengths: string[];
  weaknesses: string[];
  outlook: string;
  contenderScore: number;
  rebuildScore: number;
  championship: number;
}

interface TradeHistoryItem {
  id: string;
  date: string;
  dateFormatted: string;
  teams: string[];
  sides: {
    team: string;
    receives: {
      players: string[];
      picks: string[];
    };
  }[];
}

interface ProspectReport {
  id: string;
  name: string;
  position: string;
  school: string;
  draftYear: number;
  height: string;
  weight: number;
  projectedPick: string;
  dynastyTier: string;
  grade: string;
  stats?: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  comps: string[];
  ceiling: string;
  floor: string;
  summary: string;
  idealFits: string[];
}

const modeConfig = {
  tank: { label: "Tank", color: "bg-red-500", description: "Accumulate picks & youth" },
  retool: { label: "Retool", color: "bg-yellow-500", description: "Transitioning roster" },
  contend: { label: "Contend", color: "bg-green-500", description: "Win now mode" },
};

const positionColors: Record<string, string> = {
  QB: "bg-rose-500",
  RB: "bg-emerald-500",
  WR: "bg-sky-500",
  TE: "bg-amber-500",
};

// League Gem interface
interface LeagueGem {
  name: string;
  position: string;
  team: string | null;
  age: number | null;
  drewValue: number;
  tier: string;
  owner: string;
  rosterId: number;
  isOwned: boolean;
  gemScore?: number;
}

// ============================================================================
// COMPONENT: Today's Actions Summary
// ============================================================================
function TodaysSummary({ 
  settings, 
  players, 
  picks, 
  totalValue, 
  teams, 
  tradeSuggestions,
  valueTrends 
}: { 
  settings: Settings | null;
  players: Player[];
  picks: Pick[];
  totalValue: number;
  teams: Team[];
  tradeSuggestions: TradeSuggestion[];
  valueTrends: { risers: ValueTrend[]; fallers: ValueTrend[] } | null;
}) {
  const mode = settings?.mode || "tank";
  const sellCandidates = players.filter(p => p.recommendation === "sell");
  const myRisers = valueTrends?.risers.filter(r => players.some(p => p.name === r.name)) || [];
  const myFallers = valueTrends?.fallers.filter(f => players.some(p => p.name === f.name)) || [];
  const highPriorityTrades = tradeSuggestions.filter(t => t.priority === "high").slice(0, 3);

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">📋</span> What Should You Do Today?
        </CardTitle>
        <CardDescription>
          Personalized actions based on your {modeConfig[mode].label} strategy
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <div className="text-2xl font-bold">{totalValue.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total Value</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <div className="text-2xl font-bold">#{teams.findIndex(t => t.ownerUsername === "Hendawg55") + 1 || "?"}</div>
            <div className="text-xs text-muted-foreground">League Rank</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <div className="text-2xl font-bold">{picks.filter(p => p.round === 1).length}</div>
            <div className="text-xs text-muted-foreground">1st Round Picks</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <div className="text-2xl font-bold text-red-500">{sellCandidates.length}</div>
            <div className="text-xs text-muted-foreground">Sell Candidates</div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Top Priority Trade */}
          {highPriorityTrades.length > 0 && (
            <div className="p-3 rounded-lg border border-green-500/30 bg-green-500/5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🎯</span>
                <span className="font-semibold text-green-600">Top Trade Opportunity</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{highPriorityTrades[0].rationale}</p>
              <div className="text-xs">
                <span className="text-red-400">Give: </span>
                {highPriorityTrades[0].yourSide.players.map(p => p.name).join(", ") || highPriorityTrades[0].yourSide.picks.map(p => p.name).join(", ")}
              </div>
            </div>
          )}

          {/* Rising Players You Own */}
          {myRisers.length > 0 && (
            <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📈</span>
                <span className="font-semibold text-emerald-600">Your Risers (30d)</span>
              </div>
              <div className="space-y-1">
                {myRisers.slice(0, 3).map(p => (
                  <div key={p.name} className="flex justify-between text-sm">
                    <span>{p.name}</span>
                    <span className="text-emerald-500">+{p.trend30Day.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Falling Players You Own */}
          {myFallers.length > 0 && (
            <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📉</span>
                <span className="font-semibold text-red-600">Your Fallers (30d)</span>
              </div>
              <div className="space-y-1">
                {myFallers.slice(0, 3).map(p => (
                  <div key={p.name} className="flex justify-between text-sm">
                    <span>{p.name}</span>
                    <span className="text-red-500">{p.trend30Day.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mode-Specific Advice */}
          <div className={`p-3 rounded-lg border ${mode === "tank" ? "border-red-500/30 bg-red-500/5" : mode === "contend" ? "border-green-500/30 bg-green-500/5" : "border-yellow-500/30 bg-yellow-500/5"}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{mode === "tank" ? "🎰" : mode === "contend" ? "🏆" : "🔄"}</span>
              <span className="font-semibold">{modeConfig[mode].label} Strategy</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {mode === "tank" ? "Focus on selling aging veterans for picks. Target 2027+ draft capital." :
               mode === "contend" ? "Look for win-now pieces. Trade future picks for proven talent." :
               "Balance youth and production. Find value in mispriced assets."}
            </p>
          </div>

          {/* Sell Candidates */}
          {sellCandidates.length > 0 && (
            <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💰</span>
                <span className="font-semibold text-amber-600">Sell These Players</span>
              </div>
              <div className="space-y-1">
                {sellCandidates.slice(0, 3).map(p => (
                  <div key={p.id} className="text-sm flex justify-between">
                    <span>{p.name}</span>
                    <Badge variant="outline" className="text-xs">{p.drewValue?.toLocaleString()}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Win */}
          <div className="p-3 rounded-lg border border-blue-500/30 bg-blue-500/5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">⚡</span>
              <span className="font-semibold text-blue-600">Quick Win</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Check the Value Trends tab to find buy-low targets on other rosters before their value rebounds.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// COMPONENT: Enhanced Trade Calculator
// ============================================================================
function EnhancedTradeCalculator({
  players,
  picks,
  teams,
  positionColors,
  mySideAssets,
  theirSideAssets,
  tradePartner,
  setMySideAssets,
  setTheirSideAssets,
  setTradePartner,
}: {
  players: Player[];
  picks: Pick[];
  teams: Team[];
  positionColors: Record<string, string>;
  mySideAssets: TradeAsset[];
  theirSideAssets: TradeAsset[];
  tradePartner: (Team & { roster?: RosterPlayer[] }) | null;
  setMySideAssets: (assets: TradeAsset[]) => void;
  setTheirSideAssets: (assets: TradeAsset[]) => void;
  setTradePartner: (team: (Team & { roster?: RosterPlayer[] }) | null) => void;
}) {
  const [searchMy, setSearchMy] = useState("");
  const [searchTheir, setSearchTheir] = useState("");
  const [partnerPicks, setPartnerPicks] = useState<Pick[]>([]);

  // Load partner's picks when partner changes
  useEffect(() => {
    if (tradePartner) {
      // Simulate picks they might own - in real app, fetch from API
      setPartnerPicks([]);
    }
  }, [tradePartner]);

  const addToMySide = (asset: TradeAsset) => {
    if (!mySideAssets.find(a => a.id === asset.id)) {
      setMySideAssets([...mySideAssets, asset]);
    }
  };

  const addToTheirSide = (asset: TradeAsset) => {
    if (!theirSideAssets.find(a => a.id === asset.id)) {
      setTheirSideAssets([...theirSideAssets, asset]);
    }
  };

  const removeFromMySide = (id: string) => {
    setMySideAssets(mySideAssets.filter(a => a.id !== id));
  };

  const removeFromTheirSide = (id: string) => {
    setTheirSideAssets(theirSideAssets.filter(a => a.id !== id));
  };

  const clearTrade = () => {
    setMySideAssets([]);
    setTheirSideAssets([]);
    setTradePartner(null);
  };

  const mySideValue = mySideAssets.reduce((sum, a) => sum + a.value, 0);
  const theirSideValue = theirSideAssets.reduce((sum, a) => sum + a.value, 0);
  const valueDiff = theirSideValue - mySideValue;
  const diffPercent = mySideValue > 0 ? (valueDiff / mySideValue) * 100 : 0;

  // Trade fairness gauge
  const getFairnessLevel = () => {
    const absPercent = Math.abs(diffPercent);
    if (absPercent < 5) return { label: "FAIR", color: "bg-yellow-500", emoji: "⚖️" };
    if (absPercent < 15) return { label: valueDiff > 0 ? "SLIGHT WIN" : "SLIGHT OVERPAY", color: valueDiff > 0 ? "bg-green-400" : "bg-orange-400", emoji: valueDiff > 0 ? "👍" : "👎" };
    if (absPercent < 30) return { label: valueDiff > 0 ? "SOLID WIN" : "OVERPAY", color: valueDiff > 0 ? "bg-green-500" : "bg-red-400", emoji: valueDiff > 0 ? "✅" : "⚠️" };
    return { label: valueDiff > 0 ? "SMASH ACCEPT" : "BAD TRADE", color: valueDiff > 0 ? "bg-emerald-600" : "bg-red-600", emoji: valueDiff > 0 ? "🔥" : "❌" };
  };

  const fairness = getFairnessLevel();

  // Filtered players for search
  const filteredMyPlayers = players.filter(p => 
    p.name.toLowerCase().includes(searchMy.toLowerCase()) &&
    !mySideAssets.find(a => a.id === p.sleeperId)
  );

  const filteredTheirPlayers = (tradePartner?.roster || []).filter((p: RosterPlayer) =>
    p.name.toLowerCase().includes(searchTheir.toLowerCase()) &&
    !theirSideAssets.find(a => a.id === p.sleeperId)
  );

  const selectTradePartner = async (team: Team) => {
    setTradePartner(team);
    setTheirSideAssets([]);
    try {
      const res = await fetch(`/api/dynasty/teams?rosterId=${team.rosterId}`);
      if (res.ok) {
        const data = await res.json();
        const roster = data.team?.roster || [];
        setTradePartner({ ...team, roster });
      }
    } catch (e) {
      console.error("Failed to load team roster:", e);
    }
  };

  return (
    <div className="space-y-4">
      {/* Trade Partner Selection - Compact */}
      {!tradePartner && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Select Trade Partner</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {teams.filter(t => t.ownerUsername !== "Hendawg55").map((team) => (
                <Button
                  key={team.id}
                  variant="outline"
                  size="sm"
                  onClick={() => selectTradePartner(team)}
                  className="text-xs"
                >
                  {team.ownerUsername}
                  <Badge variant="secondary" className="ml-1 text-[10px]">
                    {(team.totalValue || 0) >= 60000 ? "🏆" : (team.totalValue || 0) >= 45000 ? "📈" : "🔄"}
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Trade Interface */}
      <div className="grid lg:grid-cols-[1fr,auto,1fr] gap-4">
        {/* Your Side */}
        <Card className="border-blue-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="text-lg">🏠</span> You Give
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Added Assets */}
            <div className="min-h-[80px] space-y-1">
              {mySideAssets.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">Select assets below</p>
              ) : (
                mySideAssets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-2 rounded bg-muted/50 text-sm">
                    <div className="flex items-center gap-2">
                      {asset.position && <Badge className={`${positionColors[asset.position]} text-[10px]`}>{asset.position}</Badge>}
                      <span className="truncate max-w-[120px]">{asset.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs">{asset.value.toLocaleString()}</span>
                      <Button size="sm" variant="ghost" className="h-5 w-5 p-0" onClick={() => removeFromMySide(asset.id)}>×</Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Total */}
            <div className="border-t pt-2 flex justify-between font-bold text-sm">
              <span>Total:</span>
              <span className="text-blue-500">{mySideValue.toLocaleString()}</span>
            </div>

            {/* Quick Add - Players */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Search your players..."
                value={searchMy}
                onChange={(e) => setSearchMy(e.target.value)}
                className="w-full px-3 py-1.5 text-sm rounded border border-border bg-background"
              />
              <div className="max-h-[200px] overflow-y-auto space-y-1">
                {filteredMyPlayers.slice(0, 10).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => addToMySide({ type: "player", id: p.sleeperId, name: p.name, position: p.position, value: p.drewValue || 0 })}
                    className="w-full flex items-center justify-between p-1.5 rounded border border-border hover:bg-muted/50 text-xs"
                  >
                    <div className="flex items-center gap-1">
                      <Badge className={`${positionColors[p.position]} text-[9px] px-1`}>{p.position}</Badge>
                      <span className="truncate max-w-[100px]">{p.name}</span>
                    </div>
                    <span className="font-mono">{p.drewValue?.toLocaleString()}</span>
                  </button>
                ))}
              </div>

              {/* Picks */}
              <div className="flex flex-wrap gap-1">
                {picks.filter(p => !mySideAssets.find(a => a.id === p.id)).slice(0, 6).map((p) => (
                  <Button
                    key={p.id}
                    variant="outline"
                    size="sm"
                    className="text-[10px] h-6 px-2"
                    onClick={() => addToMySide({ type: "pick", id: p.id, name: `${p.season} ${p.round === 1 ? "1st" : p.round === 2 ? "2nd" : "3rd"}`, value: p.drewValue || 0 })}
                  >
                    {p.season.slice(2)} R{p.round}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Center Analysis */}
        <div className="flex flex-col items-center justify-center py-4 lg:py-0">
          {(mySideAssets.length > 0 || theirSideAssets.length > 0) && (
            <div className="text-center space-y-2">
              {/* Fairness Gauge */}
              <div className={`${fairness.color} text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2`}>
                <span>{fairness.emoji}</span>
                <span>{fairness.label}</span>
              </div>
              
              {/* Value Diff */}
              <div className={`text-2xl font-bold ${valueDiff > 0 ? "text-green-500" : valueDiff < 0 ? "text-red-500" : "text-yellow-500"}`}>
                {valueDiff > 0 ? "+" : ""}{valueDiff.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                {diffPercent > 0 ? "+" : ""}{diffPercent.toFixed(1)}% value
              </div>

              {/* Arrow */}
              <div className="text-3xl">
                {valueDiff > 0 ? "←" : valueDiff < 0 ? "→" : "↔"}
              </div>

              <Button variant="outline" size="sm" onClick={clearTrade}>Clear</Button>
            </div>
          )}
        </div>

        {/* Their Side */}
        <Card className={`border-green-500/30 ${!tradePartner ? "opacity-50" : ""}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎯</span> You Get
              </div>
              {tradePartner && (
                <Badge variant="outline" className="text-xs">
                  {tradePartner.ownerUsername}
                  <button onClick={() => setTradePartner(null)} className="ml-1">×</button>
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Added Assets */}
            <div className="min-h-[80px] space-y-1">
              {theirSideAssets.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  {tradePartner ? "Select their assets below" : "Select a trade partner first"}
                </p>
              ) : (
                theirSideAssets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-2 rounded bg-muted/50 text-sm">
                    <div className="flex items-center gap-2">
                      {asset.position && <Badge className={`${positionColors[asset.position]} text-[10px]`}>{asset.position}</Badge>}
                      <span className="truncate max-w-[120px]">{asset.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs">{asset.value.toLocaleString()}</span>
                      <Button size="sm" variant="ghost" className="h-5 w-5 p-0" onClick={() => removeFromTheirSide(asset.id)}>×</Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Total */}
            <div className="border-t pt-2 flex justify-between font-bold text-sm">
              <span>Total:</span>
              <span className="text-green-500">{theirSideValue.toLocaleString()}</span>
            </div>

            {/* Quick Add - Their Players */}
            {tradePartner && tradePartner.roster && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Search their players..."
                  value={searchTheir}
                  onChange={(e) => setSearchTheir(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm rounded border border-border bg-background"
                />
                <div className="max-h-[200px] overflow-y-auto space-y-1">
                  {filteredTheirPlayers.slice(0, 10).map((p: RosterPlayer) => (
                    <button
                      key={p.sleeperId}
                      onClick={() => addToTheirSide({ type: "player", id: p.sleeperId, name: p.name, position: p.position, value: p.value })}
                      className="w-full flex items-center justify-between p-1.5 rounded border border-border hover:bg-muted/50 text-xs"
                    >
                      <div className="flex items-center gap-1">
                        <Badge className={`${positionColors[p.position] || "bg-gray-500"} text-[9px] px-1`}>{p.position}</Badge>
                        <span className="truncate max-w-[100px]">{p.name}</span>
                      </div>
                      <span className="font-mono">{p.value.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Trade Analysis Details */}
      {(mySideAssets.length > 0 && theirSideAssets.length > 0) && (
        <Card className="border-primary/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">📊 Trade Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-1">Position Impact</h4>
                <div className="space-y-1">
                  {["QB", "RB", "WR", "TE"].map(pos => {
                    const giving = mySideAssets.filter(a => a.position === pos).reduce((s, a) => s + a.value, 0);
                    const getting = theirSideAssets.filter(a => a.position === pos).reduce((s, a) => s + a.value, 0);
                    if (giving === 0 && getting === 0) return null;
                    const net = getting - giving;
                    return (
                      <div key={pos} className="flex justify-between">
                        <Badge className={positionColors[pos]}>{pos}</Badge>
                        <span className={net > 0 ? "text-green-500" : net < 0 ? "text-red-500" : ""}>
                          {net > 0 ? "+" : ""}{net.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-1">Age Analysis</h4>
                <div className="text-muted-foreground">
                  {(() => {
                    const myAvgAge = mySideAssets.filter(a => a.type === "player").length > 0
                      ? players.filter(p => mySideAssets.find(a => a.id === p.sleeperId)).reduce((s, p) => s + (p.age || 25), 0) / mySideAssets.filter(a => a.type === "player").length
                      : 0;
                    const theirAvgAge = theirSideAssets.filter(a => a.type === "player").length > 0
                      ? (tradePartner?.roster || []).filter((p: RosterPlayer) => theirSideAssets.find(a => a.id === p.sleeperId)).reduce((s: number, p: RosterPlayer) => s + (p.age || 25), 0) / theirSideAssets.filter(a => a.type === "player").length
                      : 0;
                    const ageDiff = theirAvgAge - myAvgAge;
                    return (
                      <>
                        <div>You give avg age: {myAvgAge.toFixed(1)}</div>
                        <div>You get avg age: {theirAvgAge.toFixed(1)}</div>
                        <div className={ageDiff < 0 ? "text-green-500" : ageDiff > 0 ? "text-amber-500" : ""}>
                          {ageDiff < 0 ? "Getting younger! 📈" : ageDiff > 0 ? "Getting older ⚠️" : "Age neutral"}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-1">Verdict</h4>
                <p className="text-muted-foreground">
                  {valueDiff > 1000 ? "This trade heavily favors you. The other side probably won't accept without adjustments." :
                   valueDiff > 500 ? "Good value for you. Consider if it fits your roster needs." :
                   valueDiff > -500 ? "Fair trade. Comes down to positional needs and strategy." :
                   valueDiff > -1000 ? "You're overpaying slightly. Only proceed if you really need the assets." :
                   "This trade favors the other side significantly. Reconsider unless desperate."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ============================================================================
// COMPONENT: Value Trends Tab
// ============================================================================
function ValueTrendsTab({ positionColors }: { positionColors: Record<string, string> }) {
  const [trends, setTrends] = useState<{ risers: ValueTrend[]; fallers: ValueTrend[]; byPosition: Record<string, { risers: ValueTrend[]; fallers: ValueTrend[] }> } | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "QB" | "RB" | "WR" | "TE">("all");

  useEffect(() => {
    async function loadTrends() {
      try {
        const res = await fetch("/api/dynasty/value-trends");
        if (res.ok) {
          const data = await res.json();
          setTrends(data);
        }
      } catch (error) {
        console.error("Failed to load trends:", error);
      } finally {
        setLoading(false);
      }
    }
    loadTrends();
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading value trends...</div>;
  }

  if (!trends) {
    return <div className="text-center py-8 text-muted-foreground">Failed to load trends.</div>;
  }

  const displayRisers = filter === "all" ? trends.risers : (trends.byPosition[filter]?.risers || []);
  const displayFallers = filter === "all" ? trends.fallers : (trends.byPosition[filter]?.fallers || []);

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>All</Button>
        {(["QB", "RB", "WR", "TE"] as const).map(pos => (
          <Button
            key={pos}
            variant={filter === pos ? "default" : "outline"}
            size="sm"
            className={filter === pos ? positionColors[pos] : ""}
            onClick={() => setFilter(pos)}
          >
            {pos}
          </Button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Risers */}
        <Card className="border-green-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-500">
              <span className="text-2xl">📈</span> Rising (30 Day)
            </CardTitle>
            <CardDescription>Players gaining the most dynasty value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {displayRisers.map((player, idx) => (
                <div
                  key={`${player.name}-${idx}`}
                  className="flex items-center justify-between p-3 rounded-lg border border-green-500/20 bg-green-500/5"
                >
                  <div className="flex items-center gap-3">
                    <Badge className={positionColors[player.position] || "bg-gray-500"}>{player.position}</Badge>
                    <div>
                      <div className="font-medium">{player.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {player.team || "FA"} • Age {player.age} • #{player.rank}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-500">+{player.trend30Day.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{player.currentValue.toLocaleString()} total</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fallers */}
        <Card className="border-red-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500">
              <span className="text-2xl">📉</span> Falling (30 Day)
            </CardTitle>
            <CardDescription>Players losing the most dynasty value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {displayFallers.map((player, idx) => (
                <div
                  key={`${player.name}-${idx}`}
                  className="flex items-center justify-between p-3 rounded-lg border border-red-500/20 bg-red-500/5"
                >
                  <div className="flex items-center gap-3">
                    <Badge className={positionColors[player.position] || "bg-gray-500"}>{player.position}</Badge>
                    <div>
                      <div className="font-medium">{player.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {player.team || "FA"} • Age {player.age} • #{player.rank}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-500">{player.trend30Day.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{player.currentValue.toLocaleString()} total</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT: Power Rankings Tab
// ============================================================================
function PowerRankingsTab({ positionColors }: { positionColors: Record<string, string> }) {
  const [rankings, setRankings] = useState<PowerRankingTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);

  useEffect(() => {
    async function loadRankings() {
      try {
        const res = await fetch("/api/dynasty/power-rankings");
        if (res.ok) {
          const data = await res.json();
          setRankings(data.rankings || []);
        }
      } catch (error) {
        console.error("Failed to load rankings:", error);
      } finally {
        setLoading(false);
      }
    }
    loadRankings();
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading power rankings...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Summary Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>League Value Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rankings} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="owner" tick={{ fontSize: 10 }} width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                  formatter={(value) => [Number(value).toLocaleString(), "Value"]}
                />
                <Bar dataKey="totalValue" radius={[0, 4, 4, 0]}>
                  {rankings.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.owner === "Hendawg55" ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Team Cards */}
      <div className="space-y-3">
        {rankings.map((team) => (
          <Card 
            key={team.rosterId}
            className={`cursor-pointer transition-all ${
              team.owner === "Hendawg55" ? "border-primary/50" : "border-border"
            } ${expandedTeam === team.rosterId ? "ring-2 ring-primary/30" : ""}`}
            onClick={() => setExpandedTeam(expandedTeam === team.rosterId ? null : team.rosterId)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                    team.rank <= 3 ? "bg-amber-500/20 text-amber-500" :
                    team.rank <= 6 ? "bg-blue-500/20 text-blue-500" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {team.rank}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{team.owner}</span>
                      {team.owner === "Hendawg55" && <Badge variant="secondary" className="text-xs">You</Badge>}
                      <Badge variant={team.tier === "Elite" ? "default" : "outline"} className="text-xs">{team.tier}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{team.teamName || "—"}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xl">{team.totalValue.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">
                    🏆 {team.championship}% championship odds
                  </div>
                </div>
              </div>

              {/* Expanded View */}
              {expandedTeam === team.rosterId && (
                <div className="mt-4 pt-4 border-t space-y-4">
                  <p className="text-sm text-muted-foreground italic">{team.outlook}</p>

                  {/* Position Breakdown */}
                  <div className="grid grid-cols-4 gap-2">
                    {(["QB", "RB", "WR", "TE"] as const).map(pos => (
                      <div key={pos} className="text-center p-2 rounded bg-muted/50">
                        <Badge className={positionColors[pos]}>{pos}</Badge>
                        <div className="font-bold mt-1">{team.positionBreakdown[pos].value.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          {team.positionBreakdown[pos].count} players
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Avg {team.positionBreakdown[pos].avgAge.toFixed(1)} yrs
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Strengths/Weaknesses */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-green-500 font-medium">Strengths:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {team.strengths.map((s, i) => <Badge key={i} variant="outline" className="text-xs">{s}</Badge>)}
                        {team.strengths.length === 0 && <span className="text-muted-foreground">None</span>}
                      </div>
                    </div>
                    <div>
                      <span className="text-red-500 font-medium">Weaknesses:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {team.weaknesses.map((w, i) => <Badge key={i} variant="outline" className="text-xs">{w}</Badge>)}
                        {team.weaknesses.length === 0 && <span className="text-muted-foreground">None</span>}
                      </div>
                    </div>
                  </div>

                  {/* Star Players */}
                  {team.starPlayers.length > 0 && (
                    <div>
                      <span className="text-amber-500 font-medium text-sm">⭐ Stars:</span>
                      <span className="text-sm text-muted-foreground ml-2">{team.starPlayers.join(", ")}</span>
                    </div>
                  )}

                  {/* Contender vs Rebuild Score */}
                  <div className="flex gap-4 text-sm">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-green-500">Contender Score</span>
                        <span>{team.contenderScore}</span>
                      </div>
                      <Progress value={team.contenderScore} className="h-2" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-blue-500">Rebuild Score</span>
                        <span>{team.rebuildScore}</span>
                      </div>
                      <Progress value={team.rebuildScore} className="h-2" />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT: Gems Tab (from original)
// ============================================================================
function GemsTab({ teams, positionColors }: { teams: Team[]; positionColors: Record<string, string> }) {
  const [gems, setGems] = useState<{
    buyTargets: LeagueGem[];
    hiddenGems: LeagueGem[];
    agingAssets: LeagueGem[];
    byPosition: { QB: LeagueGem[]; RB: LeagueGem[]; WR: LeagueGem[] };
    totalLeaguePlayers: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "QB" | "RB" | "WR" | "TE">("all");

  useEffect(() => {
    async function loadGems() {
      try {
        const res = await fetch("/api/dynasty/gems");
        if (res.ok) {
          const data = await res.json();
          setGems(data);
        }
      } catch (error) {
        console.error("Failed to load gems:", error);
      } finally {
        setLoading(false);
      }
    }
    loadGems();
  }, []);

  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading gems...</div>;
  if (!gems) return <div className="text-center py-8 text-muted-foreground">Failed to load gems.</div>;

  const filteredBuyTargets = filter === "all" ? gems.buyTargets : gems.buyTargets.filter(p => p.position === filter);
  const filteredHiddenGems = filter === "all" ? gems.hiddenGems : gems.hiddenGems.filter(p => p.position === filter);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>All</Button>
        {(["QB", "RB", "WR", "TE"] as const).map(pos => (
          <Button key={pos} variant={filter === pos ? "default" : "outline"} size="sm" className={filter === pos ? positionColors[pos] : ""} onClick={() => setFilter(pos)}>{pos}</Button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><span className="text-2xl">🎯</span> Trade Targets</CardTitle>
            <CardDescription>Highest-value players on other teams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredBuyTargets.map((p, idx) => (
                <div key={`${p.name}-${idx}`} className="flex items-center justify-between p-3 rounded-lg border border-primary/20 bg-primary/5">
                  <div className="flex items-center gap-3">
                    <Badge className={positionColors[p.position] || "bg-gray-500"}>{p.position}</Badge>
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.team || "FA"} • Age {p.age} • {p.owner}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{p.drewValue.toLocaleString()}</div>
                    <Badge variant="outline" className="text-xs">{p.tier}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><span className="text-2xl">💎</span> Hidden Gems</CardTitle>
            <CardDescription>Young players (under 26) with upside</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredHiddenGems.map((p, idx) => (
                <div key={`${p.name}-${idx}`} className="flex items-center justify-between p-3 rounded-lg border border-green-500/20 bg-green-500/5">
                  <div className="flex items-center gap-3">
                    <Badge className={positionColors[p.position] || "bg-gray-500"}>{p.position}</Badge>
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.team || "FA"} • Age {p.age} • {p.owner}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-500">{p.drewValue.toLocaleString()}</div>
                    <Badge variant="outline" className="text-xs">{p.tier}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ============================================================================
// TEAM ROADMAPS TAB
// ============================================================================

interface RoadmapData {
  team: {
    rosterId: number;
    username: string;
    teamName: string | null;
    mode: string;
    totalValue: number;
    avgAge: number;
    strengths: string[];
    weaknesses: string[];
    players: { name: string; position: string; value: number; age: number | null; tier: string }[];
    eliteCount: number;
    starCount: number;
    cloggerCount: number;
  };
  summary: string;
  phase: "contend" | "retool" | "rebuild" | "tank";
  keyActions: string[];
  sellCandidates: { player: string; reason: string; targetValue: string }[];
  buyCandidates: { player: string; owner: string; reason: string }[];
  tradeRecommendations: {
    type: "sell" | "buy" | "swap";
    priority: "high" | "medium" | "low";
    targetTeam: string;
    give: string[];
    receive: string[];
    rationale: string;
    valueGiven: number;
    valueReceived: number;
  }[];
  draftStrategy: string;
  timeline: string;
}

function TeamRoadmapsTab({ teams }: { teams: Team[] }) {
  const [roadmaps, setRoadmaps] = useState<RoadmapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  useEffect(() => {
    async function loadRoadmaps() {
      try {
        const res = await fetch("/api/dynasty/roadmap");
        if (res.ok) {
          const data = await res.json();
          setRoadmaps(data.roadmaps || []);
        }
      } catch (error) {
        console.error("Failed to load roadmaps:", error);
      } finally {
        setLoading(false);
      }
    }
    loadRoadmaps();
  }, []);

  if (loading) return <div className="text-center py-8 text-muted-foreground">Analyzing all teams...</div>;

  const phaseColors: Record<string, string> = {
    contend: "bg-green-500/20 text-green-400 border-green-500/50",
    retool: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
    rebuild: "bg-blue-500/20 text-blue-400 border-blue-500/50",
    tank: "bg-red-500/20 text-red-400 border-red-500/50",
  };

  const phaseEmoji: Record<string, string> = {
    contend: "🏆",
    retool: "🔧",
    rebuild: "🏗️",
    tank: "📉",
  };

  const selectedRoadmap = selectedTeam ? roadmaps.find(r => r.team.rosterId === selectedTeam) : null;

  return (
    <div className="space-y-6">
      {/* Team Selector Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {roadmaps.map((r) => (
          <Card
            key={r.team.rosterId}
            className={`cursor-pointer transition-all hover:ring-2 hover:ring-primary/50 ${
              selectedTeam === r.team.rosterId ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedTeam(r.team.rosterId)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{phaseEmoji[r.phase]}</span>
                <Badge className={phaseColors[r.phase]}>{r.phase}</Badge>
              </div>
              <div className="font-semibold truncate">{r.team.username}</div>
              <div className="text-sm text-muted-foreground">
                {r.team.totalValue.toLocaleString()} value
              </div>
              {r.team.rosterId === 1 && (
                <Badge variant="outline" className="mt-2 text-xs">YOUR TEAM</Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Team Roadmap */}
      {selectedRoadmap && (
        <Card className="border-2 border-primary/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-3xl">{phaseEmoji[selectedRoadmap.phase]}</span>
                  {selectedRoadmap.team.username}
                  {selectedRoadmap.team.teamName && (
                    <span className="text-muted-foreground font-normal">({selectedRoadmap.team.teamName})</span>
                  )}
                </CardTitle>
                <CardDescription className="mt-2">{selectedRoadmap.summary}</CardDescription>
              </div>
              <Badge className={`text-lg px-4 py-2 ${phaseColors[selectedRoadmap.phase]}`}>
                {selectedRoadmap.phase.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted">
                <div className="text-2xl font-bold">{selectedRoadmap.team.totalValue.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Roster Value</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted">
                <div className="text-2xl font-bold">{selectedRoadmap.team.avgAge}</div>
                <div className="text-xs text-muted-foreground">Avg Age</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted">
                <div className="text-2xl font-bold">{selectedRoadmap.team.eliteCount + selectedRoadmap.team.starCount}</div>
                <div className="text-xs text-muted-foreground">Elite/Star Players</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted">
                <div className="text-2xl font-bold">{selectedRoadmap.team.cloggerCount}</div>
                <div className="text-xs text-muted-foreground">Roster Cloggers</div>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2 text-green-400">✅ Strengths</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRoadmap.team.strengths.length > 0 
                    ? selectedRoadmap.team.strengths.map(s => <Badge key={s} variant="outline" className="border-green-500/50">{s}</Badge>)
                    : <span className="text-muted-foreground text-sm">No clear strengths</span>}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-red-400">❌ Weaknesses</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRoadmap.team.weaknesses.length > 0
                    ? selectedRoadmap.team.weaknesses.map(w => <Badge key={w} variant="outline" className="border-red-500/50">{w}</Badge>)
                    : <span className="text-muted-foreground text-sm">No clear weaknesses</span>}
                </div>
              </div>
            </div>

            {/* Key Actions */}
            <div>
              <h4 className="font-semibold mb-3">🎯 Key Actions</h4>
              <div className="space-y-2">
                {selectedRoadmap.keyActions.map((action, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <span className="text-primary font-bold">{idx + 1}.</span>
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trade Recommendations */}
            {selectedRoadmap.tradeRecommendations.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">🔄 Recommended Trades</h4>
                <div className="space-y-3">
                  {selectedRoadmap.tradeRecommendations.map((trade, idx) => (
                    <Card key={idx} className={`border ${
                      trade.priority === "high" ? "border-green-500/50 bg-green-500/5" : 
                      trade.priority === "medium" ? "border-yellow-500/50 bg-yellow-500/5" : 
                      "border-border"
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={trade.priority === "high" ? "default" : "outline"}>
                            {trade.priority.toUpperCase()} PRIORITY
                          </Badge>
                          <span className="text-sm text-muted-foreground">→ {trade.targetTeam}</span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 my-3">
                          <div className="p-3 rounded bg-red-500/10 border border-red-500/30">
                            <div className="text-xs text-red-400 mb-1">GIVE</div>
                            <div className="font-medium">{trade.give.join(", ")}</div>
                            <div className="text-xs text-muted-foreground">{trade.valueGiven.toLocaleString()} value</div>
                          </div>
                          <div className="p-3 rounded bg-green-500/10 border border-green-500/30">
                            <div className="text-xs text-green-400 mb-1">RECEIVE</div>
                            <div className="font-medium">{trade.receive.join(", ")}</div>
                            <div className="text-xs text-muted-foreground">{trade.valueReceived.toLocaleString()} value</div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground italic">{trade.rationale}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Sell & Buy Candidates */}
            <div className="grid md:grid-cols-2 gap-4">
              {selectedRoadmap.sellCandidates.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-red-400">📤 Sell Candidates</h4>
                  <div className="space-y-2">
                    {selectedRoadmap.sellCandidates.map((c, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-red-500/30 bg-red-500/5">
                        <div className="font-medium">{c.player}</div>
                        <div className="text-xs text-muted-foreground">{c.reason}</div>
                        <div className="text-xs text-green-400 mt-1">Target: {c.targetValue}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selectedRoadmap.buyCandidates.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-green-400">📥 Buy Candidates</h4>
                  <div className="space-y-2">
                    {selectedRoadmap.buyCandidates.map((c, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-green-500/30 bg-green-500/5">
                        <div className="font-medium">{c.player}</div>
                        <div className="text-xs text-muted-foreground">Owner: {c.owner}</div>
                        <div className="text-xs text-blue-400 mt-1">{c.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Draft Strategy & Timeline */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted">
                <h4 className="font-semibold mb-2">🎓 Draft Strategy</h4>
                <p className="text-sm text-muted-foreground">{selectedRoadmap.draftStrategy}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <h4 className="font-semibold mb-2">📅 Timeline</h4>
                <p className="text-sm text-muted-foreground">{selectedRoadmap.timeline}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!selectedTeam && (
        <div className="text-center py-12 text-muted-foreground">
          <span className="text-4xl block mb-4">👆</span>
          Click a team above to see their offseason roadmap
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
export default function DynastyPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [picks, setPicks] = useState<Pick[]>([]);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [valueHistory, setValueHistory] = useState<ValueHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [prospectClass, setProspectClass] = useState<"2026" | "2027">("2026");
  const [totalValue, setTotalValue] = useState(0);
  const [phaseRecommendation, setPhaseRecommendation] = useState<{ phase: string; reason: string } | null>(null);
  const [selectedTeamRoster, setSelectedTeamRoster] = useState<RosterPlayer[]>([]);
  const [loadingTeamRoster, setLoadingTeamRoster] = useState(false);
  const [prospectReport, setProspectReport] = useState<ProspectReport | null>(null);
  const [loadingProspectReport, setLoadingProspectReport] = useState(false);
  const [selectedTeamPicks, setSelectedTeamPicks] = useState<Pick[]>([]);

  // Trade calculator state
  const [mySideAssets, setMySideAssets] = useState<TradeAsset[]>([]);
  const [theirSideAssets, setTheirSideAssets] = useState<TradeAsset[]>([]);
  const [tradePartner, setTradePartner] = useState<(Team & { roster?: RosterPlayer[] }) | null>(null);

  // New state for enhanced features
  const [tradeSuggestions, setTradeSuggestions] = useState<TradeSuggestion[]>([]);
  const [valueTrends, setValueTrends] = useState<{ risers: ValueTrend[]; fallers: ValueTrend[] } | null>(null);
  const [tradeHistory, setTradeHistory] = useState<TradeHistoryItem[]>([]);
  const [loadingTrades, setLoadingTrades] = useState(false);

  // Load data
  const loadData = useCallback(async () => {
    try {
      const [settingsRes, playersRes, prospectsRes, teamsRes] = await Promise.all([
        fetch("/api/dynasty/settings"),
        fetch("/api/dynasty/players"),
        fetch(`/api/dynasty/prospects?class=${prospectClass}`),
        fetch("/api/dynasty/teams"),
      ]);

      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setSettings(data);
        if (data.phaseRecommendation) {
          const rec = typeof data.phaseRecommendation === "string" 
            ? JSON.parse(data.phaseRecommendation) 
            : data.phaseRecommendation;
          setPhaseRecommendation(rec);
        }
      }

      if (playersRes.ok) {
        const data = await playersRes.json();
        setPlayers(data.players || []);
        setPicks(data.picks || []);
        setTotalValue(data.totalValue || 0);
      }

      if (prospectsRes.ok) {
        const data = await prospectsRes.json();
        setProspects(data.prospects || []);
      }

      if (teamsRes.ok) {
        const data = await teamsRes.json();
        setTeams(data.teams || []);
        if (data.historyByTeam && data.historyByTeam[1]) {
          setValueHistory(data.historyByTeam[1]);
        }
      }

      // Load trade suggestions from new endpoint
      try {
        setLoadingTrades(true);
        const tradeFinderRes = await fetch("/api/dynasty/trade-finder");
        if (tradeFinderRes.ok) {
          const tradeData = await tradeFinderRes.json();
          setTradeSuggestions(tradeData.suggestions || []);
        }
      } catch {
        console.error("Failed to load trade finder");
      } finally {
        setLoadingTrades(false);
      }

      // Load value trends
      try {
        const trendsRes = await fetch("/api/dynasty/value-trends");
        if (trendsRes.ok) {
          const trendsData = await trendsRes.json();
          setValueTrends({ risers: trendsData.risers, fallers: trendsData.fallers });
        }
      } catch {
        console.error("Failed to load value trends");
      }

      // Load trade history
      try {
        const historyRes = await fetch("/api/dynasty/history");
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          setTradeHistory(historyData.trades || []);
        }
      } catch {
        console.error("Failed to load trade history");
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [prospectClass]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Sync data from Sleeper
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/dynasty/sync", { method: "POST" });
      if (res.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Sync failed:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Update mode
  const handleModeChange = async (newMode: "tank" | "retool" | "contend") => {
    try {
      const res = await fetch("/api/dynasty/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: newMode }),
      });
      if (res.ok) {
        setSettings((prev) => prev ? { ...prev, mode: newMode } : null);
        handleSync();
      }
    } catch (error) {
      console.error("Failed to update mode:", error);
    }
  };

  // Load team roster when team selected
  const loadTeamRoster = async (team: Team) => {
    setSelectedTeam(team);
    setLoadingTeamRoster(true);
    try {
      const res = await fetch(`/api/dynasty/teams?rosterId=${team.rosterId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedTeamRoster(data.team?.roster || []);
      }
      const teamPicks = picks.filter(p => p.currentOwner === team.ownerUsername);
      setSelectedTeamPicks(teamPicks);
    } catch (error) {
      console.error("Failed to load team roster:", error);
    } finally {
      setLoadingTeamRoster(false);
    }
  };

  // Load prospect report
  const loadProspectReport = async (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setProspectReport(null);
    setLoadingProspectReport(true);
    try {
      const res = await fetch(`/api/dynasty/prospect-report?name=${encodeURIComponent(prospect.name)}`);
      if (res.ok) {
        const data = await res.json();
        setProspectReport(data.report || null);
      }
    } catch (error) {
      console.error("Failed to load prospect report:", error);
    } finally {
      setLoadingProspectReport(false);
    }
  };

  // Add asset to trade calculator helper
  const addToMySide = (asset: TradeAsset) => {
    if (!mySideAssets.find(a => a.id === asset.id)) {
      setMySideAssets([...mySideAssets, asset]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading dynasty data...</p>
      </div>
    );
  }

  const sellCandidates = players.filter((p) => p.recommendation === "sell");
  const mode = settings?.mode || "tank";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Compact Header */}
        <header className="mb-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground text-sm mb-2 inline-flex items-center gap-1">← Back</Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold text-foreground">🏈 Dynasty Manager</h1>
              <p className="text-muted-foreground text-sm">{settings?.leagueName} • {settings?.teamName}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleSync} disabled={isSyncing} variant="outline" size="sm">
                {isSyncing ? "Syncing..." : "🔄 Sync"}
              </Button>
              {settings?.lastSync && (
                <span className="text-xs text-muted-foreground">Last: {new Date(settings.lastSync).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </header>

        {/* Today's Summary - Always visible */}
        <div className="mb-6">
          <TodaysSummary 
            settings={settings}
            players={players}
            picks={picks}
            totalValue={totalValue}
            teams={teams}
            tradeSuggestions={tradeSuggestions}
            valueTrends={valueTrends}
          />
        </div>

        <Tabs defaultValue="calculator" className="space-y-4">
          <div className="overflow-x-auto -mx-4 px-4 pb-2">
            <TabsList className="inline-flex w-max min-w-full sm:w-full sm:grid sm:grid-cols-8 gap-1 bg-muted p-1 rounded-lg">
              <TabsTrigger value="calculator" className="whitespace-nowrap px-3 py-2 text-sm font-medium">🧮 Trade Calc</TabsTrigger>
              <TabsTrigger value="finder" className="whitespace-nowrap px-3 py-2 text-sm font-medium">🔍 Trade Finder</TabsTrigger>
              <TabsTrigger value="roadmap" className="whitespace-nowrap px-3 py-2 text-sm font-medium">🗺️ Roadmaps</TabsTrigger>
              <TabsTrigger value="trends" className="whitespace-nowrap px-3 py-2 text-sm font-medium">📊 Trends</TabsTrigger>
              <TabsTrigger value="rankings" className="whitespace-nowrap px-3 py-2 text-sm font-medium">🏆 Rankings</TabsTrigger>
              <TabsTrigger value="roster" className="whitespace-nowrap px-3 py-2 text-sm font-medium">👥 Roster</TabsTrigger>
              <TabsTrigger value="scouting" className="whitespace-nowrap px-3 py-2 text-sm font-medium">🎓 Scouting</TabsTrigger>
              <TabsTrigger value="gems" className="whitespace-nowrap px-3 py-2 text-sm font-medium">💎 Gems</TabsTrigger>
            </TabsList>
          </div>

          {/* Trade Calculator Tab */}
          <TabsContent value="calculator">
            <EnhancedTradeCalculator
              players={players}
              picks={picks}
              teams={teams}
              positionColors={positionColors}
              mySideAssets={mySideAssets}
              theirSideAssets={theirSideAssets}
              tradePartner={tradePartner}
              setMySideAssets={setMySideAssets}
              setTheirSideAssets={setTheirSideAssets}
              setTradePartner={setTradePartner}
            />
          </TabsContent>

          {/* Trade Finder Tab */}
          <TabsContent value="finder" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🔍</span> AI Trade Finder
                </CardTitle>
                <CardDescription>Automatically generated trade ideas based on league analysis</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingTrades ? (
                  <div className="text-center py-8 text-muted-foreground">Analyzing league...</div>
                ) : tradeSuggestions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">Sync data to generate trade suggestions</div>
                ) : (
                  <div className="space-y-4">
                    {tradeSuggestions.map((trade) => (
                      <Card 
                        key={trade.id}
                        className={`cursor-pointer transition-all hover:ring-2 hover:ring-primary/30 ${
                          trade.priority === "high" ? "border-green-500/50" : trade.priority === "medium" ? "border-yellow-500/50" : "border-border"
                        }`}
                        onClick={() => {
                          // Add to calculator
                          setTradePartner(teams.find(t => t.rosterId === trade.targetRosterId) as Team & { roster?: RosterPlayer[] } || null);
                          const myAssets: TradeAsset[] = [
                            ...trade.yourSide.players.map(p => ({ type: "player" as const, id: p.name, name: p.name, position: p.position, value: p.value })),
                            ...trade.yourSide.picks.map(pk => ({ type: "pick" as const, id: pk.name, name: pk.name, value: pk.value })),
                          ];
                          const theirAssets: TradeAsset[] = [
                            ...trade.theirSide.players.map(p => ({ type: "player" as const, id: p.name, name: p.name, position: p.position, value: p.value })),
                            ...trade.theirSide.picks.map(pk => ({ type: "pick" as const, id: pk.name, name: pk.name, value: pk.value })),
                          ];
                          setMySideAssets(myAssets);
                          setTheirSideAssets(theirAssets);
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge className={trade.priority === "high" ? "bg-green-500" : trade.priority === "medium" ? "bg-yellow-500" : "bg-muted"}>
                                {trade.priority.toUpperCase()}
                              </Badge>
                              <Badge variant="outline">{trade.tradeType.toUpperCase()}</Badge>
                              <span className="font-medium">→ {trade.targetTeam}</span>
                            </div>
                            <Badge variant={trade.valueDiff > 0 ? "default" : "secondary"}>
                              {trade.valueDiff > 0 ? "+" : ""}{trade.valueDiff.toLocaleString()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{trade.rationale}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="p-2 rounded bg-red-500/10">
                              <div className="text-xs text-red-400 mb-1">You Give ({trade.yourSide.totalValue.toLocaleString()})</div>
                              <div>{trade.yourSide.players.map(p => p.name).join(", ") || "—"}</div>
                              {trade.yourSide.picks.length > 0 && <div className="text-xs">{trade.yourSide.picks.map(p => p.name).join(", ")}</div>}
                            </div>
                            <div className="p-2 rounded bg-green-500/10">
                              <div className="text-xs text-green-400 mb-1">You Get ({trade.theirSide.totalValue.toLocaleString()})</div>
                              <div>{trade.theirSide.players.map(p => p.name).join(", ") || "—"}</div>
                              {trade.theirSide.picks.length > 0 && <div className="text-xs">{trade.theirSide.picks.map(p => p.name).join(", ")}</div>}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2 italic">{trade.fit}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Roadmaps Tab */}
          <TabsContent value="roadmap">
            <TeamRoadmapsTab teams={teams} />
          </TabsContent>

          {/* Value Trends Tab */}
          <TabsContent value="trends">
            <ValueTrendsTab positionColors={positionColors} />
          </TabsContent>

          {/* Power Rankings Tab */}
          <TabsContent value="rankings">
            <PowerRankingsTab positionColors={positionColors} />
          </TabsContent>

          {/* Roster Tab */}
          <TabsContent value="roster" className="space-y-4">
            {/* Mode Selector */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Team Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {(["tank", "retool", "contend"] as const).map((m) => (
                    <Button
                      key={m}
                      variant={mode === m ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleModeChange(m)}
                      className={mode === m ? modeConfig[m].color : ""}
                    >
                      {modeConfig[m].label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* My Roster */}
            <Card>
              <CardHeader>
                <CardTitle>My Roster</CardTitle>
                <CardDescription>Click any player for trade recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {players.sort((a, b) => (b.drewValue || 0) - (a.drewValue || 0)).map((player) => (
                    <button
                      key={player.id}
                      onClick={() => setSelectedPlayer(player)}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Badge className={positionColors[player.position]}>{player.position}</Badge>
                        <div>
                          <div className="font-medium">{player.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {player.team || "FA"} • Age {player.age || "?"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {player.recommendation === "sell" && <Badge variant="destructive">SELL</Badge>}
                        <div className="text-right">
                          <div className="font-bold">{player.drewValue?.toLocaleString()}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Draft Capital */}
            <Card>
              <CardHeader>
                <CardTitle>Draft Capital</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {picks.map((pick) => (
                    <div key={pick.id} className="p-3 rounded-lg border border-border bg-card">
                      <div className="flex items-center justify-between">
                        <span className="font-bold">
                          {pick.season} {pick.round === 1 ? "1st" : pick.round === 2 ? "2nd" : "3rd"}
                          {pick.pick && <span className="text-muted-foreground ml-1">({pick.round}.{pick.pick.toString().padStart(2, "0")})</span>}
                        </span>
                        <span className="font-medium text-primary">{pick.drewValue?.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">via {pick.originalOwner}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scouting Tab */}
          <TabsContent value="scouting" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>🎓 Prospect Rankings</CardTitle>
                    <CardDescription>Top 30 prospects</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant={prospectClass === "2026" ? "default" : "outline"} size="sm" onClick={() => setProspectClass("2026")}>2026</Button>
                    <Button variant={prospectClass === "2027" ? "default" : "outline"} size="sm" onClick={() => setProspectClass("2027")}>2027</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {prospects.slice(0, 30).map((prospect, idx) => (
                    <button
                      key={prospect.id}
                      onClick={() => loadProspectReport(prospect)}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">{idx + 1}</div>
                        <Badge className={positionColors[prospect.position] || "bg-gray-500"}>{prospect.position}</Badge>
                        <div>
                          <div className="font-medium">{prospect.name}</div>
                          <div className="text-xs text-muted-foreground">{prospect.college}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{prospect.drewScore?.toFixed(1)}</div>
                        <div className="text-xs text-muted-foreground">Consensus: #{prospect.consensus}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gems Tab */}
          <TabsContent value="gems">
            <GemsTab teams={teams} positionColors={positionColors} />
          </TabsContent>
        </Tabs>

        {/* Player Detail Modal */}
        <Dialog open={!!selectedPlayer} onOpenChange={() => setSelectedPlayer(null)}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            {selectedPlayer && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <Badge className={positionColors[selectedPlayer.position]}>{selectedPlayer.position}</Badge>
                    <span>{selectedPlayer.name}</span>
                  </DialogTitle>
                  <DialogDescription>{selectedPlayer.team || "FA"} • Age {selectedPlayer.age || "?"}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="text-2xl font-bold text-primary">{selectedPlayer.drewValue?.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Drew Value</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <div className="text-2xl font-bold">{selectedPlayer.ktcValue?.toLocaleString() || "—"}</div>
                      <div className="text-xs text-muted-foreground">KTC</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <div className="text-2xl font-bold">{selectedPlayer.fcValue?.toLocaleString() || "—"}</div>
                      <div className="text-xs text-muted-foreground">FantasyCalc</div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border ${selectedPlayer.recommendation === "sell" ? "border-red-500/30 bg-red-500/5" : "border-green-500/30 bg-green-500/5"}`}>
                    <Badge variant={selectedPlayer.recommendation === "sell" ? "destructive" : "secondary"} className="mb-2">
                      {selectedPlayer.recommendation?.toUpperCase() || "HOLD"}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{selectedPlayer.recommendReason || "Solid asset."}</p>
                  </div>

                  <Button 
                    className="w-full"
                    onClick={() => {
                      addToMySide({
                        type: "player",
                        id: selectedPlayer.sleeperId,
                        name: selectedPlayer.name,
                        position: selectedPlayer.position,
                        value: selectedPlayer.drewValue || 0
                      });
                      setSelectedPlayer(null);
                    }}
                  >
                    Add to Trade Calculator →
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Prospect Detail Modal */}
        <Dialog open={!!selectedProspect} onOpenChange={() => { setSelectedProspect(null); setProspectReport(null); }}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            {selectedProspect && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <Badge className={positionColors[selectedProspect.position] || "bg-gray-500"}>{selectedProspect.position}</Badge>
                    <span>{selectedProspect.name}</span>
                  </DialogTitle>
                  <DialogDescription>{selectedProspect.college} • {selectedProspect.draftClass} Class</DialogDescription>
                </DialogHeader>

                {loadingProspectReport ? (
                  <div className="py-8 text-center text-muted-foreground">Loading report...</div>
                ) : (
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <div className="text-2xl font-bold text-primary">#{selectedProspect.drewRank}</div>
                        <div className="text-xs text-muted-foreground">Drew Rank</div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted">
                        <div className="text-2xl font-bold">#{selectedProspect.consensus}</div>
                        <div className="text-xs text-muted-foreground">Consensus</div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted">
                        <div className="text-2xl font-bold">{selectedProspect.drewScore?.toFixed(0)}</div>
                        <div className="text-xs text-muted-foreground">Score</div>
                      </div>
                    </div>

                    {prospectReport && (
                      <>
                        {prospectReport.comps.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            <span className="text-sm text-muted-foreground">Comps:</span>
                            {prospectReport.comps.map((c, i) => <Badge key={i} variant="outline">{c}</Badge>)}
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-lg border border-green-500/30 bg-green-500/5">
                            <h4 className="font-semibold text-green-500 mb-2">✅ Strengths</h4>
                            <ul className="space-y-1 text-sm">
                              {prospectReport.strengths.map((s, i) => <li key={i}>• {s}</li>)}
                            </ul>
                          </div>
                          <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/5">
                            <h4 className="font-semibold text-red-500 mb-2">⚠️ Weaknesses</h4>
                            <ul className="space-y-1 text-sm">
                              {prospectReport.weaknesses.map((w, i) => <li key={i}>• {w}</li>)}
                            </ul>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="p-2 rounded bg-muted/50">
                            <span className="text-muted-foreground">Ceiling:</span> {prospectReport.ceiling}
                          </div>
                          <div className="p-2 rounded bg-muted/50">
                            <span className="text-muted-foreground">Floor:</span> {prospectReport.floor}
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground">{prospectReport.summary}</p>
                      </>
                    )}

                    {!prospectReport && selectedProspect.notes && (
                      <p className="text-sm text-muted-foreground">{selectedProspect.notes}</p>
                    )}
                  </div>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Team Detail Modal */}
        <Dialog open={!!selectedTeam} onOpenChange={() => { setSelectedTeam(null); setSelectedTeamRoster([]); }}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            {selectedTeam && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedTeam.ownerUsername}</DialogTitle>
                  <DialogDescription>
                    {selectedTeam.teamName || "—"} • Total Value: {selectedTeam.totalValue?.toLocaleString()}
                  </DialogDescription>
                </DialogHeader>

                {loadingTeamRoster ? (
                  <div className="py-8 text-center text-muted-foreground">Loading roster...</div>
                ) : (
                  <div className="space-y-4 mt-4">
                    <div className="flex gap-2">
                      {selectedTeam.strengths?.map((s, i) => <Badge key={i} className="bg-green-500/20 text-green-500">{s}</Badge>)}
                      {selectedTeam.weaknesses?.map((w, i) => <Badge key={i} className="bg-red-500/20 text-red-500">{w}</Badge>)}
                    </div>

                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {selectedTeamRoster.sort((a, b) => b.value - a.value).map((p) => (
                        <div key={p.sleeperId} className="flex items-center justify-between p-2 rounded border border-border">
                          <div className="flex items-center gap-2">
                            <Badge className={positionColors[p.position] || "bg-gray-500"}>{p.position}</Badge>
                            <span>{p.name}</span>
                            <span className="text-xs text-muted-foreground">Age {p.age}</span>
                          </div>
                          <span className="font-medium">{p.value.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
