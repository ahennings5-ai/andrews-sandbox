"use client";

import { useState, useEffect, Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

// Error Boundary to catch and display errors
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 max-w-lg">
            <h2 className="text-red-500 font-bold text-lg mb-2">Something went wrong</h2>
            <p className="text-sm text-muted-foreground mb-4">Error: {this.state.error?.message}</p>
            <pre className="text-xs bg-black/50 p-2 rounded overflow-auto max-h-40">
              {this.state.error?.stack}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Key dates
const RACE_DATE = new Date("2026-11-01");
const PLAN_START = new Date("2026-07-06");
const BASE_START = new Date("2026-02-03");

const weeksBetween = (start: Date, end: Date) => {
  return Math.floor((end.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
};

const BASE_WEEKS = weeksBetween(BASE_START, PLAN_START);
const TOTAL_WEEKS = BASE_WEEKS + 18;

// Run type configuration - single source of truth
const runTypes = {
  easy: {
    label: "Easy",
    color: "bg-emerald-500",
    colorMuted: "bg-emerald-500/15",
    textColor: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    pace: { target: "9:15", range: "9:00-9:30", description: "Conversational pace" },
  },
  tempo: {
    label: "Tempo",
    color: "bg-amber-500",
    colorMuted: "bg-amber-500/15",
    textColor: "text-amber-400",
    borderColor: "border-amber-500/30",
    pace: { target: "8:00", range: "7:45-8:15", description: "Comfortably hard" },
  },
  intervals: {
    label: "Intervals",
    color: "bg-rose-500",
    colorMuted: "bg-rose-500/15",
    textColor: "text-rose-400",
    borderColor: "border-rose-500/30",
    pace: { target: "7:15", range: "7:00-7:30", description: "Fast efforts" },
  },
  long: {
    label: "Long",
    color: "bg-sky-500",
    colorMuted: "bg-sky-500/15",
    textColor: "text-sky-400",
    borderColor: "border-sky-500/30",
    pace: { target: "9:15", range: "9:00-9:30", description: "Steady endurance" },
  },
  rest: {
    label: "Rest",
    color: "bg-slate-500",
    colorMuted: "bg-slate-500/15",
    textColor: "text-slate-400",
    borderColor: "border-slate-500/30",
    pace: { target: "-", range: "-", description: "Recovery" },
  },
  race: {
    label: "Race",
    color: "bg-purple-500",
    colorMuted: "bg-purple-500/15",
    textColor: "text-purple-400",
    borderColor: "border-purple-500/30",
    pace: { target: "9:00", range: "9:00", description: "Goal marathon pace" },
  },
} as const;

type RunType = keyof typeof runTypes;

// Generate base building phase (15 mi/week)
const generateBasePhase = () => {
  const workouts = [];
  for (let week = 1; week <= BASE_WEEKS; week++) {
    workouts.push({ week, day: 1, type: "easy" as RunType, miles: 3, description: "Easy run - conversational pace" });
    workouts.push({ week, day: 2, type: "rest" as RunType, miles: 0, description: "Rest or cross-train" });
    workouts.push({ week, day: 3, type: "easy" as RunType, miles: 4, description: "Easy run" });
    workouts.push({ week, day: 4, type: "easy" as RunType, miles: 4, description: "Easy run" });
    workouts.push({ week, day: 5, type: "rest" as RunType, miles: 0, description: "Rest" });
    workouts.push({ week, day: 6, type: "long" as RunType, miles: 4, description: "Long run - building endurance" });
    workouts.push({ week, day: 7, type: "rest" as RunType, miles: 0, description: "Rest" });
  }
  return workouts;
};

// 18-week marathon training plan
const generateMarathonPlan = () => {
  const offset = BASE_WEEKS;
  const plan: { week: number; day: number; type: RunType; miles: number; description: string }[] = [
    { week: 1, day: 1, type: "easy", miles: 3, description: "Easy run" },
    { week: 1, day: 2, type: "rest", miles: 0, description: "Rest or cross-train" },
    { week: 1, day: 3, type: "easy", miles: 4, description: "Easy run" },
    { week: 1, day: 4, type: "easy", miles: 3, description: "Easy run" },
    { week: 1, day: 5, type: "rest", miles: 0, description: "Rest" },
    { week: 1, day: 6, type: "long", miles: 6, description: "Long run" },
    { week: 1, day: 7, type: "rest", miles: 0, description: "Rest" },
    { week: 2, day: 1, type: "easy", miles: 3, description: "Easy run" },
    { week: 2, day: 2, type: "tempo", miles: 4, description: "Tempo run" },
    { week: 2, day: 3, type: "easy", miles: 3, description: "Easy run" },
    { week: 2, day: 4, type: "rest", miles: 0, description: "Rest" },
    { week: 2, day: 5, type: "easy", miles: 4, description: "Easy run" },
    { week: 2, day: 6, type: "long", miles: 8, description: "Long run" },
    { week: 2, day: 7, type: "rest", miles: 0, description: "Rest" },
    { week: 3, day: 1, type: "easy", miles: 4, description: "Easy run" },
    { week: 3, day: 2, type: "intervals", miles: 5, description: "6x800m w/ 400m recovery" },
    { week: 3, day: 3, type: "easy", miles: 3, description: "Recovery run" },
    { week: 3, day: 4, type: "rest", miles: 0, description: "Rest" },
    { week: 3, day: 5, type: "tempo", miles: 5, description: "Tempo run" },
    { week: 3, day: 6, type: "long", miles: 10, description: "Long run" },
    { week: 3, day: 7, type: "rest", miles: 0, description: "Rest" },
    { week: 4, day: 1, type: "easy", miles: 3, description: "Easy run" },
    { week: 4, day: 2, type: "easy", miles: 4, description: "Easy run" },
    { week: 4, day: 3, type: "rest", miles: 0, description: "Rest" },
    { week: 4, day: 4, type: "easy", miles: 3, description: "Easy run" },
    { week: 4, day: 5, type: "rest", miles: 0, description: "Rest" },
    { week: 4, day: 6, type: "long", miles: 6, description: "Recovery long run" },
    { week: 4, day: 7, type: "rest", miles: 0, description: "Rest" },
    { week: 5, day: 1, type: "easy", miles: 4, description: "Easy run" },
    { week: 5, day: 2, type: "intervals", miles: 6, description: "8x800m" },
    { week: 5, day: 3, type: "easy", miles: 4, description: "Easy run" },
    { week: 5, day: 4, type: "rest", miles: 0, description: "Rest" },
    { week: 5, day: 5, type: "tempo", miles: 5, description: "Tempo run" },
    { week: 5, day: 6, type: "long", miles: 12, description: "Long run" },
    { week: 5, day: 7, type: "rest", miles: 0, description: "Rest" },
    { week: 6, day: 1, type: "easy", miles: 4, description: "Easy run" },
    { week: 6, day: 2, type: "tempo", miles: 6, description: "Tempo run" },
    { week: 6, day: 3, type: "easy", miles: 4, description: "Easy run" },
    { week: 6, day: 4, type: "rest", miles: 0, description: "Rest" },
    { week: 6, day: 5, type: "intervals", miles: 5, description: "Hill repeats: 8x90sec" },
    { week: 6, day: 6, type: "long", miles: 14, description: "Long run" },
    { week: 6, day: 7, type: "rest", miles: 0, description: "Rest" },
    { week: 7, day: 1, type: "easy", miles: 5, description: "Easy run" },
    { week: 7, day: 2, type: "intervals", miles: 7, description: "5x1 mile" },
    { week: 7, day: 3, type: "easy", miles: 4, description: "Easy run" },
    { week: 7, day: 4, type: "rest", miles: 0, description: "Rest" },
    { week: 7, day: 5, type: "tempo", miles: 6, description: "Tempo run" },
    { week: 7, day: 6, type: "long", miles: 16, description: "Long run" },
    { week: 7, day: 7, type: "rest", miles: 0, description: "Rest" },
    { week: 8, day: 1, type: "easy", miles: 4, description: "Easy run" },
    { week: 8, day: 2, type: "easy", miles: 5, description: "Easy run" },
    { week: 8, day: 3, type: "rest", miles: 0, description: "Rest" },
    { week: 8, day: 4, type: "easy", miles: 4, description: "Easy run" },
    { week: 8, day: 5, type: "rest", miles: 0, description: "Rest" },
    { week: 8, day: 6, type: "long", miles: 10, description: "Recovery long run" },
    { week: 8, day: 7, type: "rest", miles: 0, description: "Rest" },
    { week: 9, day: 1, type: "easy", miles: 5, description: "Easy run" },
    { week: 9, day: 2, type: "tempo", miles: 7, description: "Tempo run" },
    { week: 9, day: 3, type: "easy", miles: 4, description: "Easy run" },
    { week: 9, day: 4, type: "rest", miles: 0, description: "Rest" },
    { week: 9, day: 5, type: "intervals", miles: 6, description: "10x800m" },
    { week: 9, day: 6, type: "long", miles: 18, description: "Long run" },
    { week: 9, day: 7, type: "rest", miles: 0, description: "Rest" },
    { week: 10, day: 1, type: "easy", miles: 5, description: "Easy run" },
    { week: 10, day: 2, type: "intervals", miles: 8, description: "6x1 mile" },
    { week: 10, day: 3, type: "easy", miles: 5, description: "Easy run" },
    { week: 10, day: 4, type: "rest", miles: 0, description: "Rest" },
    { week: 10, day: 5, type: "tempo", miles: 6, description: "Tempo run" },
    { week: 10, day: 6, type: "long", miles: 15, description: "Long run" },
    { week: 10, day: 7, type: "rest", miles: 0, description: "Rest" },
    { week: 11, day: 1, type: "easy", miles: 5, description: "Easy run" },
    { week: 11, day: 2, type: "tempo", miles: 8, description: "Tempo run" },
    { week: 11, day: 3, type: "easy", miles: 5, description: "Easy run" },
    { week: 11, day: 4, type: "rest", miles: 0, description: "Rest" },
    { week: 11, day: 5, type: "intervals", miles: 6, description: "Hill repeats" },
    { week: 11, day: 6, type: "long", miles: 20, description: "Peak long run!" },
    { week: 11, day: 7, type: "rest", miles: 0, description: "Rest" },
    { week: 12, day: 1, type: "easy", miles: 4, description: "Easy run" },
    { week: 12, day: 2, type: "easy", miles: 5, description: "Easy run" },
    { week: 12, day: 3, type: "rest", miles: 0, description: "Rest" },
    { week: 12, day: 4, type: "easy", miles: 4, description: "Easy run" },
    { week: 12, day: 5, type: "rest", miles: 0, description: "Rest" },
    { week: 12, day: 6, type: "long", miles: 12, description: "Recovery long run" },
    { week: 12, day: 7, type: "rest", miles: 0, description: "Rest" },
    { week: 13, day: 1, type: "easy", miles: 5, description: "Easy run" },
    { week: 13, day: 2, type: "intervals", miles: 7, description: "8x1000m" },
    { week: 13, day: 3, type: "easy", miles: 5, description: "Easy run" },
    { week: 13, day: 4, type: "rest", miles: 0, description: "Rest" },
    { week: 13, day: 5, type: "tempo", miles: 7, description: "Tempo run" },
    { week: 13, day: 6, type: "long", miles: 18, description: "Long run" },
    { week: 13, day: 7, type: "rest", miles: 0, description: "Rest" },
    { week: 14, day: 1, type: "easy", miles: 5, description: "Easy run" },
    { week: 14, day: 2, type: "tempo", miles: 8, description: "Tempo run" },
    { week: 14, day: 3, type: "easy", miles: 5, description: "Easy run" },
    { week: 14, day: 4, type: "rest", miles: 0, description: "Rest" },
    { week: 14, day: 5, type: "intervals", miles: 6, description: "Race pace intervals" },
    { week: 14, day: 6, type: "long", miles: 20, description: "Final 20-miler" },
    { week: 14, day: 7, type: "rest", miles: 0, description: "Rest" },
    { week: 15, day: 1, type: "easy", miles: 5, description: "Easy run" },
    { week: 15, day: 2, type: "tempo", miles: 6, description: "Tempo run" },
    { week: 15, day: 3, type: "easy", miles: 4, description: "Easy run" },
    { week: 15, day: 4, type: "rest", miles: 0, description: "Rest" },
    { week: 15, day: 5, type: "easy", miles: 5, description: "Easy run" },
    { week: 15, day: 6, type: "long", miles: 14, description: "Taper long run" },
    { week: 15, day: 7, type: "rest", miles: 0, description: "Rest" },
    { week: 16, day: 1, type: "easy", miles: 4, description: "Easy run" },
    { week: 16, day: 2, type: "tempo", miles: 5, description: "Short tempo" },
    { week: 16, day: 3, type: "easy", miles: 4, description: "Easy run" },
    { week: 16, day: 4, type: "rest", miles: 0, description: "Rest" },
    { week: 16, day: 5, type: "easy", miles: 4, description: "Easy run" },
    { week: 16, day: 6, type: "long", miles: 10, description: "Long run" },
    { week: 16, day: 7, type: "rest", miles: 0, description: "Rest" },
    { week: 17, day: 1, type: "easy", miles: 4, description: "Easy run" },
    { week: 17, day: 2, type: "tempo", miles: 4, description: "Short tempo" },
    { week: 17, day: 3, type: "easy", miles: 3, description: "Easy run" },
    { week: 17, day: 4, type: "rest", miles: 0, description: "Rest" },
    { week: 17, day: 5, type: "easy", miles: 3, description: "Shakeout run" },
    { week: 17, day: 6, type: "long", miles: 8, description: "Final long run" },
    { week: 17, day: 7, type: "rest", miles: 0, description: "Rest" },
    { week: 18, day: 1, type: "easy", miles: 3, description: "Easy run" },
    { week: 18, day: 2, type: "easy", miles: 3, description: "Shakeout w/ strides" },
    { week: 18, day: 3, type: "easy", miles: 2, description: "Very easy" },
    { week: 18, day: 4, type: "rest", miles: 0, description: "Rest & hydrate" },
    { week: 18, day: 5, type: "easy", miles: 2, description: "Shakeout run" },
    { week: 18, day: 6, type: "rest", miles: 0, description: "Rest & prep gear" },
    { week: 18, day: 7, type: "race", miles: 26.2, description: "NYC MARATHON! 🗽" },
  ];
  return plan.map((w) => ({ ...w, week: w.week + offset }));
};

const trainingPlan = [...generateBasePhase(), ...generateMarathonPlan()];

interface MileSplit {
  mile: number;
  pace: string;
}

interface RunLog {
  id: string;
  week: number;
  day: number;
  date: string;
  actualMiles: number;
  duration: string;
  pace: string;
  feeling: "great" | "good" | "okay" | "tough" | "struggled";
  notes: string;
  splits?: MileSplit[];
  coachingFeedback?: string;
}

interface TrainingState {
  logs: RunLog[];
}

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const feelingConfig = {
  great: { emoji: "🔥", label: "Great" },
  good: { emoji: "😊", label: "Good" },
  okay: { emoji: "😐", label: "Okay" },
  tough: { emoji: "😤", label: "Tough" },
  struggled: { emoji: "😵", label: "Struggled" },
} as const;

function MarathonTrackerInner() {
  const [state, setState] = useState<TrainingState>({ logs: [] });
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [runDetailsOpen, setRunDetailsOpen] = useState(false);
  const [warmUpOpen, setWarmUpOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<(typeof trainingPlan)[0] | null>(null);
  const [logForm, setLogForm] = useState({
    actualMiles: "",
    duration: "",
    feeling: "good" as RunLog["feeling"],
    notes: "",
    splitsText: "", // Format: "8:30, 8:45, 9:00" or one per line
  });

  // Warm-up exercises based on run type
  const getWarmUp = (runType: RunType) => {
    const baseWarmUp = [
      { name: "Plank Hold", duration: "30 sec", reps: null, description: "Core engaged, body straight from head to heels" },
      { name: "Side Plank (each side)", duration: "20 sec", reps: null, description: "Stack feet or stagger, hips up" },
      { name: "Leg Swings (front-back)", duration: null, reps: "10 each leg", description: "Hold wall for balance, swing freely" },
      { name: "Leg Swings (side-to-side)", duration: null, reps: "10 each leg", description: "Cross body, open hip" },
      { name: "Walking Lunges", duration: null, reps: "10 each leg", description: "Big step, knee over ankle, upright torso" },
      { name: "High Knees", duration: "30 sec", reps: null, description: "Drive knees up, quick feet" },
      { name: "Butt Kicks", duration: "30 sec", reps: null, description: "Heel to glute, stay light" },
    ];

    const dynamicStrength = [
      { name: "Squats", duration: null, reps: "15", description: "Weight in heels, chest up, below parallel" },
      { name: "Push-ups", duration: null, reps: "10", description: "Full range, core tight" },
      { name: "Glute Bridges", duration: null, reps: "15", description: "Squeeze at top, slow lower" },
    ];

    const speedActivation = [
      { name: "A-Skips", duration: "30 sec", reps: null, description: "Drive knee up, skip with power" },
      { name: "B-Skips", duration: "30 sec", reps: null, description: "Extend leg forward after knee drive" },
      { name: "Strides", duration: null, reps: "4 x 50m", description: "Build to 80% speed, relax" },
    ];

    if (runType === "intervals" || runType === "tempo") {
      return { 
        title: "Speed Warm-Up (10-12 min)", 
        exercises: [...baseWarmUp, ...dynamicStrength, ...speedActivation] 
      };
    } else if (runType === "long") {
      return { 
        title: "Long Run Warm-Up (8-10 min)", 
        exercises: [...baseWarmUp, ...dynamicStrength] 
      };
    } else {
      return { 
        title: "Easy Run Warm-Up (5-7 min)", 
        exercises: baseWarmUp 
      };
    }
  };
  
  // Generate mile splits for a run
  const generateMileSplits = (miles: number, type: RunType) => {
    const config = runTypes[type];
    if (type === "rest" || miles === 0) return [];
    
    const [minPace, maxPace] = config.pace.range.split("-").map(p => {
      const [m, s] = p.trim().split(":").map(Number);
      return m * 60 + s;
    });
    const targetSecs = minPace && maxPace ? (minPace + maxPace) / 2 : minPace;
    
    const splits: { mile: number; pace: string; cumulative: string }[] = [];
    let totalSecs = 0;
    
    for (let i = 1; i <= Math.ceil(miles); i++) {
      const mileDistance = i <= miles ? 1 : miles % 1;
      const mileTime = targetSecs * mileDistance;
      totalSecs += mileTime;
      
      const paceMin = Math.floor(targetSecs / 60);
      const paceSec = Math.round(targetSecs % 60);
      const cumMin = Math.floor(totalSecs / 60);
      const cumSec = Math.round(totalSecs % 60);
      
      splits.push({
        mile: i <= miles ? i : miles,
        pace: `${paceMin}:${paceSec.toString().padStart(2, "0")}`,
        cumulative: `${cumMin}:${cumSec.toString().padStart(2, "0")}`,
      });
    }
    
    return splits;
  };

  // Calculate current week
  useEffect(() => {
    const today = new Date();
    const daysSinceStart = Math.floor((today.getTime() - BASE_START.getTime()) / (24 * 60 * 60 * 1000));
    const currentWeek = Math.max(1, Math.min(TOTAL_WEEKS, Math.floor(daysSinceStart / 7) + 1));
    setSelectedWeek(currentWeek);
  }, []);

  // Load from database
  useEffect(() => {
    async function loadLogs() {
      try {
        const response = await fetch("/api/runs");
        if (response.ok) {
          const logs = await response.json();
          setState({ logs: logs || [] });
        }
      } catch (error) {
        console.error("Failed to load runs:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadLogs();
  }, []);

  const getDateForWorkout = (week: number, day: number) => {
    const daysToAdd = (week - 1) * 7 + (day - 1);
    const date = new Date(BASE_START);
    date.setDate(BASE_START.getDate() + daysToAdd);
    return date.toISOString().split("T")[0];
  };

  const getLogForWorkout = (week: number, day: number) => {
    return state.logs.find((log) => log.week === week && log.day === day);
  };

  const calculatePace = (miles: string, duration: string) => {
    if (!miles || !duration) return "";
    const parts = duration.split(":");
    const mins = parseInt(parts[0]) || 0;
    const secs = parseInt(parts[1]) || 0;
    const totalMinutes = mins + secs / 60;
    const milesNum = parseFloat(miles);
    if (milesNum <= 0) return "";
    const paceMinutes = totalMinutes / milesNum;
    const paceMins = Math.floor(paceMinutes);
    const paceSecs = Math.round((paceMinutes - paceMins) * 60);
    return `${paceMins}:${paceSecs.toString().padStart(2, "0")}`;
  };

  // Parse splits from text input (e.g., "8:30, 8:45, 9:00" or newline-separated)
  const parseSplits = (text: string): MileSplit[] => {
    if (!text.trim()) return [];
    const parts = text.split(/[,\n]+/).map(s => s.trim()).filter(Boolean);
    return parts.map((pace, i) => ({
      mile: i + 1,
      pace: pace.includes(":") ? pace : `${pace}:00`,
    }));
  };

  const handleLogRun = async () => {
    if (!selectedWorkout) return;
    const pace = calculatePace(logForm.actualMiles, logForm.duration);
    const splits = parseSplits(logForm.splitsText);
    
    const logData = {
      week: selectedWorkout.week,
      day: selectedWorkout.day,
      date: getDateForWorkout(selectedWorkout.week, selectedWorkout.day),
      actualMiles: parseFloat(logForm.actualMiles) || 0,
      duration: logForm.duration,
      pace,
      feeling: logForm.feeling,
      notes: logForm.notes,
      splits: splits.length > 0 ? splits : undefined,
    };

    try {
      const response = await fetch("/api/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logData),
      });

      if (response.ok) {
        const savedLog = await response.json();
        setState((prev) => ({
          ...prev,
          logs: [...prev.logs.filter((l) => !(l.week === logData.week && l.day === logData.day)), savedLog],
        }));
      }
    } catch (error) {
      console.error("Failed to save run:", error);
    }

    setLogDialogOpen(false);
    setLogForm({ actualMiles: "", duration: "", feeling: "good", notes: "", splitsText: "" });
  };

  const handleDeleteLog = async (logId: string) => {
    const log = state.logs.find((l) => l.id === logId);
    if (!log) return;

    try {
      await fetch(`/api/runs?week=${log.week}&day=${log.day}`, {
        method: "DELETE",
      });
      setState((prev) => ({
        ...prev,
        logs: prev.logs.filter((l) => l.id !== logId),
      }));
    } catch (error) {
      console.error("Failed to delete run:", error);
    }
    setLogDialogOpen(false);
  };

  const getPhaseLabel = (week: number) => {
    if (week <= BASE_WEEKS) return "Base";
    return `Wk ${week - BASE_WEEKS}`;
  };

  // Stats (with defensive null checks)
  const logs = state.logs || [];
  const totalPlannedMiles = trainingPlan.reduce((sum, w) => sum + w.miles, 0);
  const totalLoggedMiles = logs.reduce((sum, l) => sum + (l.actualMiles || 0), 0);
  const completedWorkouts = logs.length;
  const totalWorkouts = trainingPlan.filter((w) => w.type !== "rest").length;
  const completionRate = totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0;

  const weeklyMiles = Array.from({ length: TOTAL_WEEKS }, (_, i) => {
    const weekLogs = logs.filter((l) => l.week === i + 1);
    return weekLogs.reduce((sum, l) => sum + (l.actualMiles || 0), 0);
  });

  const weeklyPlannedMiles = Array.from({ length: TOTAL_WEEKS }, (_, i) => {
    return trainingPlan.filter((w) => w.week === i + 1).reduce((sum, w) => sum + w.miles, 0);
  });

  const currentWeekWorkouts = trainingPlan.filter((w) => w.week === selectedWeek);

  const feelingCounts = logs.reduce(
    (acc, log) => {
      if (log.feeling) acc[log.feeling] = (acc[log.feeling] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const today = new Date();
  const daysUntilRace = Math.ceil((RACE_DATE.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading training data...</p>
      </div>
    );
  }

  // Safety check for state
  if (!state || !Array.isArray(state.logs)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Initializing...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground text-sm mb-4 inline-flex items-center gap-1">
            ← Back
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">NYC Marathon Training</h1>
              <p className="text-muted-foreground mt-1">
                {BASE_WEEKS} weeks base → 18 weeks plan → Nov 1, 2026
              </p>
            </div>
            <div className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3">
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">{daysUntilRace}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Days to Race</div>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Miles</CardDescription>
              <CardTitle className="text-2xl tabular-nums">
                {totalLoggedMiles.toFixed(1)}
                <span className="text-base font-normal text-muted-foreground"> / {totalPlannedMiles.toFixed(0)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={(totalLoggedMiles / totalPlannedMiles) * 100} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Workouts</CardDescription>
              <CardTitle className="text-2xl tabular-nums">
                {completedWorkouts}
                <span className="text-base font-normal text-muted-foreground"> / {totalWorkouts}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={completionRate} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>This Week</CardDescription>
              <CardTitle className="text-2xl tabular-nums">
                {weeklyMiles[selectedWeek - 1]?.toFixed(1) || 0}
                <span className="text-base font-normal text-muted-foreground"> / {weeklyPlannedMiles[selectedWeek - 1]} mi</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Week {selectedWeek} of {TOTAL_WEEKS}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Feeling</CardDescription>
              <CardTitle className="text-2xl">
                {Object.entries(feelingCounts)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3)
                  .map(([f]) => feelingConfig[f as keyof typeof feelingConfig]?.emoji)
                  .filter(Boolean)
                  .join(" ") || "—"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {state.logs.length > 0 ? `${state.logs.length} runs logged` : "Log runs to track"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pace Guide */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Target Paces for Sub-4:00</CardTitle>
            <CardDescription>Goal finish: 3:56:XX at 9:00/mi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {(["easy", "long", "tempo", "intervals", "race"] as const).map((type) => {
                const config = runTypes[type];
                return (
                  <div
                    key={type}
                    className={`p-3 rounded-lg border ${config.colorMuted} ${config.borderColor}`}
                  >
                    <div className={`text-sm font-medium ${config.textColor}`}>{config.label}</div>
                    <div className="text-lg font-bold text-foreground">{config.pace.range}/mi</div>
                    <div className="text-xs text-muted-foreground">{config.pace.description}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="strength">💪 Strength</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="log">Run Log</TabsTrigger>
            <TabsTrigger value="coach">🎯 Coach</TabsTrigger>
          </TabsList>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            {/* Week Selector */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
              {Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1).map((week) => {
                const weekLogs = state.logs.filter((l) => l.week === week);
                const weekWorkouts = trainingPlan.filter((w) => w.week === week && w.type !== "rest");
                const isComplete = weekLogs.length >= weekWorkouts.length && weekWorkouts.length > 0;
                const isBase = week <= BASE_WEEKS;
                const isSelected = selectedWeek === week;

                return (
                  <Button
                    key={week}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedWeek(week)}
                    className={`min-w-[48px] px-2 text-xs font-medium ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : isComplete
                          ? "border-emerald-500 text-emerald-500"
                          : ""
                    }`}
                  >
                    {week}
                    {isComplete && !isSelected && " ✓"}
                  </Button>
                );
              })}
            </div>

            {/* Phase Indicator */}
            <div className="flex items-center gap-3">
              <Badge variant={selectedWeek <= BASE_WEEKS ? "secondary" : "default"}>
                {selectedWeek <= BASE_WEEKS ? "Base Building" : `Marathon Week ${selectedWeek - BASE_WEEKS}`}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {selectedWeek <= BASE_WEEKS
                  ? "15 mi/week foundation"
                  : selectedWeek - BASE_WEEKS <= 4
                    ? "Building mileage"
                    : selectedWeek - BASE_WEEKS <= 8
                      ? "Building intensity"
                      : selectedWeek - BASE_WEEKS <= 12
                        ? "Peak training"
                        : selectedWeek - BASE_WEEKS <= 14
                          ? "Final push"
                          : selectedWeek - BASE_WEEKS <= 17
                            ? "Taper time"
                            : "Race week! 🎉"}
              </span>
            </div>

            {/* Week Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Week {selectedWeek}</CardTitle>
                <CardDescription>
                  {getDateForWorkout(selectedWeek, 1)} – {getDateForWorkout(selectedWeek, 7)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentWeekWorkouts.map((workout) => {
                  const log = getLogForWorkout(workout.week, workout.day);
                  const date = getDateForWorkout(workout.week, workout.day);
                  const isToday = date === new Date().toISOString().split("T")[0];
                  const isPast = new Date(date) < new Date(new Date().toISOString().split("T")[0]);
                  const config = runTypes[workout.type];

                  return (
                    <div
                      key={`${workout.week}-${workout.day}`}
                      className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                        isToday
                          ? "border-primary bg-primary/5"
                          : isPast && !log && workout.type !== "rest"
                            ? "border-destructive/30 bg-destructive/5"
                            : "border-border bg-card"
                      }`}
                    >
                      {/* Date */}
                      <div className="text-center w-14 shrink-0">
                        <div className="text-xs text-muted-foreground">{dayNames[workout.day - 1]}</div>
                        <div className="text-sm font-medium">
                          {new Date(date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </div>
                        {isToday && (
                          <Badge variant="default" className="mt-1 text-[10px] px-1.5">
                            Today
                          </Badge>
                        )}
                      </div>

                      {/* Workout Info - Clickable for details */}
                      <button 
                        className="flex-1 min-w-0 text-left group"
                        onClick={() => {
                          if (workout.type !== "rest") {
                            setSelectedWorkout(workout);
                            setRunDetailsOpen(true);
                          }
                        }}
                        disabled={workout.type === "rest"}
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className={`${config.colorMuted} ${config.textColor} ${config.borderColor}`}>
                            {config.label}
                          </Badge>
                          {workout.miles > 0 && (
                            <span className="font-medium">{workout.miles} mi</span>
                          )}
                          {workout.type !== "rest" && (
                            <span className="text-sm text-muted-foreground">@ {config.pace.range}/mi</span>
                          )}
                          {log && <span className="text-emerald-500">✓</span>}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 truncate">{workout.description}</p>
                        {workout.type !== "rest" && (
                          <p className="text-xs text-primary/60 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Click for pace breakdown & routes →
                          </p>
                        )}
                      </button>

                      {/* Logged Stats */}
                      {log && (
                        <div className="text-right shrink-0 hidden sm:block">
                          <div className="font-medium">{log.actualMiles} mi</div>
                          <div className="text-sm text-muted-foreground">
                            {log.pace}/mi {log.feeling && feelingConfig[log.feeling]?.emoji}
                          </div>
                        </div>
                      )}

                      {/* Warm-up Button */}
                      {workout.type !== "rest" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedWorkout(workout);
                            setWarmUpOpen(true);
                          }}
                          className="shrink-0"
                        >
                          🔥 Warm-up
                        </Button>
                      )}

                      {/* Log Button */}
                      {workout.type !== "rest" && (
                        <Dialog
                          open={logDialogOpen && selectedWorkout?.day === workout.day && selectedWorkout?.week === workout.week}
                          onOpenChange={setLogDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant={log ? "outline" : "default"}
                              onClick={() => {
                                setSelectedWorkout(workout);
                                if (log) {
                                  setLogForm({
                                    actualMiles: log.actualMiles.toString(),
                                    duration: log.duration,
                                    feeling: log.feeling,
                                    notes: log.notes,
                                    splitsText: log.splits?.map(s => s.pace).join(", ") || "",
                                  });
                                } else {
                                  setLogForm({
                                    actualMiles: workout.miles.toString(),
                                    duration: "",
                                    feeling: "good",
                                    notes: "",
                                    splitsText: "",
                                  });
                                }
                              }}
                            >
                              {log ? "Edit" : "Log"}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Log Your Run</DialogTitle>
                              <DialogDescription>{workout.description}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Distance (miles)</Label>
                                  <Input
                                    type="number"
                                    step="0.1"
                                    value={logForm.actualMiles}
                                    onChange={(e) => setLogForm((f) => ({ ...f, actualMiles: e.target.value }))}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Duration (mm:ss)</Label>
                                  <Input
                                    placeholder="32:00"
                                    value={logForm.duration}
                                    onChange={(e) => setLogForm((f) => ({ ...f, duration: e.target.value }))}
                                  />
                                </div>
                              </div>
                              {logForm.actualMiles && logForm.duration && (
                                <p className="text-sm text-muted-foreground">
                                  Pace: <span className="font-medium text-foreground">{calculatePace(logForm.actualMiles, logForm.duration)}/mi</span>
                                </p>
                              )}
                              <div className="space-y-2">
                                <Label>How did it feel?</Label>
                                <Select
                                  value={logForm.feeling}
                                  onValueChange={(v) => setLogForm((f) => ({ ...f, feeling: v as RunLog["feeling"] }))}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(feelingConfig).map(([key, { emoji, label }]) => (
                                      <SelectItem key={key} value={key}>
                                        {emoji} {label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Mile Splits (optional)</Label>
                                <Input
                                  placeholder="e.g., 8:30, 8:45, 9:00"
                                  value={logForm.splitsText}
                                  onChange={(e) => setLogForm((f) => ({ ...f, splitsText: e.target.value }))}
                                />
                                <p className="text-xs text-muted-foreground">
                                  Enter pace for each mile, separated by commas
                                </p>
                              </div>
                              <div className="space-y-2">
                                <Label>Notes</Label>
                                <Textarea
                                  placeholder="How was the run?"
                                  value={logForm.notes}
                                  onChange={(e) => setLogForm((f) => ({ ...f, notes: e.target.value }))}
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={handleLogRun} className="flex-1">
                                  Save Run
                                </Button>
                                {log && (
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleDeleteLog(log.id)}
                                  >
                                    Delete
                                  </Button>
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Strength Tab */}
          <TabsContent value="strength" className="space-y-6">
            {/* Weekly Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Strength Schedule</CardTitle>
                <CardDescription>Aligned with your running — never lift heavy before quality runs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 text-center text-sm">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
                    const schedule = [
                      { run: "Easy", lift: "Lower A", liftTime: "PM" },
                      { run: "Rest", lift: "Upper B", liftTime: "Any" },
                      { run: "Quality", lift: "—", liftTime: "" },
                      { run: "Easy", lift: "Optional", liftTime: "PM" },
                      { run: "Rest", lift: "—", liftTime: "" },
                      { run: "Long", lift: "—", liftTime: "" },
                      { run: "Rest", lift: "—", liftTime: "" },
                    ][i];
                    const hasLift = schedule.lift !== "—";
                    return (
                      <div key={day} className={`p-3 rounded-lg border ${hasLift ? "border-amber-500/30 bg-amber-500/5" : "border-border"}`}>
                        <div className="font-medium">{day}</div>
                        <div className="text-xs text-muted-foreground mt-1">{schedule.run}</div>
                        {hasLift && (
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-500 border-amber-500/30">
                              {schedule.lift}
                            </Badge>
                            {schedule.liftTime && (
                              <div className="text-[10px] text-muted-foreground mt-1">{schedule.liftTime}</div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  💡 Strength after easy runs only • 6+ hours apart if same day • Never before long run
                </p>
              </CardContent>
            </Card>

            {/* Session A: Lower Power */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">A</span>
                  Lower Power
                </CardTitle>
                <CardDescription>30-40 min • Heavy compound movements for running power</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { 
                    name: "Barbell Back Squat", 
                    sets: "4 × 5", 
                    notes: "Heavy (RPE 8), full depth, explosive up",
                    muscles: "Quads, Glutes, Core",
                    video: "https://www.youtube.com/results?search_query=barbell+back+squat+form",
                    icon: "🏋️"
                  },
                  { 
                    name: "Romanian Deadlift", 
                    sets: "3 × 8", 
                    notes: "Hinge at hips, feel hamstrings stretch",
                    muscles: "Hamstrings, Glutes, Lower Back",
                    video: "https://www.youtube.com/results?search_query=romanian+deadlift+form",
                    icon: "🔻"
                  },
                  { 
                    name: "Bulgarian Split Squat", 
                    sets: "3 × 8 each", 
                    notes: "Rear foot elevated, DB in each hand",
                    muscles: "Quads, Glutes, Balance",
                    video: "https://www.youtube.com/results?search_query=bulgarian+split+squat+form",
                    icon: "🦵"
                  },
                  { 
                    name: "Single-Leg Hip Thrust", 
                    sets: "3 × 10 each", 
                    notes: "Back on bench, squeeze glute at top",
                    muscles: "Glute Max (top exercise for runners)",
                    video: "https://www.youtube.com/results?search_query=single+leg+hip+thrust+form",
                    icon: "🍑"
                  },
                  { 
                    name: "Calf Raises", 
                    sets: "3 × 15", 
                    notes: "Slow, full ROM, pause at top 2 sec",
                    muscles: "Calves, Achilles",
                    video: "https://www.youtube.com/results?search_query=standing+calf+raise+form",
                    icon: "⬆️"
                  },
                ].map((exercise, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center text-2xl shrink-0">
                      {exercise.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{exercise.name}</span>
                        <Badge variant="secondary" className="font-mono text-xs">{exercise.sets}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{exercise.notes}</p>
                      <p className="text-xs text-primary/60 mt-1">{exercise.muscles}</p>
                    </div>
                    <a
                      href={exercise.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                    >
                      📹 Demo
                    </a>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Session B: Upper + Core */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-500 flex items-center justify-center font-bold">B</span>
                  Upper + Core
                </CardTitle>
                <CardDescription>25-35 min • Posture, arm drive, and running stability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { 
                    name: "Cable Row", 
                    sets: "3 × 10", 
                    notes: "Squeeze shoulder blades, control the negative",
                    muscles: "Upper Back, Posture",
                    video: "https://www.youtube.com/results?search_query=seated+cable+row+form",
                    icon: "🚣"
                  },
                  { 
                    name: "Dumbbell Bench Press", 
                    sets: "3 × 10", 
                    notes: "Full range of motion, don't bounce",
                    muscles: "Chest, Triceps, Arm Drive",
                    video: "https://www.youtube.com/results?search_query=dumbbell+bench+press+form",
                    icon: "💪"
                  },
                  { 
                    name: "Lat Pulldown", 
                    sets: "3 × 10", 
                    notes: "Wide grip, pull to chest, lean slightly back",
                    muscles: "Lats, Back Width",
                    video: "https://www.youtube.com/results?search_query=lat+pulldown+form",
                    icon: "⬇️"
                  },
                  { 
                    name: "Pallof Press", 
                    sets: "3 × 10 each", 
                    notes: "Cable at chest height, resist rotation",
                    muscles: "Core Anti-Rotation (key for running)",
                    video: "https://www.youtube.com/results?search_query=pallof+press+form",
                    icon: "🎯"
                  },
                  { 
                    name: "Side Plank", 
                    sets: "3 × 30 sec each", 
                    notes: "Hips stacked, don't let hips sag",
                    muscles: "Glute Med, Obliques, Hip Stability",
                    video: "https://www.youtube.com/results?search_query=side+plank+form",
                    icon: "📐"
                  },
                  { 
                    name: "Dead Bug", 
                    sets: "3 × 10 each", 
                    notes: "Lower back pressed to floor throughout",
                    muscles: "Deep Core Stability",
                    video: "https://www.youtube.com/results?search_query=dead+bug+exercise+form",
                    icon: "🐛"
                  },
                ].map((exercise, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-sky-500/10 flex items-center justify-center text-2xl shrink-0">
                      {exercise.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{exercise.name}</span>
                        <Badge variant="secondary" className="font-mono text-xs">{exercise.sets}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{exercise.notes}</p>
                      <p className="text-xs text-primary/60 mt-1">{exercise.muscles}</p>
                    </div>
                    <a
                      href={exercise.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                    >
                      📹 Demo
                    </a>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Phase Guide */}
            <Card>
              <CardHeader>
                <CardTitle>📊 Periodization</CardTitle>
                <CardDescription>How strength training changes through your marathon journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      phase: "Base Building", 
                      dates: "Now → June", 
                      freq: "3x/week",
                      focus: "Build strength — progressive overload",
                      color: "emerald"
                    },
                    { 
                      phase: "Marathon Build", 
                      dates: "July → Sept", 
                      freq: "2x/week",
                      focus: "Maintain — same weight, 3 sets",
                      color: "amber"
                    },
                    { 
                      phase: "Peak Training", 
                      dates: "Oct 1-14", 
                      freq: "2x/week",
                      focus: "Reduce — 80% weight, 2 sets",
                      color: "sky"
                    },
                    { 
                      phase: "Taper", 
                      dates: "Oct 15-26", 
                      freq: "1x/week",
                      focus: "Activation only — stop 5 days before race",
                      color: "purple"
                    },
                  ].map((p, i) => (
                    <div 
                      key={i} 
                      className={`p-4 rounded-lg border bg-${p.color}-500/5 border-${p.color}-500/30`}
                      style={{
                        backgroundColor: p.color === "emerald" ? "rgba(16, 185, 129, 0.05)" :
                                        p.color === "amber" ? "rgba(245, 158, 11, 0.05)" :
                                        p.color === "sky" ? "rgba(14, 165, 233, 0.05)" :
                                        "rgba(168, 85, 247, 0.05)",
                        borderColor: p.color === "emerald" ? "rgba(16, 185, 129, 0.3)" :
                                    p.color === "amber" ? "rgba(245, 158, 11, 0.3)" :
                                    p.color === "sky" ? "rgba(14, 165, 233, 0.3)" :
                                    "rgba(168, 85, 247, 0.3)"
                      }}
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <span className="font-medium">{p.phase}</span>
                          <span className="text-sm text-muted-foreground ml-2">({p.dates})</span>
                        </div>
                        <Badge variant="outline">{p.freq}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{p.focus}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Research Callout */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-base">🔬 Why This Works</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p><strong>Støren et al. (2008):</strong> Heavy squats (4×4) improved running economy by 5% and time to exhaustion by 21%.</p>
                <p><strong>Collings et al. (2023):</strong> Single-leg RDL and hip thrusts produce the highest glute forces — critical for injury prevention.</p>
                <p><strong>Key insight:</strong> It&apos;s not about getting huge. It&apos;s about force production speed — recruiting muscle faster so each stride is more efficient.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Mileage</CardTitle>
                <CardDescription>Actual vs planned miles per week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-0.5 h-48 overflow-x-auto pb-2">
                  {weeklyMiles.map((miles, i) => {
                    const planned = weeklyPlannedMiles[i];
                    const maxMiles = 55;
                    const height = Math.max(2, (miles / maxMiles) * 100);
                    const plannedHeight = (planned / maxMiles) * 100;
                    const isBase = i < BASE_WEEKS;
                    const hitTarget = miles >= planned;

                    return (
                      <div key={i} className="flex flex-col items-center gap-1 min-w-[14px]" title={`Week ${i + 1}: ${miles}/${planned} mi`}>
                        <div className="relative w-full h-40 flex items-end">
                          <div
                            className="absolute bottom-0 w-full bg-muted rounded-t"
                            style={{ height: `${plannedHeight}%` }}
                          />
                          <div
                            className={`relative w-full rounded-t transition-all ${
                              hitTarget
                                ? isBase
                                  ? "bg-emerald-500"
                                  : "bg-primary"
                                : isBase
                                  ? "bg-emerald-500/50"
                                  : "bg-primary/50"
                            }`}
                            style={{ height: `${height}%` }}
                          />
                        </div>
                        {(i + 1) % 5 === 0 && <span className="text-[10px] text-muted-foreground">{i + 1}</span>}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center gap-6 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded" />
                    <span className="text-muted-foreground">Base</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded" />
                    <span className="text-muted-foreground">Marathon</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-muted rounded" />
                    <span className="text-muted-foreground">Planned</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pace Trend</CardTitle>
                  <CardDescription>Recent run paces</CardDescription>
                </CardHeader>
                <CardContent>
                  {state.logs.filter((l) => l.pace).length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Log runs to see pace trend</p>
                  ) : (
                    <div className="space-y-3">
                      {state.logs
                        .filter((l) => l.pace)
                        .slice(-8)
                        .map((log) => {
                          const paceNum = parseInt(log.pace);
                          const width = Math.max(10, Math.min(100, (12 - paceNum) * 15));
                          return (
                            <div key={log.id} className="flex items-center gap-3">
                              <span className="text-xs text-muted-foreground w-12">W{log.week}D{log.day}</span>
                              <div className="flex-1 h-2 bg-muted rounded overflow-hidden">
                                <div className="h-full bg-primary rounded" style={{ width: `${width}%` }} />
                              </div>
                              <span className="font-mono text-sm w-16 text-right">{log.pace}/mi</span>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How Runs Feel</CardTitle>
                  <CardDescription>Feeling distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(Object.keys(feelingConfig) as Array<keyof typeof feelingConfig>).map((feeling) => {
                      const count = feelingCounts[feeling] || 0;
                      const pct = state.logs.length > 0 ? (count / state.logs.length) * 100 : 0;
                      return (
                        <div key={feeling} className="flex items-center gap-3">
                          <span className="text-xl w-8">{feelingConfig[feeling].emoji}</span>
                          <div className="flex-1 h-3 bg-muted rounded overflow-hidden">
                            <div className="h-full bg-primary rounded" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-sm text-muted-foreground w-8 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Log Tab */}
          <TabsContent value="log">
            <Card>
              <CardHeader>
                <CardTitle>Run History</CardTitle>
                <CardDescription>All logged runs</CardDescription>
              </CardHeader>
              <CardContent>
                {state.logs.length === 0 ? (
                  <p className="text-muted-foreground text-center py-12">No runs logged yet. Get out there! 🏃</p>
                ) : (
                  <div className="space-y-3">
                    {[...state.logs]
                      .sort((a, b) => (a.week !== b.week ? b.week - a.week : b.day - a.day))
                      .map((log) => (
                        <div
                          key={log.id}
                          className="p-4 rounded-lg border border-border space-y-3"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Week {log.week}, Day {log.day}</span>
                                <Badge variant="outline" className={log.week <= BASE_WEEKS ? "border-emerald-500/30 text-emerald-500" : ""}>
                                  {log.week <= BASE_WEEKS ? "Base" : "Marathon"}
                                </Badge>
                                {log.feeling && feelingConfig[log.feeling] && (
                                  <span className="text-lg">{feelingConfig[log.feeling].emoji}</span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{log.date}</p>
                              {log.notes && <p className="text-sm text-muted-foreground">{log.notes}</p>}
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{log.actualMiles} mi</div>
                              <div className="text-sm text-muted-foreground">{log.duration} • {log.pace}/mi</div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteLog(log.id)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              ✕
                            </Button>
                          </div>
                          
                          {/* Mile Splits */}
                          {log.splits && log.splits.length > 0 && (
                            <div className="pt-2 border-t border-border">
                              <p className="text-xs text-muted-foreground mb-2">Mile Splits</p>
                              <div className="flex flex-wrap gap-2">
                                {(log.splits as MileSplit[]).map((split, i) => (
                                  <Badge key={i} variant="secondary" className="font-mono text-xs">
                                    M{split.mile}: {split.pace}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Coaching Feedback */}
                          {log.coachingFeedback && (
                            <div className="pt-2 border-t border-border">
                              <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                                <span className="text-lg">🎯</span>
                                <div>
                                  <p className="text-xs font-medium text-primary mb-1">Coach&apos;s Notes</p>
                                  <p className="text-sm">{log.coachingFeedback}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Coach Tab */}
          <TabsContent value="coach" className="space-y-6">
            {/* Current Phase Guidance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🎯 Your Training Focus
                </CardTitle>
                <CardDescription>
                  {selectedWeek <= BASE_WEEKS
                    ? "Base Building Phase"
                    : selectedWeek - BASE_WEEKS <= 4
                      ? "Building Mileage Phase"
                      : selectedWeek - BASE_WEEKS <= 8
                        ? "Building Intensity Phase"
                        : selectedWeek - BASE_WEEKS <= 12
                          ? "Peak Training Phase"
                          : selectedWeek - BASE_WEEKS <= 14
                            ? "Final Push Phase"
                            : selectedWeek - BASE_WEEKS <= 17
                              ? "Taper Phase"
                              : "Race Week"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Phase-specific tips */}
                  {(() => {
                    const weekNum = selectedWeek - BASE_WEEKS;
                    const isBase = selectedWeek <= BASE_WEEKS;
                    
                    const phaseTips = isBase ? {
                      title: "Base Building",
                      focus: "Build aerobic foundation without injury",
                      tips: [
                        "Keep all runs at conversational pace - you should be able to talk comfortably",
                        "Focus on consistency over speed - showing up matters most right now",
                        "Build the habit: same days, same times each week",
                        "Listen to your body - slight fatigue is normal, pain is not",
                        "Hydrate well and prioritize 7-8 hours of sleep",
                      ],
                      keyWorkout: "Weekend long run - build endurance gradually",
                    } : weekNum <= 4 ? {
                      title: "Building Mileage",
                      focus: "Gradually increase weekly volume",
                      tips: [
                        "Don't increase weekly mileage by more than 10%",
                        "Most runs should still feel easy and controlled",
                        "Long runs are your most important workout",
                        "Take recovery seriously - easy days should be truly easy",
                        "Start thinking about race nutrition - practice on long runs",
                      ],
                      keyWorkout: "Long run with negative splits (second half slightly faster)",
                    } : weekNum <= 8 ? {
                      title: "Building Intensity",
                      focus: "Add speed work while maintaining mileage",
                      tips: [
                        "Tempo runs teach your body to sustain effort",
                        "Intervals build speed and mental toughness",
                        "Recovery between hard workouts is crucial",
                        "Don't race your workouts - save it for race day",
                        "Practice your race pace during some long run portions",
                      ],
                      keyWorkout: "Tempo runs at 8:00/mi - comfortably hard effort",
                    } : weekNum <= 12 ? {
                      title: "Peak Training",
                      focus: "Maximum stress before taper",
                      tips: [
                        "Your 20-milers are the pinnacle - respect the distance",
                        "Mental toughness is built in these weeks",
                        "Trust your training - don't add extra work",
                        "Dial in your race nutrition strategy",
                        "Start visualizing race day success",
                      ],
                      keyWorkout: "20-mile long runs at goal marathon pace",
                    } : weekNum <= 14 ? {
                      title: "Final Push",
                      focus: "Last hard efforts before taper",
                      tips: [
                        "One more 20-miler to cement your fitness",
                        "Keep intensity but start reducing volume",
                        "Any fitness gained now won't help race day",
                        "Focus on recovery and staying healthy",
                        "Plan your race logistics (travel, gear, nutrition)",
                      ],
                      keyWorkout: "Final 20-miler with race pace segments",
                    } : weekNum <= 17 ? {
                      title: "Taper Time",
                      focus: "Rest and recover while maintaining sharpness",
                      tips: [
                        "Reduced mileage is NOT losing fitness",
                        "Phantom pains are normal - trust your body",
                        "Keep some intensity to stay sharp",
                        "Focus on sleep, nutrition, and hydration",
                        "Mental prep is as important as physical",
                        "Review your race plan and pacing strategy",
                      ],
                      keyWorkout: "Short, controlled runs with a few strides",
                    } : {
                      title: "Race Week",
                      focus: "Stay calm, trust your training",
                      tips: [
                        "No new foods, gear, or routines",
                        "Light shakeout runs only",
                        "Carb-load the day before (not the night before!)",
                        "Lay out everything the night before",
                        "Start conservative - first 10K should feel easy",
                        "YOU'VE GOT THIS! 🏃‍♂️",
                      ],
                      keyWorkout: "Race day: NYC Marathon! 🗽",
                    };

                    return (
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-muted/30 border border-border">
                          <h3 className="font-semibold mb-1">🎯 Current Focus</h3>
                          <p className="text-sm text-muted-foreground">{phaseTips.focus}</p>
                        </div>

                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                          <h3 className="font-semibold mb-1">⭐ Key Workout</h3>
                          <p className="text-sm">{phaseTips.keyWorkout}</p>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-2">📝 This Phase</h3>
                          <ul className="space-y-2">
                            {phaseTips.tips.map((tip, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="text-primary mt-0.5">•</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>

            {/* Recent Performance */}
            <Card>
              <CardHeader>
                <CardTitle>📊 Recent Performance</CardTitle>
                <CardDescription>How your recent runs stack up</CardDescription>
              </CardHeader>
              <CardContent>
                {state.logs.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Log some runs to see performance insights!</p>
                ) : (
                  <div className="space-y-4">
                    {/* Recent runs with splits analysis */}
                    {state.logs
                      .filter(l => l.splits && (l.splits as MileSplit[]).length > 0)
                      .slice(0, 3)
                      .map(log => {
                        const splits = log.splits as MileSplit[];
                        const paces = splits.map(s => {
                          const [m, sec] = s.pace.split(":").map(Number);
                          return m * 60 + (sec || 0);
                        });
                        const avgPace = paces.reduce((a, b) => a + b, 0) / paces.length;
                        const firstHalf = paces.slice(0, Math.floor(paces.length / 2));
                        const secondHalf = paces.slice(Math.floor(paces.length / 2));
                        const firstAvg = firstHalf.length > 0 ? firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length : 0;
                        const secondAvg = secondHalf.length > 0 ? secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length : 0;
                        const isNegativeSplit = secondAvg < firstAvg;
                        
                        return (
                          <div key={log.id} className="p-4 rounded-lg border border-border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Week {log.week}, Day {log.day}</span>
                              <Badge variant={isNegativeSplit ? "default" : "secondary"}>
                                {isNegativeSplit ? "🔥 Negative Split" : "Positive Split"}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {splits.map((split, i) => {
                                const [m, sec] = split.pace.split(":").map(Number);
                                const paceInSecs = m * 60 + (sec || 0);
                                const diff = paceInSecs - avgPace;
                                return (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className={`font-mono text-xs ${
                                      diff < -5 ? "border-emerald-500 text-emerald-500" :
                                      diff > 5 ? "border-amber-500 text-amber-500" : ""
                                    }`}
                                  >
                                    {split.pace}
                                  </Badge>
                                );
                              })}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Avg pace: {Math.floor(avgPace / 60)}:{String(Math.round(avgPace % 60)).padStart(2, "0")}/mi
                            </p>
                          </div>
                        );
                      })}
                    
                    {state.logs.filter(l => l.splits && (l.splits as MileSplit[]).length > 0).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Add mile splits to your runs for detailed analysis! 📊
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Coaching Feedback Section */}
            <Card>
              <CardHeader>
                <CardTitle>💬 Coach&apos;s Feedback</CardTitle>
                <CardDescription>Agent Drew&apos;s notes on your runs</CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const runsWithFeedback = state.logs.filter(l => l.coachingFeedback);
                  
                  if (runsWithFeedback.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-2">No coaching feedback yet</p>
                        <p className="text-sm text-muted-foreground">
                          Log runs with mile splits and I&apos;ll provide personalized feedback! 🎯
                        </p>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="space-y-3">
                      {runsWithFeedback.slice(0, 5).map(log => (
                        <div key={log.id} className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-sm">Week {log.week}, Day {log.day}</span>
                            <span className="text-xs text-muted-foreground">• {log.actualMiles} mi @ {log.pace}/mi</span>
                          </div>
                          <p className="text-sm">{log.coachingFeedback}</p>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Run Details Modal */}
        <Dialog open={runDetailsOpen} onOpenChange={setRunDetailsOpen}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            {selectedWorkout && selectedWorkout.type !== "rest" && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`${runTypes[selectedWorkout.type].colorMuted} ${runTypes[selectedWorkout.type].textColor} ${runTypes[selectedWorkout.type].borderColor}`}
                    >
                      {runTypes[selectedWorkout.type].label}
                    </Badge>
                    <span>{selectedWorkout.miles} miles</span>
                  </DialogTitle>
                  <DialogDescription>{selectedWorkout.description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  {/* Target Pace */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Target Pace</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">{runTypes[selectedWorkout.type].pace.target}</span>
                      <span className="text-muted-foreground">/mile</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Range: {runTypes[selectedWorkout.type].pace.range}/mi • {runTypes[selectedWorkout.type].pace.description}
                    </p>
                  </div>

                  {/* Mile Splits */}
                  <div>
                    <h3 className="font-semibold mb-3">Mile-by-Mile Breakdown</h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 text-xs text-muted-foreground font-medium px-2">
                        <span>Mile</span>
                        <span className="text-center">Pace</span>
                        <span className="text-right">Cumulative</span>
                      </div>
                      {generateMileSplits(selectedWorkout.miles, selectedWorkout.type).map((split, i) => (
                        <div 
                          key={i} 
                          className="grid grid-cols-3 text-sm p-2 rounded bg-muted/30"
                        >
                          <span className="font-medium">
                            {split.mile === Math.ceil(selectedWorkout.miles) && selectedWorkout.miles % 1 !== 0
                              ? `${(selectedWorkout.miles % 1).toFixed(2)} mi`
                              : `Mile ${split.mile}`}
                          </span>
                          <span className="text-center font-mono">{split.pace}</span>
                          <span className="text-right font-mono text-muted-foreground">{split.cumulative}</span>
                        </div>
                      ))}
                      <div className="grid grid-cols-3 text-sm p-2 rounded bg-primary/10 font-medium">
                        <span>Total</span>
                        <span className="text-center">{selectedWorkout.miles} mi</span>
                        <span className="text-right font-mono">
                          {generateMileSplits(selectedWorkout.miles, selectedWorkout.type).slice(-1)[0]?.cumulative || "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Route */}
                  <div>
                    <h3 className="font-semibold mb-3">🗺️ Route</h3>
                    
                    <div className="p-4 rounded-lg bg-muted/30 border border-border">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                          🌉
                        </div>
                        <div>
                          <p className="font-medium">Queensboro Bridge Out & Back</p>
                          <p className="text-sm text-muted-foreground">
                            Head toward the bridge • {(selectedWorkout.miles / 2).toFixed(1)} mi out → turn around
                          </p>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          // Queensboro Bridge coordinates
                          const bridgeLat = 40.7570;
                          const bridgeLng = -73.9545;
                          
                          if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                              (pos) => {
                                const { latitude, longitude } = pos.coords;
                                window.open(
                                  `https://www.google.com/maps/dir/${latitude},${longitude}/${bridgeLat},${bridgeLng}/@${latitude},${longitude},14z/data=!4m2!4m1!3e2`,
                                  "_blank"
                                );
                              },
                              () => {
                                // Fallback to home → bridge
                                window.open(
                                  `https://www.google.com/maps/dir/40.7433,-73.9575/${bridgeLat},${bridgeLng}/@40.7433,-73.9575,14z/data=!4m2!4m1!3e2`,
                                  "_blank"
                                );
                              }
                            );
                          } else {
                            window.open(
                              `https://www.google.com/maps/dir/40.7433,-73.9575/${bridgeLat},${bridgeLng}/@40.7433,-73.9575,14z/data=!4m2!4m1!3e2`,
                              "_blank"
                            );
                          }
                        }}
                      >
                        🗺️ Open Route to Bridge
                      </Button>
                    </div>
                  </div>

                  {/* Log Run Button */}
                  <Button
                    className="w-full"
                    onClick={() => {
                      setRunDetailsOpen(false);
                      setLogDialogOpen(true);
                    }}
                  >
                    Log This Run
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Warm-up Modal */}
        <Dialog open={warmUpOpen} onOpenChange={setWarmUpOpen}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            {selectedWorkout && selectedWorkout.type !== "rest" && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    🔥 {getWarmUp(selectedWorkout.type).title}
                  </DialogTitle>
                  <DialogDescription>
                    Complete before your {selectedWorkout.miles} mile {runTypes[selectedWorkout.type].label.toLowerCase()} run
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 mt-4">
                  {getWarmUp(selectedWorkout.type).exercises.map((exercise, i) => (
                    <div 
                      key={i}
                      className="flex items-center gap-4 p-3 rounded-lg border border-border bg-card"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{exercise.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {exercise.duration || exercise.reps}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{exercise.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 rounded-lg bg-muted/50 text-sm">
                  <p className="font-medium mb-1">💡 Pro Tips:</p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Start slow, increase intensity gradually</li>
                    <li>• Focus on controlled movements, not speed</li>
                    <li>• If anything feels tight, add extra time there</li>
                  </ul>
                </div>

                <Button 
                  className="w-full mt-4"
                  onClick={() => setWarmUpOpen(false)}
                >
                  Ready to Run! 🏃
                </Button>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Wrap with error boundary for better error display
export default function MarathonTracker() {
  return (
    <ErrorBoundary>
      <MarathonTrackerInner />
    </ErrorBoundary>
  );
}
