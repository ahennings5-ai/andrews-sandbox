"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Link from "next/link";

// Types
interface Settings {
  id: string;
  leagueId: string;
  leagueName: string;
  teamName: string;
  mode: "tank" | "retool" | "contend";
  lastSync: string | null;
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [prospectClass, setProspectClass] = useState<"2026" | "2027">("2026");
  const [totalValue, setTotalValue] = useState(0);

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
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
            <TabsTrigger value="assets">My Assets</TabsTrigger>
            <TabsTrigger value="scouting">Scouting</TabsTrigger>
            <TabsTrigger value="trades">Trade Finder</TabsTrigger>
            <TabsTrigger value="intel">League Intel</TabsTrigger>
            <TabsTrigger value="history">Trade History</TabsTrigger>
          </TabsList>

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
            {sellCandidates.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>🎯 Recommended Actions</CardTitle>
                  <CardDescription>Based on your {modeConfig[mode].label} strategy</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sellCandidates.slice(0, 5).map((player) => (
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
                  </div>
                </CardContent>
              </Card>
            )}
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
                      onClick={() => setSelectedProspect(prospect)}
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
                      onClick={() => setSelectedTeam(team)}
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

        {/* Prospect Detail Modal */}
        <Dialog open={!!selectedProspect} onOpenChange={() => setSelectedProspect(null)}>
          <DialogContent className="max-w-lg">
            {selectedProspect && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Badge className={positionColors[selectedProspect.position] || "bg-gray-500"}>
                      {selectedProspect.position}
                    </Badge>
                    {selectedProspect.name}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedProspect.college} • {selectedProspect.draftClass} Class
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 rounded-lg bg-muted">
                      <div className="text-2xl font-bold">#{selectedProspect.drewRank}</div>
                      <div className="text-xs text-muted-foreground">Drew Rank</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <div className="text-2xl font-bold">#{selectedProspect.consensus}</div>
                      <div className="text-xs text-muted-foreground">Consensus</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-2">Scouting Notes</h4>
                    <p className="text-sm text-muted-foreground">{selectedProspect.notes}</p>
                  </div>

                  {selectedProspect.athleticScores && (
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-medium mb-2">Athletic Testing</h4>
                      <p className="text-sm text-muted-foreground">Combine/Pro Day data coming soon</p>
                    </div>
                  )}

                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-2">Latest Buzz</h4>
                    <p className="text-sm text-muted-foreground">News articles coming soon</p>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Team Detail Modal */}
        <Dialog open={!!selectedTeam} onOpenChange={() => setSelectedTeam(null)}>
          <DialogContent className="max-w-lg">
            {selectedTeam && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedTeam.ownerUsername}</DialogTitle>
                  <DialogDescription>
                    {selectedTeam.teamName || "No team name"} • {selectedTeam.mode}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="p-3 rounded-lg bg-muted text-center">
                    <div className="text-3xl font-bold">{selectedTeam.totalValue?.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Total Team Value</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg border border-green-500/30 bg-green-500/5">
                      <h4 className="font-medium text-green-500 mb-2">Strengths</h4>
                      <div className="flex flex-wrap gap-1">
                        {(selectedTeam.strengths as string[] || []).map((s) => (
                          <Badge key={s} variant="outline">{s}</Badge>
                        ))}
                        {(!selectedTeam.strengths || (selectedTeam.strengths as string[]).length === 0) && (
                          <span className="text-sm text-muted-foreground">None identified</span>
                        )}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/5">
                      <h4 className="font-medium text-red-500 mb-2">Weaknesses</h4>
                      <div className="flex flex-wrap gap-1">
                        {(selectedTeam.weaknesses as string[] || []).map((w) => (
                          <Badge key={w} variant="outline">{w}</Badge>
                        ))}
                        {(!selectedTeam.weaknesses || (selectedTeam.weaknesses as string[]).length === 0) && (
                          <span className="text-sm text-muted-foreground">None identified</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-2">Trade Opportunity</h4>
                    {(selectedTeam.weaknesses as string[] || []).length > 0 ? (
                      <p className="text-sm text-muted-foreground">
                        This team needs help at {(selectedTeam.weaknesses as string[]).join(", ")}. 
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
