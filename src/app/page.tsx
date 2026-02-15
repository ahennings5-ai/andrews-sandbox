"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Activity, 
  Utensils, 
  Lightbulb, 
  Crown, 
  TrendingUp,
  Calendar,
  Flame,
  Target,
  ChevronRight,
  Sparkles,
  Zap
} from "lucide-react";

// Motivational quotes from favorite coaches
const coachQuotes = [
  { quote: "Discipline is doing what you hate to do, but doing it like you love it.", coach: "Nick Saban" },
  { quote: "The process is about what you do every single day to become the best you can be.", coach: "Nick Saban" },
  { quote: "Don't focus on the scoreboard. Focus on effort, execution, and attitude.", coach: "Nick Saban" },
  { quote: "Mental toughness is spartanism with qualities of sacrifice, self-denial, and dedication.", coach: "Bob Knight" },
  { quote: "The will to succeed is important, but what's more important is the will to prepare.", coach: "Bob Knight" },
  { quote: "Everyone wants to win, but not everyone wants to prepare to win.", coach: "Bob Knight" },
  { quote: "You don't play against opponents. You play against the game of basketball.", coach: "Bob Knight" },
  { quote: "Hard work beats talent when talent doesn't work hard.", coach: "Curt Cignetti" },
  { quote: "We're going to outwork everybody. That's non-negotiable.", coach: "Curt Cignetti" },
  { quote: "Championship culture isn't built overnight. It's built one day at a time.", coach: "Curt Cignetti" },
  { quote: "Speed kills. Train fast, be fast.", coach: "Ben Johnson" },
  { quote: "Your body will quit a thousand times before your mind does. Train your mind.", coach: "Ben Johnson" },
];

