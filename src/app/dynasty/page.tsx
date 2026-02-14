"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
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
}

interface Pick {
  id: string;
  season: string;
  round: number;
  pick: number | null;
  originalOwner: string;
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
}

interface TradeSuggestion {
  targetTeam: string;
  targetMode: string;
  rationale: string;
  yourSide: { players: string[]; picks: string[]; totalValue: number };
  theirSide: { players: string[]; picks: string[]; totalValue: number };
  type: string;
  priority: "high" | "medium" | "low";
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
  const [tradeTargetPlayer, setTradeTargetPlayer] = useState<Player | null>(null);
  // Trade calculator state
  const [mySideAssets, setMySideAssets] = useState<TradeAsset[]>([]);
  const [theirSideAssets, setTheirSideAssets] = useState<TradeAsset[]>([]);
  const [tradePartner, setTradePartner] = useState<Team | null>(null);
  // Trade suggestions
  const [tradeSuggestions, setTradeSuggestions] = useState<TradeSuggestion[]>([]);
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
        // Get value history for Andrew's team (rosterId 1)
        if (data.historyByTeam && data.historyByTeam[1]) {
          setValueHistory(data.historyByTeam[1]);
        }
      }

      // Load trade suggestions
      try {
        setLoadingTrades(true);
        const tradesRes = await fetch("/api/dynasty/trades");
        if (tradesRes.ok) {
          const tradesData = await tradesRes.json();
          setTradeSuggestions(tradesData.suggestions || []);
        }
      } catch {
        console.error("Failed to load trade suggestions");
      } finally {
        setLoadingTrades(false);
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
        // Re-sync to recalculate values based on new mode
        handleSync();
      }
    } catch (error) {
      console.error("Failed to update mode:", error);
    }
  };

  // Reload prospects when class changes
  useEffect(() => {
    const loadProspects = async () => {
      const res = await fetch(`/api/dynasty/prospects?class=${prospectClass}`);
      if (res.ok) {
        const data = await res.json();
        setProspects(data.prospects || []);
      }
    };
    loadProspects();
  }, [prospectClass]);

  // Load full roster and picks when team selected
  const loadTeamRoster = async (team: Team) => {
    setSelectedTeam(team);
    setLoadingTeamRoster(true);
    setSelectedTeamPicks([]);
    try {
      const res = await fetch(`/api/dynasty/teams?rosterId=${team.rosterId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedTeamRoster(data.team?.roster || []);
      }
      // Find picks owned by this team (originalOwner matches username)
      const teamPicks = picks.filter(p => p.originalOwner === team.ownerUsername);
      setSelectedTeamPicks(teamPicks);
    } catch (error) {
      console.error("Failed to load team roster:", error);
    } finally {
      setLoadingTeamRoster(false);
    }
  };

  // Load prospect report when prospect selected
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

  // Trade calculator helpers
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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground text-sm mb-4 inline-flex items-center gap-1">
            ← Back
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">🏈 Dynasty Manager</h1>
              <p className="text-muted-foreground mt-1">
                {settings?.leagueName} • {settings?.teamName}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={handleSync} disabled={isSyncing} variant="outline">
                {isSyncing ? "Syncing..." : "🔄 Sync Data"}
              </Button>
              {settings?.lastSync && (
                <span className="text-xs text-muted-foreground">
                  Last sync: {new Date(settings.lastSync).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </header>

        <Tabs defaultValue="strategy" className="space-y-6">
          <div className="overflow-x-auto -mx-4 px-4 pb-2">
            <TabsList className="inline-flex w-max min-w-full sm:w-full sm:grid sm:grid-cols-7 gap-1 bg-muted p-1 rounded-lg">
              <TabsTrigger value="strategy" className="whitespace-nowrap px-3 py-2 text-sm font-medium">📊 Strategy</TabsTrigger>
              <TabsTrigger value="assets" className="whitespace-nowrap px-3 py-2 text-sm font-medium">💎 Assets</TabsTrigger>
              <TabsTrigger value="scouting" className="whitespace-nowrap px-3 py-2 text-sm font-medium">🎓 Scouting</TabsTrigger>
              <TabsTrigger value="calculator" className="whitespace-nowrap px-3 py-2 text-sm font-medium">🧮 Calculator</TabsTrigger>
              <TabsTrigger value="trades" className="whitespace-nowrap px-3 py-2 text-sm font-medium">💱 Trades</TabsTrigger>
              <TabsTrigger value="intel" className="whitespace-nowrap px-3 py-2 text-sm font-medium">🕵️ Intel</TabsTrigger>
              <TabsTrigger value="history" className="whitespace-nowrap px-3 py-2 text-sm font-medium">📜 History</TabsTrigger>
            </TabsList>
          </div>

          {/* Strategy Dashboard */}
          <TabsContent value="strategy" className="space-y-6">
            {/* Mode Selector */}
            <Card>
              <CardHeader>
                <CardTitle>Team Strategy Mode</CardTitle>
                <CardDescription>This affects player valuations and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  {(["tank", "retool", "contend"] as const).map((m) => (
                    <Button
                      key={m}
                      variant={mode === m ? "default" : "outline"}
                      onClick={() => handleModeChange(m)}
                      className={mode === m ? modeConfig[m].color : ""}
                    >
                      {modeConfig[m].label}
                    </Button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Current: <strong>{modeConfig[mode].label}</strong> — {modeConfig[mode].description}
                </p>
              </CardContent>
            </Card>

            {/* Phase Recommendation */}
            {phaseRecommendation && (
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🤖 Drew&apos;s Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={phaseRecommendation.phase === "tank" ? "bg-red-500" : phaseRecommendation.phase === "contend" ? "bg-green-500" : "bg-yellow-500"}>
                      {phaseRecommendation.phase.toUpperCase()}
                    </Badge>
                    <span className="font-medium">is the optimal strategy</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{phaseRecommendation.reason}</p>
                </CardContent>
              </Card>
            )}

            {/* Team Overview */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Team Value</CardDescription>
                  <CardTitle className="text-3xl">{totalValue.toLocaleString()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Players: {players.reduce((s, p) => s + (p.drewValue || 0), 0).toLocaleString()} |
                    Picks: {picks.reduce((s, p) => s + (p.drewValue || 0), 0).toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Draft Capital</CardDescription>
                  <CardTitle className="text-3xl">{picks.length} picks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {picks.filter((p) => p.round === 1).length} 1sts •{" "}
                    {picks.filter((p) => p.round === 2).length} 2nds
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Sell Candidates</CardDescription>
                  <CardTitle className="text-3xl">{sellCandidates.length}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Players to move for max value
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Team Value Chart */}
            <Card>
              <CardHeader>
                <CardTitle>📈 Team Value Over Time</CardTitle>
                <CardDescription>Track your dynasty&apos;s growth</CardDescription>
              </CardHeader>
              <CardContent>
                {valueHistory.length > 1 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={valueHistory} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="date" 
                          stroke="hsl(var(--muted-foreground))"
                          tick={{ fontSize: 12 }}
                          tickFormatter={(val) => {
                            const d = new Date(val);
                            return `${d.getMonth() + 1}/${d.getDate()}`;
                          }}
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))"
                          tick={{ fontSize: 12 }}
                          tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))", 
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
                          }}
                          labelStyle={{ color: "hsl(var(--foreground))" }}
                          formatter={(value) => [Number(value).toLocaleString(), "Value"]}
                          labelFormatter={(label) => new Date(label).toLocaleDateString()}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <p>No history yet</p>
                      <p className="text-sm mt-1">Chart will populate as you sync weekly</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Position Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Roster Composition</CardTitle>
                <CardDescription>Value by position</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["QB", "RB", "WR", "TE"].map((pos) => {
                    const posPlayers = players.filter((p) => p.position === pos);
                    const posValue = posPlayers.reduce((s, p) => s + (p.drewValue || 0), 0);
                    const maxValue = Math.max(...["QB", "RB", "WR", "TE"].map(
                      (p) => players.filter((pl) => pl.position === p).reduce((s, pl) => s + (pl.drewValue || 0), 0)
                    ));
                    
                    return (
                      <div key={pos} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className={positionColors[pos]}>{pos}</Badge>
                            <span className="text-sm">{posPlayers.length} players</span>
                          </div>
                          <span className="font-medium">{posValue.toLocaleString()}</span>
                        </div>
                        <Progress value={(posValue / maxValue) * 100} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Actions */}
            <Card>
              <CardHeader>
                <CardTitle>🎯 Recommended Actions</CardTitle>
                <CardDescription>Based on your {modeConfig[mode].label} strategy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Top Trade Suggestions */}
                  {tradeSuggestions.filter(t => t.priority === "high").slice(0, 3).map((trade, idx) => (
                    <div
                      key={`trade-${idx}`}
                      className="flex items-center justify-between p-3 rounded-lg border border-green-500/30 bg-green-500/5"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-500">TRADE</Badge>
                          <span className="font-medium">Target: {trade.targetTeam}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{trade.rationale}</p>
                        <div className="text-xs mt-2">
                          <span className="text-red-400">Give: {trade.yourSide.players.join(", ") || trade.yourSide.picks.join(", ")}</span>
                          <span className="mx-2">→</span>
                          <span className="text-green-400">Get: {trade.theirSide.players.join(", ") || trade.theirSide.picks.join(", ")}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Sell Candidates */}
                  {sellCandidates.slice(0, 3).map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-red-500/30 bg-red-500/5"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive">SELL</Badge>
                          <span className="font-medium">{player.name}</span>
                          <Badge variant="outline" className={positionColors[player.position]}>
                            {player.position}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{player.recommendReason}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{player.drewValue?.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Drew Value</div>
                      </div>
                    </div>
                  ))}
                  
                  {sellCandidates.length === 0 && tradeSuggestions.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      Sync data to generate recommendations
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Assets */}
          <TabsContent value="assets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Roster</CardTitle>
                <CardDescription>Sorted by Drew Value • Click for trade recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {players.map((player) => (
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
                        {player.recommendation === "sell" && (
                          <Badge variant="destructive">SELL</Badge>
                        )}
                        {player.recommendation === "hold" && (
                          <Badge variant="secondary">HOLD</Badge>
                        )}
                        <div className="text-right">
                          <div className="font-bold">{player.drewValue?.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Drew Value</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>My Draft Picks</CardTitle>
                <CardDescription>Future assets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {picks.map((pick) => (
                    <div
                      key={pick.id}
                      className="p-3 rounded-lg border border-border bg-card"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold">
                            {pick.season} {pick.round === 1 ? "1st" : pick.round === 2 ? "2nd" : "3rd"}
                          </span>
                          {pick.pick && (
                            <span className="text-muted-foreground ml-1">
                              ({pick.round}.{pick.pick.toString().padStart(2, "0")})
                            </span>
                          )}
                        </div>
                        <span className="font-medium text-primary">{pick.drewValue?.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        via {pick.originalOwner}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scouting Central */}
          <TabsContent value="scouting" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>🎓 Prospect Rankings</CardTitle>
                    <CardDescription>Top 30 prospects • Drew&apos;s algorithm (SF + PPR weighted)</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={prospectClass === "2026" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setProspectClass("2026")}
                    >
                      2026
                    </Button>
                    <Button
                      variant={prospectClass === "2027" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setProspectClass("2027")}
                    >
                      2027
                    </Button>
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
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                        </div>
                        <Badge className={positionColors[prospect.position] || "bg-gray-500"}>
                          {prospect.position}
                        </Badge>
                        <div>
                          <div className="font-medium">{prospect.name}</div>
                          <div className="text-xs text-muted-foreground">{prospect.college}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{prospect.drewScore?.toFixed(1)}</div>
                        <div className="text-xs text-muted-foreground">
                          Consensus: #{prospect.consensus}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Your Pick Targets */}
            <Card>
              <CardHeader>
                <CardTitle>🎯 Your Pick Targets</CardTitle>
                <CardDescription>Prospects available at your pick positions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {picks
                    .filter((p) => p.season === prospectClass && p.pick)
                    .map((pick) => {
                      const availableAt = prospects.slice((pick.pick || 1) - 3, (pick.pick || 1) + 2);
                      return (
                        <div key={pick.id} className="p-4 rounded-lg border border-border bg-muted/30">
                          <div className="font-medium mb-2">
                            Pick {pick.round}.{pick.pick?.toString().padStart(2, "0")} (via {pick.originalOwner})
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {availableAt.map((p) => (
                              <Badge key={p.id} variant="outline" className="cursor-pointer hover:bg-muted">
                                {p.name} ({p.position})
                              </Badge>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trade Calculator */}
          <TabsContent value="calculator" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* My Side */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🏠 Your Side</CardTitle>
                  <CardDescription>Assets you&apos;re giving up</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4 min-h-24">
                    {mySideAssets.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">Add assets from your roster below</p>
                    ) : (
                      mySideAssets.map((asset) => (
                        <div key={asset.id} className="flex items-center justify-between p-2 rounded border border-border">
                          <div className="flex items-center gap-2">
                            {asset.position && <Badge className={positionColors[asset.position] || "bg-gray-500"} variant="outline">{asset.position}</Badge>}
                            <span className="text-sm">{asset.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{asset.value.toLocaleString()}</span>
                            <Button size="sm" variant="ghost" onClick={() => removeFromMySide(asset.id)}>×</Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>{mySideValue.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Their Side */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🎯 Their Side</CardTitle>
                  <CardDescription>
                    {tradePartner ? `${tradePartner.ownerUsername}'s assets` : "Select a trade partner"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4 min-h-24">
                    {theirSideAssets.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">Select a trade partner and add their assets</p>
                    ) : (
                      theirSideAssets.map((asset) => (
                        <div key={asset.id} className="flex items-center justify-between p-2 rounded border border-border">
                          <div className="flex items-center gap-2">
                            {asset.position && <Badge className={positionColors[asset.position] || "bg-gray-500"} variant="outline">{asset.position}</Badge>}
                            <span className="text-sm">{asset.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{asset.value.toLocaleString()}</span>
                            <Button size="sm" variant="ghost" onClick={() => removeFromTheirSide(asset.id)}>×</Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>{theirSideValue.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trade Analysis */}
            {(mySideAssets.length > 0 || theirSideAssets.length > 0) && (
              <Card className={valueDiff > 500 ? "border-green-500/50 bg-green-500/5" : valueDiff < -500 ? "border-red-500/50 bg-red-500/5" : "border-yellow-500/50 bg-yellow-500/5"}>
                <CardHeader>
                  <CardTitle>📊 Trade Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center gap-8 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{mySideValue.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">You give</div>
                    </div>
                    <div className="text-3xl">{valueDiff > 0 ? "←" : valueDiff < 0 ? "→" : "↔"}</div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{theirSideValue.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">You get</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <Badge className={valueDiff > 500 ? "bg-green-500" : valueDiff < -500 ? "bg-red-500" : "bg-yellow-500"}>
                      {valueDiff > 500 ? `+${valueDiff.toLocaleString()} WIN` : valueDiff < -500 ? `${valueDiff.toLocaleString()} LOSS` : "FAIR TRADE"}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      {valueDiff > 1000 ? "Smash accept! Great value for you." :
                       valueDiff > 500 ? "Solid win. Take it if it fits your roster needs." :
                       valueDiff > -500 ? "Fair trade. Depends on roster construction." :
                       valueDiff > -1000 ? "Slight overpay. Only if you really need what you're getting." :
                       "Bad trade. You're giving up too much value."}
                    </p>
                  </div>
                  <div className="flex justify-center mt-4">
                    <Button variant="outline" onClick={clearTrade}>Clear Trade</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Asset Selectors */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* My Players */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Players</CardTitle>
                </CardHeader>
                <CardContent className="max-h-64 overflow-y-auto">
                  <div className="space-y-1">
                    {players.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => addToMySide({ type: "player", id: p.sleeperId, name: p.name, position: p.position, value: p.drewValue || 0 })}
                        disabled={mySideAssets.some(a => a.id === p.sleeperId)}
                        className="w-full flex items-center justify-between p-2 rounded border border-border hover:bg-muted/50 disabled:opacity-50 text-left text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Badge className={positionColors[p.position]}>{p.position}</Badge>
                          <span>{p.name}</span>
                        </div>
                        <span className="font-medium">{p.drewValue?.toLocaleString()}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* My Picks */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Picks</CardTitle>
                </CardHeader>
                <CardContent className="max-h-64 overflow-y-auto">
                  <div className="space-y-1">
                    {picks.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => addToMySide({ type: "pick", id: p.id, name: `${p.season} ${p.round === 1 ? "1st" : p.round === 2 ? "2nd" : "3rd"}${p.pick ? ` (${p.round}.${p.pick.toString().padStart(2, "0")})` : ""} via ${p.originalOwner}`, value: p.drewValue || 0 })}
                        disabled={mySideAssets.some(a => a.id === p.id)}
                        className="w-full flex items-center justify-between p-2 rounded border border-border hover:bg-muted/50 disabled:opacity-50 text-left text-sm"
                      >
                        <span>{p.season} {p.round === 1 ? "1st" : p.round === 2 ? "2nd" : "3rd"}{p.pick ? ` (${p.round}.${p.pick.toString().padStart(2, "0")})` : ""}</span>
                        <span className="font-medium">{p.drewValue?.toLocaleString()}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trade Partner Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Trade Partner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {teams.filter(t => t.ownerUsername !== "Hendawg55").map((team) => (
                    <Button
                      key={team.id}
                      variant={tradePartner?.id === team.id ? "default" : "outline"}
                      size="sm"
                      onClick={async () => {
                        setTradePartner(team);
                        setTheirSideAssets([]);
                        // Load their roster
                        const res = await fetch(`/api/dynasty/teams?rosterId=${team.rosterId}`);
                        if (res.ok) {
                          const data = await res.json();
                          const roster = data.team?.roster || [];
                          setTradePartner({ ...team, roster });
                        }
                      }}
                      className="text-xs"
                    >
                      {team.ownerUsername}
                    </Button>
                  ))}
                </div>

                {/* Partner's Roster */}
                {tradePartner?.roster && tradePartner.roster.length > 0 && (
                  <div className="mt-4 max-h-48 overflow-y-auto">
                    <h4 className="font-medium mb-2">{tradePartner.ownerUsername}&apos;s Roster</h4>
                    <div className="space-y-1">
                      {tradePartner.roster.sort((a: RosterPlayer, b: RosterPlayer) => b.value - a.value).map((p: RosterPlayer) => (
                        <button
                          key={p.sleeperId}
                          onClick={() => addToTheirSide({ type: "player", id: p.sleeperId, name: p.name, position: p.position, value: p.value })}
                          disabled={theirSideAssets.some(a => a.id === p.sleeperId)}
                          className="w-full flex items-center justify-between p-2 rounded border border-border hover:bg-muted/50 disabled:opacity-50 text-left text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <Badge className={positionColors[p.position] || "bg-gray-500"}>{p.position}</Badge>
                            <span>{p.name}</span>
                          </div>
                          <span className="font-medium">{p.value.toLocaleString()}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trade Finder */}
          <TabsContent value="trades" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>💱 Trade Suggestions</CardTitle>
                <CardDescription>Based on your sell candidates and league needs</CardDescription>
              </CardHeader>
              <CardContent>
                {sellCandidates.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No sell candidates in {modeConfig[mode].label} mode. Adjust strategy or roster.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {sellCandidates.map((player) => {
                      // Find teams that need this position
                      const needyTeams = teams.filter(
                        (t) => t.weaknesses?.includes(player.position) && t.mode === "contending"
                      );

                      return (
                        <div key={player.id} className="p-4 rounded-lg border border-border">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge variant="destructive">SELL</Badge>
                            <span className="font-medium">{player.name}</span>
                            <Badge className={positionColors[player.position]}>{player.position}</Badge>
                            <span className="text-muted-foreground">→ Value: {player.drewValue?.toLocaleString()}</span>
                          </div>
                          
                          {needyTeams.length > 0 ? (
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">Target teams needing {player.position}:</p>
                              <div className="flex flex-wrap gap-2">
                                {needyTeams.map((team) => (
                                  <Badge key={team.id} variant="outline" className="cursor-pointer hover:bg-muted">
                                    {team.ownerUsername}
                                    {team.teamName && ` (${team.teamName})`}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No contending teams currently weak at {player.position}. Monitor for injuries/trades.
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* League Intel */}
          <TabsContent value="intel" className="space-y-6">
            {/* AI Trade Suggestions */}
            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle>🎯 AI Trade Suggestions</CardTitle>
                <CardDescription>Based on league-wide roster analysis and team needs</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingTrades ? (
                  <p className="text-center text-muted-foreground py-4">Analyzing league...</p>
                ) : tradeSuggestions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">Sync data to generate trade ideas</p>
                ) : (
                  <div className="space-y-4">
                    {tradeSuggestions.slice(0, 8).map((trade, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border ${
                          trade.priority === "high" 
                            ? "border-green-500/50 bg-green-500/5" 
                            : trade.priority === "medium"
                            ? "border-yellow-500/50 bg-yellow-500/5"
                            : "border-border"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={trade.priority === "high" ? "default" : "secondary"}>
                              {trade.priority.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">{trade.type}</Badge>
                            <span className="font-medium">→ {trade.targetTeam}</span>
                            <span className="text-xs text-muted-foreground">({trade.targetMode})</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{trade.rationale}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="p-2 rounded bg-red-500/10">
                            <div className="text-xs text-red-400 mb-1">You Give</div>
                            <div>{trade.yourSide.players.join(", ") || "—"}</div>
                            {trade.yourSide.picks.length > 0 && (
                              <div className="text-xs text-muted-foreground">{trade.yourSide.picks.join(", ")}</div>
                            )}
                          </div>
                          <div className="p-2 rounded bg-green-500/10">
                            <div className="text-xs text-green-400 mb-1">You Get</div>
                            <div>{trade.theirSide.players.join(", ") || "—"}</div>
                            {trade.theirSide.picks.length > 0 && (
                              <div className="text-xs text-muted-foreground">{trade.theirSide.picks.join(", ")}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📊 League Standings by Value</CardTitle>
                <CardDescription>Click a team for details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {teams.map((team, idx) => (
                    <button
                      key={team.id}
                      onClick={() => loadTeamRoster(team)}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-medium">
                            {team.ownerUsername}
                            {team.ownerUsername === "Hendawg55" && (
                              <Badge variant="secondary" className="ml-2">You</Badge>
                            )}
                          </div>
                          {team.teamName && (
                            <div className="text-xs text-muted-foreground">{team.teamName}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={team.mode === "contending" ? "default" : team.mode === "rebuilding" ? "destructive" : "secondary"}>
                          {team.mode}
                        </Badge>
                        <div className="text-right">
                          <div className="font-bold">{team.totalValue?.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Total Value</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trade History */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>📜 League Trade History</CardTitle>
                <CardDescription>All completed trades with analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Trade history will populate after first sync and as trades occur.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Player Detail Modal */}
        <Dialog open={!!selectedPlayer} onOpenChange={() => setSelectedPlayer(null)}>
          <DialogContent className="max-w-lg">
            {selectedPlayer && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Badge className={positionColors[selectedPlayer.position]}>{selectedPlayer.position}</Badge>
                    {selectedPlayer.name}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedPlayer.team || "Free Agent"} • Age {selectedPlayer.age || "Unknown"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 rounded-lg bg-muted">
                      <div className="text-2xl font-bold">{selectedPlayer.drewValue?.toLocaleString()}</div>
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
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={selectedPlayer.recommendation === "sell" ? "destructive" : "secondary"}>
                        {selectedPlayer.recommendation?.toUpperCase()}
                      </Badge>
                      <span className="font-medium">Recommendation</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedPlayer.recommendReason}</p>
                  </div>

                  {selectedPlayer.recommendation === "sell" && (
                    <div>
                      <h4 className="font-medium mb-2">Trade Targets</h4>
                      <div className="space-y-2">
                        {teams
                          .filter((t) => t.weaknesses?.includes(selectedPlayer.position))
                          .slice(0, 3)
                          .map((team) => (
                            <div key={team.id} className="p-2 rounded border border-border text-sm">
                              <span className="font-medium">{team.ownerUsername}</span>
                              <span className="text-muted-foreground"> needs {selectedPlayer.position}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Prospect Detail Modal - Enhanced */}
        <Dialog open={!!selectedProspect} onOpenChange={() => { setSelectedProspect(null); setProspectReport(null); }}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            {selectedProspect && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <Badge className={positionColors[selectedProspect.position] || "bg-gray-500"}>
                      {selectedProspect.position}
                    </Badge>
                    <span className="text-xl">{selectedProspect.name}</span>
                    {prospectReport && (
                      <Badge variant="outline" className="ml-auto">{prospectReport.grade}</Badge>
                    )}
                  </DialogTitle>
                  <DialogDescription className="flex items-center gap-2">
                    {prospectReport ? (
                      <>
                        {prospectReport.school} • {prospectReport.height}, {prospectReport.weight} lbs • {prospectReport.draftYear} Class
                        <Badge variant="secondary" className="ml-2">{prospectReport.projectedPick}</Badge>
                      </>
                    ) : (
                      <>{selectedProspect.college} • {selectedProspect.draftClass} Class</>
                    )}
                  </DialogDescription>
                </DialogHeader>

                {loadingProspectReport ? (
                  <div className="py-8 text-center text-muted-foreground">Loading scouting report...</div>
                ) : (
                  <div className="space-y-4 mt-4">
                    {/* Rankings */}
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                        <div className="text-2xl font-bold text-primary">#{selectedProspect.drewRank}</div>
                        <div className="text-xs text-muted-foreground">Drew Rank</div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted">
                        <div className="text-2xl font-bold">#{selectedProspect.consensus}</div>
                        <div className="text-xs text-muted-foreground">Consensus</div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted">
                        <div className="text-2xl font-bold">{selectedProspect.drewScore?.toFixed(0)}</div>
                        <div className="text-xs text-muted-foreground">Drew Score</div>
                      </div>
                    </div>

                    {/* Why This Ranking */}
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <h4 className="font-semibold mb-2 text-primary">📊 Ranking Breakdown</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Base: 100 - (Consensus #{selectedProspect.consensus} × 2) = {100 - ((selectedProspect.consensus || 1) - 1) * 2}
                      </p>
                      <div className="text-sm text-muted-foreground">
                        {selectedProspect.position === "QB" && <span className="text-green-500">+15 SF QB Premium</span>}
                        {["WR", "TE"].includes(selectedProspect.position) && <span className="text-blue-500">+5 PPR Bonus</span>}
                      </div>
                    </div>

                    {/* Comps */}
                    {prospectReport?.comps && prospectReport.comps.length > 0 && (
                      <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <h4 className="font-semibold mb-2 text-amber-500">🎯 Player Comps</h4>
                        <div className="flex flex-wrap gap-2">
                          {prospectReport.comps.map((comp, i) => (
                            <Badge key={i} variant="outline" className="bg-amber-500/10">{comp}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Strengths & Weaknesses */}
                    {prospectReport && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/5">
                          <h4 className="font-semibold text-green-500 mb-2">✅ Strengths</h4>
                          <ul className="space-y-1">
                            {prospectReport.strengths.map((s, i) => (
                              <li key={i} className="text-sm text-muted-foreground">• {s}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/5">
                          <h4 className="font-semibold text-red-500 mb-2">⚠️ Weaknesses</h4>
                          <ul className="space-y-1">
                            {prospectReport.weaknesses.map((w, i) => (
                              <li key={i} className="text-sm text-muted-foreground">• {w}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Ceiling/Floor */}
                    {prospectReport && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-muted/50">
                          <h4 className="text-xs text-muted-foreground mb-1">🚀 Ceiling</h4>
                          <p className="text-sm font-medium">{prospectReport.ceiling}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                          <h4 className="text-xs text-muted-foreground mb-1">📉 Floor</h4>
                          <p className="text-sm font-medium">{prospectReport.floor}</p>
                        </div>
                      </div>
                    )}

                    {/* Summary */}
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-semibold mb-2">📝 Scouting Summary</h4>
                      <p className="text-sm text-muted-foreground">
                        {prospectReport?.summary || selectedProspect.notes}
                      </p>
                    </div>

                    {/* Stats if available */}
                    {prospectReport?.stats && Object.keys(prospectReport.stats).length > 0 && (
                      <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-semibold mb-2">📈 College Stats</h4>
                        <div className="grid grid-cols-4 gap-2 text-center">
                          {prospectReport.stats.passYds && (
                            <div><div className="font-bold">{prospectReport.stats.passYds.toLocaleString()}</div><div className="text-xs text-muted-foreground">Pass Yds</div></div>
                          )}
                          {prospectReport.stats.passTD && (
                            <div><div className="font-bold">{prospectReport.stats.passTD}</div><div className="text-xs text-muted-foreground">Pass TD</div></div>
                          )}
                          {prospectReport.stats.rushYds && (
                            <div><div className="font-bold">{prospectReport.stats.rushYds.toLocaleString()}</div><div className="text-xs text-muted-foreground">Rush Yds</div></div>
                          )}
                          {prospectReport.stats.rushTD && (
                            <div><div className="font-bold">{prospectReport.stats.rushTD}</div><div className="text-xs text-muted-foreground">Rush TD</div></div>
                          )}
                          {prospectReport.stats.recYds && (
                            <div><div className="font-bold">{prospectReport.stats.recYds.toLocaleString()}</div><div className="text-xs text-muted-foreground">Rec Yds</div></div>
                          )}
                          {prospectReport.stats.recTD && (
                            <div><div className="font-bold">{prospectReport.stats.recTD}</div><div className="text-xs text-muted-foreground">Rec TD</div></div>
                          )}
                          {prospectReport.stats.ypc && (
                            <div><div className="font-bold">{prospectReport.stats.ypc}</div><div className="text-xs text-muted-foreground">YPC</div></div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Ideal NFL Fits */}
                    {prospectReport?.idealFits && prospectReport.idealFits.length > 0 && (
                      <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-semibold mb-2">🏈 Ideal NFL Fits</h4>
                        <div className="flex flex-wrap gap-2">
                          {prospectReport.idealFits.map((fit, i) => (
                            <Badge key={i} variant="outline">{fit}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Team Detail Modal */}
        <Dialog open={!!selectedTeam} onOpenChange={() => { setSelectedTeam(null); setSelectedTeamRoster([]); setSelectedTeamPicks([]); }}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedTeam && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedTeam.ownerUsername}</DialogTitle>
                  <DialogDescription>
                    {selectedTeam.teamName || "No team name"} • {selectedTeam.mode}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-muted text-center">
                      <div className="text-2xl font-bold">{selectedTeam.totalValue?.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Total Value</div>
                    </div>
                    <div className="p-3 rounded-lg border border-green-500/30 bg-green-500/5 text-center">
                      <h4 className="text-xs text-green-500 mb-1">Strengths</h4>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {(selectedTeam.strengths as string[] || []).map((s) => (
                          <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                        ))}
                        {(!selectedTeam.strengths || (selectedTeam.strengths as string[]).length === 0) && (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/5 text-center">
                      <h4 className="text-xs text-red-500 mb-1">Weaknesses</h4>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {(selectedTeam.weaknesses as string[] || []).map((w) => (
                          <Badge key={w} variant="outline" className="text-xs">{w}</Badge>
                        ))}
                        {(!selectedTeam.weaknesses || (selectedTeam.weaknesses as string[]).length === 0) && (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Full Roster */}
                  <div>
                    <h4 className="font-medium mb-2">Full Roster</h4>
                    {loadingTeamRoster ? (
                      <p className="text-sm text-muted-foreground text-center py-4">Loading roster...</p>
                    ) : selectedTeamRoster.length > 0 ? (
                      <div className="space-y-1 max-h-64 overflow-y-auto">
                        {selectedTeamRoster
                          .sort((a, b) => b.value - a.value)
                          .map((p) => (
                          <div key={p.sleeperId} className="flex items-center justify-between p-2 rounded border border-border text-sm">
                            <div className="flex items-center gap-2">
                              <Badge className={`${positionColors[p.position] || "bg-gray-500"} text-xs`}>{p.position}</Badge>
                              <span>{p.name}</span>
                              <span className="text-xs text-muted-foreground">{p.team || "FA"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">{p.tier}</span>
                              <span className="font-medium">{p.value.toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">No roster data. Sync to load.</p>
                    )}
                  </div>

                  {/* Draft Picks */}
                  <div>
                    <h4 className="font-medium mb-2">🎯 Draft Capital</h4>
                    {selectedTeamPicks.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {selectedTeamPicks
                          .sort((a, b) => a.season.localeCompare(b.season) || a.round - b.round)
                          .map((pick) => (
                          <div key={pick.id} className="flex items-center justify-between p-2 rounded border border-border text-sm">
                            <span className="font-medium">
                              {pick.season} R{pick.round}
                              {pick.pick && `.${pick.pick.toString().padStart(2, "0")}`}
                            </span>
                            <span className="text-muted-foreground">{pick.drewValue?.toLocaleString() || "—"}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        No picks tracked for this team. They may have traded away their picks.
                      </p>
                    )}
                  </div>

                  <div className="p-3 rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-2">💡 Trade Opportunity</h4>
                    {(selectedTeam.weaknesses as string[] || []).length > 0 ? (
                      <p className="text-sm text-muted-foreground">
                        This team needs help at <span className="font-medium text-amber-500">{(selectedTeam.weaknesses as string[]).join(", ")}</span>. 
                        Check your roster for assets to offer.
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No clear needs identified. May be a good trade partner for picks.
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
