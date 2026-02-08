"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Types
interface Scores {
  demandEvidence: number;    // 1-5: How validated is demand?
  marginCeiling: number;     // 1-5: Gross margin potential
  capitalEfficiency: number; // 1-5: Low capital to start
  timeToRevenue: number;     // 1-5: Speed to first dollar
  competition: number;       // 1-5: Market density (5=underserved)
  barrierToEntry: number;    // 1-5: Easy to start (5=anyone can start)
  defensibility: number;     // 1-5: Moat once established
  scalability: number;       // 1-5: Growth beyond yourself
  ownerFreedom: number;      // 1-5: Can run without you
  exitMultiple: number;      // 1-5: Would PE buy this?
  personalFit: number;       // 1-5: Your skills/network leverage
}

interface BusinessCase {
  marketSize: string;
  targetCustomer: string;
  businessModel: string;
  startupCosts: string;
  unitEconomics: string;
  projections: { year1: string; year2: string; year3: string };
  competitors: string;
  risks: string;
}

interface ExecutionPlan {
  weekByWeek: string[];
  hurdles: string[];
  hireOrOutsource: string;
  mvpVsFull: string;
  cashRunway: string;
  killCriteria: string;
}

interface BusinessIdea {
  id: string;
  name: string;
  oneLiner: string;
  category: string;
  source: string;
  whyNow: string;
  scores: Scores;
  status: string;
  layer: number;
  businessCase: BusinessCase | null;
  executionPlan: ExecutionPlan | null;
  notes: string;
  createdAt: string;
}