interface Stats {
  marathon: { totalMiles: number; runsThisWeek: number; streak: number };
  ideas: { total: number; upvoted: number; new: number };
  dynasty: { teamValue: number; rank: number; mode: string };
  meals: { plannedThisWeek: number };
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getTimeEmoji(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "🌙";
  if (hour < 12) return "☀️";
  if (hour < 17) return "🌤️";
  if (hour < 20) return "🌅";
  return "🌙";
}

export default function Home() {
  const [quote, setQuote] = useState(coachQuotes[0]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [greeting, setGreeting] = useState("Welcome");
  const [timeEmoji, setTimeEmoji] = useState("👋");
  
  useEffect(() => {
    const pickRandomQuote = () => {
      const randomQuote = coachQuotes[Math.floor(Math.random() * coachQuotes.length)];
      setQuote(randomQuote);
    };
    
    pickRandomQuote();
    setGreeting(getGreeting());
    setTimeEmoji(getTimeEmoji());
    
    // Fetch stats
    const fetchStats = async () => {
      try {
        const [ideasRes, dynastyRes, runsRes, syncRes] = await Promise.all([
          fetch("/api/ideas").catch(() => null),
          fetch("/api/dynasty/teams").catch(() => null),
          fetch("/api/runs").catch(() => null),
          fetch("/api/dynasty/sync").catch(() => null),
        ]);
        
        const ideas = ideasRes?.ok ? await ideasRes.json().catch(() => []) : [];
        const dynastyData = dynastyRes?.ok ? await dynastyRes.json().catch(() => null) : null;
        const runs = runsRes?.ok ? await runsRes.json().catch(() => []) : [];
        const syncData = syncRes?.ok ? await syncRes.json().catch(() => null) : null;
        
        // Find Andrew's team (rosterId 1) and calculate rank
        const allTeams = dynastyData?.teams || [];
        const myTeam = allTeams.find((t: { rosterId: number }) => t.rosterId === 1) || null;
        const sortedTeams = allTeams.length > 0 
          ? [...allTeams].sort((a: { totalValue: number }, b: { totalValue: number }) => (b.totalValue || 0) - (a.totalValue || 0))
          : [];
        const myRank = sortedTeams.length > 0 
          ? sortedTeams.findIndex((t: { rosterId: number }) => t.rosterId === 1) + 1 
          : 12;
        
        // Parse phase recommendation if it's a string
        let phase = "tank";
        if (syncData?.phaseRecommendation) {
          const rec = typeof syncData.phaseRecommendation === "string" 
            ? JSON.parse(syncData.phaseRecommendation) 
            : syncData.phaseRecommendation;
          phase = rec?.phase || "tank";
        }
        if (myTeam?.mode) phase = myTeam.mode;
        
        // Calculate running stats from actual data
        const totalMiles = Array.isArray(runs) 
          ? runs.reduce((sum: number, r: {actualMiles?: number}) => sum + (r.actualMiles || 0), 0)
          : 0;
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        const runsThisWeek = Array.isArray(runs)
          ? runs.filter((r: {date?: string}) => r.date && new Date(r.date) >= weekStart).length
          : 0;
        
        setStats({
          marathon: { totalMiles, runsThisWeek, streak: 5 },
          ideas: { 
            total: Array.isArray(ideas) ? ideas.length : 0,
            upvoted: Array.isArray(ideas) ? ideas.filter((i: {layer: number}) => i.layer >= 2).length : 0,
            new: Array.isArray(ideas) ? ideas.filter((i: {status: string}) => i.status === "new").length : 0
          },
          dynasty: { 
            teamValue: myTeam?.totalValue || 0, 
            rank: myRank,
            mode: phase
          },
          meals: { plannedThisWeek: 7 }
        });
      } catch (e) {
        console.error("Failed to fetch stats", e);
      }
    };
    
    fetchStats();
    
    window.addEventListener("focus", pickRandomQuote);
    return () => window.removeEventListener("focus", pickRandomQuote);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{timeEmoji}</span>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="text-muted-foreground">{greeting},</span>{" "}
              <span className="gradient-text">Andrew</span>
            </h1>
          </div>
          
          {/* Quote card */}
          <div className="glass-card rounded-xl p-5 mt-6 max-w-2xl gradient-border">
            <p className="text-lg text-foreground/90 italic leading-relaxed">
              &ldquo;{quote.quote}&rdquo;
            </p>
            <p className="text-sm text-primary font-medium mt-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {quote.coach}
            </p>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="stat-card">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <Activity className="w-5 h-5" />
              <span className="text-xs uppercase tracking-wider">Miles</span>
            </div>
            <div className="stat-value">{stats?.marathon.totalMiles || "—"}</div>
            <div className="stat-label">Total logged</div>
          </div>
          
          <div className="stat-card">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <Flame className="w-5 h-5 streak-fire" />
              <span className="text-xs uppercase tracking-wider">Streak</span>
            </div>
            <div className="stat-value flex items-baseline gap-1">
              {stats?.marathon.streak || "—"}
              <span className="text-lg text-amber-400">🔥</span>
            </div>
            <div className="stat-label">Days running</div>
          </div>
          
          <div className="stat-card">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Lightbulb className="w-5 h-5" />
              <span className="text-xs uppercase tracking-wider">Ideas</span>
            </div>
            <div className="stat-value">{stats?.ideas.total || "—"}</div>
            <div className="stat-label">{stats?.ideas.new || 0} new this week</div>
          </div>
          
          <div className="stat-card">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <Crown className="w-5 h-5" />
              <span className="text-xs uppercase tracking-wider">Dynasty</span>
            </div>
            <div className="stat-value flex items-center gap-2">
              {stats?.dynasty?.mode === "tank" ? "🔻" : stats?.dynasty?.mode === "contend" ? "🚀" : "🔄"}
              <span className="capitalize">{stats?.dynasty?.mode || "Tank"}</span>
            </div>
            <div className="stat-label">Rank #{stats?.dynasty?.rank || "12"}</div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-10">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/marathon?action=log">
              <Button variant="secondary" className="glass-card border-0 hover:bg-emerald-500/20 hover:text-emerald-400 transition-all">
                <Activity className="w-4 h-4 mr-2" />
                Log a Run
              </Button>
            </Link>
            <Link href="/ideas">
              <Button variant="secondary" className="glass-card border-0 hover:bg-primary/20 hover:text-primary transition-all">
                <Lightbulb className="w-4 h-4 mr-2" />
                Review Ideas
              </Button>
            </Link>
            <Link href="/meals">
              <Button variant="secondary" className="glass-card border-0 hover:bg-amber-500/20 hover:text-amber-400 transition-all">
                <Utensils className="w-4 h-4 mr-2" />
                Plan Meals
              </Button>
            </Link>
            <Link href="/dynasty">
              <Button variant="secondary" className="glass-card border-0 hover:bg-cyan-500/20 hover:text-cyan-400 transition-all">
                <Crown className="w-4 h-4 mr-2" />
                Check Dynasty
              </Button>
            </Link>
          </div>
        </section>

        {/* Main Cards */}
        <section className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Marathon Card */}
          <Link href="/marathon" className="group">
            <Card className="glass-card-hover h-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">NYC Marathon</CardTitle>
                      <CardDescription>November 1, 2026</CardDescription>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-3xl font-bold text-emerald-400">{stats?.marathon.runsThisWeek || 0}</div>
                    <div className="text-xs text-muted-foreground">runs this week</div>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div>
                    <div className="text-3xl font-bold">{stats?.marathon.totalMiles || 0}</div>
                    <div className="text-xs text-muted-foreground">total miles</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="w-4 h-4" />
                  <span>Goal: Sub-4:00 finish</span>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Ideas Card */}
          <Link href="/ideas" className="group">
            <Card className="glass-card-hover h-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/20 text-primary">
                      <Lightbulb className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Business Ideas</CardTitle>
                      <CardDescription>Pipeline & Research</CardDescription>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-3xl font-bold text-primary">{stats?.ideas.new || 0}</div>
                    <div className="text-xs text-muted-foreground">new ideas</div>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div>
                    <div className="text-3xl font-bold">{stats?.ideas.upvoted || 0}</div>
                    <div className="text-xs text-muted-foreground">researched</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  <span>5 new ideas daily</span>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Meals Card */}
          <Link href="/meals" className="group">
            <Card className="glass-card-hover h-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                      <Utensils className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Meal Planner</CardTitle>
                      <CardDescription>Weekly Menu</CardDescription>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-3xl font-bold text-amber-400">{stats?.meals.plannedThisWeek || 0}</div>
                    <div className="text-xs text-muted-foreground">meals planned</div>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div>
                    <div className="text-3xl font-bold">$200</div>
                    <div className="text-xs text-muted-foreground">weekly budget</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Planned through Sunday</span>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Dynasty Card */}
          <Link href="/dynasty" className="group">
            <Card className="glass-card-hover h-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                      <Crown className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Dynasty Manager</CardTitle>
                      <CardDescription>Midd Baseball League</CardDescription>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-3xl font-bold text-cyan-400 flex items-center gap-1">
                      {stats?.dynasty?.mode === "tank" ? "🔻" : stats?.dynasty?.mode === "contend" ? "🚀" : "🔄"}
                      <span className="capitalize">{stats?.dynasty?.mode || "Tank"}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">current mode</div>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div>
                    <div className="text-3xl font-bold">#{stats?.dynasty?.rank || "12"}</div>
                    <div className="text-xs text-muted-foreground">league rank</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="w-4 h-4" />
                  <span>Accumulating picks & youth</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-border/50">
          <p className="text-muted-foreground text-sm">
            Built with Next.js, Tailwind CSS, and shadcn/ui
          </p>
        </footer>
      </div>
    </div>
  );
}