// Category colors
const categoryColors: Record<string, string> = {
  service: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  product: "bg-green-500/20 text-green-400 border-green-500/30",
  local: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  arbitrage: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  b2b: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

// Score labels with weights
const scoreLabels: Record<keyof Scores, { label: string; icon: string; weight: number }> = {
  demandEvidence: { label: "Demand Evidence", icon: "📊", weight: 2 },
  marginCeiling: { label: "Margin Potential", icon: "💰", weight: 1.5 },
  capitalEfficiency: { label: "Capital Efficiency", icon: "💵", weight: 1.5 },
  timeToRevenue: { label: "Time to Revenue", icon: "⏱️", weight: 1 },
  competition: { label: "Competition", icon: "🎯", weight: 1 },
  barrierToEntry: { label: "Barrier to Entry", icon: "🚪", weight: 1 },
  defensibility: { label: "Defensibility", icon: "🏰", weight: 1 },
  scalability: { label: "Scalability", icon: "📈", weight: 1 },
  ownerFreedom: { label: "Owner Freedom", icon: "🏖️", weight: 1 },
  exitMultiple: { label: "Exit Potential", icon: "🎰", weight: 1 },
  personalFit: { label: "Personal Fit", icon: "🎯", weight: 1.5 },
};

// Calculate weighted score (0-100) and letter grade
function calculateOverall(scores: Scores): { score: number; grade: string } {
  let total = 0;
  let weightSum = 0;
  for (const key of Object.keys(scoreLabels) as (keyof Scores)[]) {
    const value = scores[key] ?? 3; // default to 3 if missing
    const weight = scoreLabels[key].weight;
    total += value * weight;
    weightSum += weight;
  }
  // Normalize to 0-100
  const rawScore = (total / weightSum); // 1-5 scale
  const normalized = Math.round(((rawScore - 1) / 4) * 100); // convert to 0-100
  
  // Letter grade
  let grade = "F";
  if (normalized >= 90) grade = "A";
  else if (normalized >= 80) grade = "B+";
  else if (normalized >= 70) grade = "B";
  else if (normalized >= 60) grade = "C+";
  else if (normalized >= 50) grade = "C";
  else if (normalized >= 40) grade = "D";
  
  return { score: normalized, grade };
}

// Score bar component
function ScoreBar({ score, max = 5 }: { score: number; max?: number }) {
  const pct = (score / max) * 100;
  return (
    <div className="h-2 bg-muted rounded-full overflow-hidden">
      <div
        className="h-full bg-primary rounded-full transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<BusinessIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIdea, setSelectedIdea] = useState<BusinessIdea | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [filter, setFilter] = useState<"all" | "new" | "researched" | "ready" | "archived">("all");
  const [userNotes, setUserNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch ideas
  useEffect(() => {
    fetchIdeas();
  }, [filter]);

  async function fetchIdeas() {
    try {
      const url = filter === "all" ? "/api/ideas" : `/api/ideas?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      setIdeas(data);
    } catch (err) {
      console.error("Failed to fetch ideas:", err);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle upvote
  async function handleUpvote(idea: BusinessIdea) {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/ideas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: idea.id, action: "upvote" }),
      });
      const updated = await res.json();
      setIdeas((prev) => prev.map((i) => (i.id === idea.id ? updated : i)));
      setSelectedIdea(updated);
    } catch (err) {
      console.error("Failed to upvote:", err);
    } finally {
      setIsProcessing(false);
    }
  }

  // Handle downvote (archive)
  async function handleDownvote(idea: BusinessIdea) {
    setIsProcessing(true);
    try {
      await fetch("/api/ideas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: idea.id, action: "downvote" }),
      });
      setIdeas((prev) => prev.filter((i) => i.id !== idea.id));
      setSelectedIdea(null);
    } catch (err) {
      console.error("Failed to downvote:", err);
    } finally {
      setIsProcessing(false);
    }
  }

  // Save notes
  async function saveNotes() {
    if (!selectedIdea) return;
    try {
      const res = await fetch("/api/ideas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedIdea.id, action: "update", notes: userNotes }),
      });
      const updated = await res.json();
      setIdeas((prev) => prev.map((i) => (i.id === selectedIdea.id ? updated : i)));
      setSelectedIdea(updated);
    } catch (err) {
      console.error("Failed to save notes:", err);
    }
  }

  // Open idea modal
  function openIdea(idea: BusinessIdea) {
    setSelectedIdea(idea);
    setUserNotes(idea.notes || "");
    setActiveTab("overview");
  }

  // Status badge
  function StatusBadge({ status, layer }: { status: string; layer: number }) {
    if (status === "ready") {
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">🚀 Ready to Build</Badge>;
    }
    if (status === "researched") {
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">📊 Researched</Badge>;
    }
    return <Badge className="bg-muted text-muted-foreground">New</Badge>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading ideas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                ←
              </Link>
              <div>
                <h1 className="text-2xl font-bold">💡 Business Ideas</h1>
                <p className="text-sm text-muted-foreground">
                  {ideas.length} opportunities in pipeline
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex gap-2 flex-wrap">
          {(["all", "new", "researched", "ready", "archived"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Ideas Grid */}
      <main className="container mx-auto px-4 pb-8">
        {ideas.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-2">No ideas yet</p>
            <p className="text-sm text-muted-foreground">
              New ideas will appear here daily at 9 AM
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ideas.map((idea) => (
              <Card
                key={idea.id}
                className={`cursor-pointer transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/5 ${
                  idea.layer >= 3 ? "border-primary/50 shadow-md shadow-primary/10" : ""
                } ${idea.layer === 2 ? "border-primary/30" : ""}`}
                onClick={() => openIdea(idea)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg leading-tight">{idea.name}</CardTitle>
                    <StatusBadge status={idea.status} layer={idea.layer} />
                  </div>
                  <p className="text-sm text-muted-foreground">{idea.oneLiner}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge
                      variant="outline"
                      className={categoryColors[idea.category] || ""}
                    >
                      {idea.category}
                    </Badge>
                    {(() => {
                      const { score, grade } = calculateOverall(idea.scores);
                      return (
                        <span className={`text-xs font-medium ${grade.startsWith('A') ? 'text-green-400' : grade.startsWith('B') ? 'text-blue-400' : grade.startsWith('C') ? 'text-yellow-400' : 'text-red-400'}`}>
                          {grade} ({score})
                        </span>
                      );
                    })()}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(["demandEvidence", "capitalEfficiency", "personalFit"] as const).map((key) => (
                      <div key={key}>
                        <span className="text-muted-foreground">
                          {scoreLabels[key]?.icon}
                        </span>
                        <ScoreBar score={idea.scores[key] ?? 3} />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpvote(idea);
                      }}
                    >
                      👍
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownvote(idea);
                      }}
                    >
                      👎
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Idea Detail Modal */}
      <Dialog open={!!selectedIdea} onOpenChange={() => setSelectedIdea(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedIdea && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <DialogTitle className="text-xl">{selectedIdea.name}</DialogTitle>
                    <p className="text-muted-foreground mt-1">{selectedIdea.oneLiner}</p>
                  </div>
                  <StatusBadge status={selectedIdea.status} layer={selectedIdea.layer} />
                </div>
              </DialogHeader>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="business-case" disabled={selectedIdea.layer < 2}>
                    Business Case {selectedIdea.layer < 2 && "🔒"}
                  </TabsTrigger>
                  <TabsTrigger value="execution" disabled={selectedIdea.layer < 3}>
                    Execution {selectedIdea.layer < 3 && "🔒"}
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Category & Source</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={categoryColors[selectedIdea.category] || ""}
                          >
                            {selectedIdea.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Source:</span> {selectedIdea.source}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Why Now?</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{selectedIdea.whyNow}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Scores */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <span>Opportunity Scores</span>
                        {(() => {
                          const { score, grade } = calculateOverall(selectedIdea.scores);
                          return (
                            <span className={`font-bold ${grade.startsWith('A') ? 'text-green-400' : grade.startsWith('B') ? 'text-blue-400' : grade.startsWith('C') ? 'text-yellow-400' : 'text-red-400'}`}>
                              Grade: {grade} ({score}/100)
                            </span>
                          );
                        })()}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-3">
                        {(Object.keys(scoreLabels) as (keyof Scores)[]).map((key) => (
                          <div key={key} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>
                                {scoreLabels[key].icon} {scoreLabels[key].label}
                                {scoreLabels[key].weight > 1 && <span className="text-xs text-primary ml-1">({scoreLabels[key].weight}x)</span>}
                              </span>
                              <span className="text-muted-foreground">
                                {selectedIdea.scores[key] ?? "?"}/5
                              </span>
                            </div>
                            <ScoreBar score={selectedIdea.scores[key] ?? 0} />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Score Legend */}
                  <div className="p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground">
                    <p className="font-medium mb-1">Weighted Scoring:</p>
                    <p>📊 Demand Evidence, 💰 Margin, 💵 Capital Efficiency, 🎯 Personal Fit = <span className="text-primary">1.5-2x weight</span></p>
                    <p>Other factors = 1x weight. Grade based on weighted average (A=90+, B=70+, C=50+).</p>
                  </div>

                  {/* Notes */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Your Notes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Textarea
                        placeholder="Add your thoughts, contacts, next steps..."
                        value={userNotes}
                        onChange={(e) => setUserNotes(e.target.value)}
                        rows={3}
                      />
                      <Button size="sm" onClick={saveNotes}>
                        Save Notes
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Unlock prompt */}
                  {selectedIdea.layer === 1 && (
                    <Card className="border-primary/50 bg-primary/5">
                      <CardContent className="py-4 text-center">
                        <p className="text-sm mb-2">
                          👍 Upvote to unlock <strong>Business Case</strong> analysis
                        </p>
                        <Button onClick={() => handleUpvote(selectedIdea)} disabled={isProcessing}>
                          {isProcessing ? "Researching..." : "Unlock Business Case"}
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Business Case Tab */}
                <TabsContent value="business-case" className="space-y-4 mt-4">
                  {selectedIdea.businessCase ? (
                    <>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">📊 Market Size</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">{selectedIdea.businessCase.marketSize}</p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">🎯 Target Customer</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">{selectedIdea.businessCase.targetCustomer}</p>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">💼 Business Model</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{selectedIdea.businessCase.businessModel}</p>
                        </CardContent>
                      </Card>

                      <div className="grid md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">💰 Startup Costs</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm whitespace-pre-line">
                              {selectedIdea.businessCase.startupCosts}
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">📈 Unit Economics</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm whitespace-pre-line">
                              {selectedIdea.businessCase.unitEconomics}
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">📅 3-Year Projections</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Year 1</span>
                              <p className="font-medium">{selectedIdea.businessCase.projections.year1}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Year 2</span>
                              <p className="font-medium">{selectedIdea.businessCase.projections.year2}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Year 3</span>
                              <p className="font-medium">{selectedIdea.businessCase.projections.year3}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="grid md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">⚔️ Competitors</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">{selectedIdea.businessCase.competitors}</p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">⚠️ Key Risks</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">{selectedIdea.businessCase.risks}</p>
                          </CardContent>
                        </Card>
                      </div>

                      {selectedIdea.layer === 2 && (
                        <Card className="border-primary/50 bg-primary/5">
                          <CardContent className="py-4 text-center">
                            <p className="text-sm mb-2">
                              👍 Upvote again to unlock <strong>Execution Plan</strong>
                            </p>
                            <Button onClick={() => handleUpvote(selectedIdea)} disabled={isProcessing}>
                              {isProcessing ? "Planning..." : "Unlock Execution Plan"}
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  ) : (
                    <Card className="border-dashed">
                      <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground">
                          Business case analysis will appear here after research is complete.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Execution Tab */}
                <TabsContent value="execution" className="space-y-4 mt-4">
                  {selectedIdea.executionPlan ? (
                    <>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">📋 Week-by-Week Launch Plan</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ol className="list-decimal list-inside space-y-2 text-sm">
                            {selectedIdea.executionPlan.weekByWeek.map((step, i) => (
                              <li key={i}>{step}</li>
                            ))}
                          </ol>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">🚧 Key Hurdles</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {selectedIdea.executionPlan.hurdles.map((hurdle, i) => (
                              <li key={i}>{hurdle}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <div className="grid md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">👥 Hire vs Outsource</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">{selectedIdea.executionPlan.hireOrOutsource}</p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">🎯 MVP vs Full Build</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">{selectedIdea.executionPlan.mvpVsFull}</p>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">💵 Cash Runway Needed</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{selectedIdea.executionPlan.cashRunway}</p>
                        </CardContent>
                      </Card>

                      <Card className="border-red-500/30">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-red-400">🛑 Kill Criteria</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{selectedIdea.executionPlan.killCriteria}</p>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <Card className="border-dashed">
                      <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground">
                          Execution plan will appear here after you upvote the business case.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>

              {/* Action buttons */}
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleDownvote(selectedIdea)}
                  disabled={isProcessing}
                >
                  👎 Archive
                </Button>
                {selectedIdea.layer < 3 && (
                  <Button
                    className="flex-1"
                    onClick={() => handleUpvote(selectedIdea)}
                    disabled={isProcessing}
                  >
                    👍 {selectedIdea.layer === 1 ? "Research This" : "Plan Execution"}
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
