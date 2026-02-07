"use client";

import { useState, useEffect } from "react";
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

// 18-week marathon training plan
const trainingPlan = [
  // Week 1 - Base Building
  { week: 1, day: 1, type: "easy", miles: 3, description: "Easy run - conversational pace" },
  { week: 1, day: 2, type: "rest", miles: 0, description: "Rest or cross-train" },
  { week: 1, day: 3, type: "easy", miles: 4, description: "Easy run" },
  { week: 1, day: 4, type: "easy", miles: 3, description: "Easy run" },
  { week: 1, day: 5, type: "rest", miles: 0, description: "Rest" },
  { week: 1, day: 6, type: "long", miles: 6, description: "Long run - slow and steady" },
  { week: 1, day: 7, type: "rest", miles: 0, description: "Rest" },
  // Week 2
  { week: 2, day: 1, type: "easy", miles: 3, description: "Easy run" },
  { week: 2, day: 2, type: "tempo", miles: 4, description: "Tempo run - comfortably hard" },
  { week: 2, day: 3, type: "easy", miles: 3, description: "Easy run" },
  { week: 2, day: 4, type: "rest", miles: 0, description: "Rest or cross-train" },
  { week: 2, day: 5, type: "easy", miles: 4, description: "Easy run" },
  { week: 2, day: 6, type: "long", miles: 8, description: "Long run" },
  { week: 2, day: 7, type: "rest", miles: 0, description: "Rest" },
  // Week 3
  { week: 3, day: 1, type: "easy", miles: 4, description: "Easy run" },
  { week: 3, day: 2, type: "intervals", miles: 5, description: "Intervals: 6x800m with 400m recovery" },
  { week: 3, day: 3, type: "easy", miles: 3, description: "Easy recovery run" },
  { week: 3, day: 4, type: "rest", miles: 0, description: "Rest" },
  { week: 3, day: 5, type: "tempo", miles: 5, description: "Tempo run" },
  { week: 3, day: 6, type: "long", miles: 10, description: "Long run" },
  { week: 3, day: 7, type: "rest", miles: 0, description: "Rest" },
  // Week 4 - Recovery
  { week: 4, day: 1, type: "easy", miles: 3, description: "Easy run" },
  { week: 4, day: 2, type: "easy", miles: 4, description: "Easy run" },
  { week: 4, day: 3, type: "rest", miles: 0, description: "Rest" },
  { week: 4, day: 4, type: "easy", miles: 3, description: "Easy run" },
  { week: 4, day: 5, type: "rest", miles: 0, description: "Rest" },
  { week: 4, day: 6, type: "long", miles: 6, description: "Easy long run" },
  { week: 4, day: 7, type: "rest", miles: 0, description: "Rest" },
  // Week 5
  { week: 5, day: 1, type: "easy", miles: 4, description: "Easy run" },
  { week: 5, day: 2, type: "intervals", miles: 6, description: "Intervals: 8x800m" },
  { week: 5, day: 3, type: "easy", miles: 4, description: "Easy run" },
  { week: 5, day: 4, type: "rest", miles: 0, description: "Rest" },
  { week: 5, day: 5, type: "tempo", miles: 5, description: "Tempo run" },
  { week: 5, day: 6, type: "long", miles: 12, description: "Long run" },
  { week: 5, day: 7, type: "rest", miles: 0, description: "Rest" },
  // Week 6
  { week: 6, day: 1, type: "easy", miles: 4, description: "Easy run" },
  { week: 6, day: 2, type: "tempo", miles: 6, description: "Tempo run" },
  { week: 6, day: 3, type: "easy", miles: 4, description: "Easy run" },
  { week: 6, day: 4, type: "rest", miles: 0, description: "Rest" },
  { week: 6, day: 5, type: "intervals", miles: 5, description: "Hill repeats: 8x90sec" },
  { week: 6, day: 6, type: "long", miles: 14, description: "Long run" },
  { week: 6, day: 7, type: "rest", miles: 0, description: "Rest" },
  // Week 7
  { week: 7, day: 1, type: "easy", miles: 5, description: "Easy run" },
  { week: 7, day: 2, type: "intervals", miles: 7, description: "Intervals: 5x1mile" },
  { week: 7, day: 3, type: "easy", miles: 4, description: "Easy run" },
  { week: 7, day: 4, type: "rest", miles: 0, description: "Rest" },
  { week: 7, day: 5, type: "tempo", miles: 6, description: "Tempo run" },
  { week: 7, day: 6, type: "long", miles: 16, description: "Long run" },
  { week: 7, day: 7, type: "rest", miles: 0, description: "Rest" },
  // Week 8 - Recovery
  { week: 8, day: 1, type: "easy", miles: 4, description: "Easy run" },
  { week: 8, day: 2, type: "easy", miles: 5, description: "Easy run" },
  { week: 8, day: 3, type: "rest", miles: 0, description: "Rest" },
  { week: 8, day: 4, type: "easy", miles: 4, description: "Easy run" },
  { week: 8, day: 5, type: "rest", miles: 0, description: "Rest" },
  { week: 8, day: 6, type: "long", miles: 10, description: "Easy long run" },
  { week: 8, day: 7, type: "rest", miles: 0, description: "Rest" },
  // Week 9
  { week: 9, day: 1, type: "easy", miles: 5, description: "Easy run" },
  { week: 9, day: 2, type: "tempo", miles: 7, description: "Tempo run" },
  { week: 9, day: 3, type: "easy", miles: 4, description: "Easy run" },
  { week: 9, day: 4, type: "rest", miles: 0, description: "Rest" },
  { week: 9, day: 5, type: "intervals", miles: 6, description: "Intervals: 10x800m" },
  { week: 9, day: 6, type: "long", miles: 18, description: "Long run" },
  { week: 9, day: 7, type: "rest", miles: 0, description: "Rest" },
  // Week 10
  { week: 10, day: 1, type: "easy", miles: 5, description: "Easy run" },
  { week: 10, day: 2, type: "intervals", miles: 8, description: "Intervals: 6x1mile" },
  { week: 10, day: 3, type: "easy", miles: 5, description: "Easy run" },
  { week: 10, day: 4, type: "rest", miles: 0, description: "Rest" },
  { week: 10, day: 5, type: "tempo", miles: 6, description: "Tempo run" },
  { week: 10, day: 6, type: "long", miles: 15, description: "Long run" },
  { week: 10, day: 7, type: "rest", miles: 0, description: "Rest" },
  // Week 11
  { week: 11, day: 1, type: "easy", miles: 5, description: "Easy run" },
  { week: 11, day: 2, type: "tempo", miles: 8, description: "Tempo run" },
  { week: 11, day: 3, type: "easy", miles: 5, description: "Easy run" },
  { week: 11, day: 4, type: "rest", miles: 0, description: "Rest" },
  { week: 11, day: 5, type: "intervals", miles: 6, description: "Hill repeats" },
  { week: 11, day: 6, type: "long", miles: 20, description: "Long run - biggest of training!" },
  { week: 11, day: 7, type: "rest", miles: 0, description: "Rest" },
  // Week 12 - Recovery
  { week: 12, day: 1, type: "easy", miles: 4, description: "Easy run" },
  { week: 12, day: 2, type: "easy", miles: 5, description: "Easy run" },
  { week: 12, day: 3, type: "rest", miles: 0, description: "Rest" },
  { week: 12, day: 4, type: "easy", miles: 4, description: "Easy run" },
  { week: 12, day: 5, type: "rest", miles: 0, description: "Rest" },
  { week: 12, day: 6, type: "long", miles: 12, description: "Easy long run" },
  { week: 12, day: 7, type: "rest", miles: 0, description: "Rest" },
  // Week 13
  { week: 13, day: 1, type: "easy", miles: 5, description: "Easy run" },
  { week: 13, day: 2, type: "intervals", miles: 7, description: "Intervals: 8x1000m" },
  { week: 13, day: 3, type: "easy", miles: 5, description: "Easy run" },
  { week: 13, day: 4, type: "rest", miles: 0, description: "Rest" },
  { week: 13, day: 5, type: "tempo", miles: 7, description: "Tempo run" },
  { week: 13, day: 6, type: "long", miles: 18, description: "Long run" },
  { week: 13, day: 7, type: "rest", miles: 0, description: "Rest" },
  // Week 14
  { week: 14, day: 1, type: "easy", miles: 5, description: "Easy run" },
  { week: 14, day: 2, type: "tempo", miles: 8, description: "Tempo run" },
  { week: 14, day: 3, type: "easy", miles: 5, description: "Easy run" },
  { week: 14, day: 4, type: "rest", miles: 0, description: "Rest" },
  { week: 14, day: 5, type: "intervals", miles: 6, description: "Race pace intervals" },
  { week: 14, day: 6, type: "long", miles: 20, description: "Final 20-miler" },
  { week: 14, day: 7, type: "rest", miles: 0, description: "Rest" },
  // Week 15 - Taper begins
  { week: 15, day: 1, type: "easy", miles: 5, description: "Easy run" },
  { week: 15, day: 2, type: "tempo", miles: 6, description: "Tempo run" },
  { week: 15, day: 3, type: "easy", miles: 4, description: "Easy run" },
  { week: 15, day: 4, type: "rest", miles: 0, description: "Rest" },
  { week: 15, day: 5, type: "easy", miles: 5, description: "Easy run" },
  { week: 15, day: 6, type: "long", miles: 14, description: "Long run - tapering down" },
  { week: 15, day: 7, type: "rest", miles: 0, description: "Rest" },
  // Week 16
  { week: 16, day: 1, type: "easy", miles: 4, description: "Easy run" },
  { week: 16, day: 2, type: "tempo", miles: 5, description: "Short tempo" },
  { week: 16, day: 3, type: "easy", miles: 4, description: "Easy run" },
  { week: 16, day: 4, type: "rest", miles: 0, description: "Rest" },
  { week: 16, day: 5, type: "easy", miles: 4, description: "Easy run" },
  { week: 16, day: 6, type: "long", miles: 10, description: "Long run" },
  { week: 16, day: 7, type: "rest", miles: 0, description: "Rest" },
  // Week 17
  { week: 17, day: 1, type: "easy", miles: 4, description: "Easy run" },
  { week: 17, day: 2, type: "tempo", miles: 4, description: "Short tempo - stay sharp" },
  { week: 17, day: 3, type: "easy", miles: 3, description: "Easy run" },
  { week: 17, day: 4, type: "rest", miles: 0, description: "Rest" },
  { week: 17, day: 5, type: "easy", miles: 3, description: "Easy shakeout" },
  { week: 17, day: 6, type: "long", miles: 8, description: "Final long run" },
  { week: 17, day: 7, type: "rest", miles: 0, description: "Rest" },
  // Week 18 - Race Week
  { week: 18, day: 1, type: "easy", miles: 3, description: "Easy run" },
  { week: 18, day: 2, type: "easy", miles: 3, description: "Easy shakeout with strides" },
  { week: 18, day: 3, type: "easy", miles: 2, description: "Very easy" },
  { week: 18, day: 4, type: "rest", miles: 0, description: "Rest - hydrate well" },
  { week: 18, day: 5, type: "easy", miles: 2, description: "Shakeout run" },
  { week: 18, day: 6, type: "rest", miles: 0, description: "Rest - prep your gear!" },
  { week: 18, day: 7, type: "race", miles: 26.2, description: "🏃 NYC MARATHON - YOU'VE GOT THIS! 🗽" },
];

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
}

interface TrainingState {
  startDate: string;
  logs: RunLog[];
}

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const typeColors: Record<string, string> = {
  easy: "bg-green-500/20 text-green-400 border-green-500/30",
  tempo: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  intervals: "bg-red-500/20 text-red-400 border-red-500/30",
  long: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  rest: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  race: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const feelingEmojis = {
  great: "🔥",
  good: "😊",
  okay: "😐",
  tough: "😤",
  struggled: "😵",
};

export default function MarathonTracker() {
  const [state, setState] = useState<TrainingState>({
    startDate: "",
    logs: [],
  });
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<typeof trainingPlan[0] | null>(null);
  const [logForm, setLogForm] = useState({
    actualMiles: "",
    duration: "",
    feeling: "good" as RunLog["feeling"],
    notes: "",
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("marathon-training");
    if (saved) {
      setState(JSON.parse(saved));
    } else {
      // Default start date: next Monday
      const today = new Date();
      const daysUntilMonday = (8 - today.getDay()) % 7 || 7;
      const nextMonday = new Date(today);
      nextMonday.setDate(today.getDate() + daysUntilMonday);
      setState({
        startDate: nextMonday.toISOString().split("T")[0],
        logs: [],
      });
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("marathon-training", JSON.stringify(state));
    }
  }, [state, isLoading]);

  const getDateForWorkout = (week: number, day: number) => {
    if (!state.startDate) return "";
    const start = new Date(state.startDate);
    const daysToAdd = (week - 1) * 7 + (day - 1);
    const date = new Date(start);
    date.setDate(start.getDate() + daysToAdd);
    return date.toISOString().split("T")[0];
  };

  const getLogForWorkout = (week: number, day: number) => {
    return state.logs.find((log) => log.week === week && log.day === day);
  };

  const calculatePace = (miles: string, duration: string) => {
    if (!miles || !duration) return "";
    const [mins, secs] = duration.split(":").map(Number);
    if (isNaN(mins)) return "";
    const totalMinutes = mins + (secs || 0) / 60;
    const milesNum = parseFloat(miles);
    if (milesNum <= 0) return "";
    const paceMinutes = totalMinutes / milesNum;
    const paceMins = Math.floor(paceMinutes);
    const paceSecs = Math.round((paceMinutes - paceMins) * 60);
    return `${paceMins}:${paceSecs.toString().padStart(2, "0")}`;
  };

  const handleLogRun = () => {
    if (!selectedWorkout) return;
    const pace = calculatePace(logForm.actualMiles, logForm.duration);
    const newLog: RunLog = {
      id: `${selectedWorkout.week}-${selectedWorkout.day}`,
      week: selectedWorkout.week,
      day: selectedWorkout.day,
      date: getDateForWorkout(selectedWorkout.week, selectedWorkout.day),
      actualMiles: parseFloat(logForm.actualMiles) || 0,
      duration: logForm.duration,
      pace,
      feeling: logForm.feeling,
      notes: logForm.notes,
    };
    setState((prev) => ({
      ...prev,
      logs: [...prev.logs.filter((l) => l.id !== newLog.id), newLog],
    }));
    setLogDialogOpen(false);
    setLogForm({ actualMiles: "", duration: "", feeling: "good", notes: "" });
  };

  // Calculate stats
  const totalPlannedMiles = trainingPlan.reduce((sum, w) => sum + w.miles, 0);
  const totalLoggedMiles = state.logs.reduce((sum, l) => sum + l.actualMiles, 0);
  const completedWorkouts = state.logs.length;
  const totalWorkouts = trainingPlan.filter((w) => w.type !== "rest").length;
  const completionRate = totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0;

  const weeklyMiles = Array.from({ length: 18 }, (_, i) => {
    const weekLogs = state.logs.filter((l) => l.week === i + 1);
    return weekLogs.reduce((sum, l) => sum + l.actualMiles, 0);
  });

  const currentWeekWorkouts = trainingPlan.filter((w) => w.week === selectedWeek);

  // Feeling distribution
  const feelingCounts = state.logs.reduce((acc, log) => {
    acc[log.feeling] = (acc[log.feeling] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-slate-400 hover:text-white text-sm mb-2 inline-block">
              ← Back to Sandbox
            </Link>
            <h1 className="text-4xl font-bold text-white">🏃 NYC Marathon Training</h1>
            <p className="text-slate-400 mt-2">18-week program to race day</p>
          </div>
          <div className="text-right">
            <Label className="text-slate-400 text-sm">Training Start Date</Label>
            <Input
              type="date"
              value={state.startDate}
              onChange={(e) => setState((prev) => ({ ...prev, startDate: e.target.value }))}
              className="bg-slate-800 border-slate-700 text-white w-40"
            />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-400">Total Miles</CardDescription>
              <CardTitle className="text-3xl text-white">
                {totalLoggedMiles.toFixed(1)}
                <span className="text-lg text-slate-500">/{totalPlannedMiles}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={(totalLoggedMiles / totalPlannedMiles) * 100} className="h-2" />
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-400">Workouts Done</CardDescription>
              <CardTitle className="text-3xl text-white">
                {completedWorkouts}
                <span className="text-lg text-slate-500">/{totalWorkouts}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={completionRate} className="h-2" />
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-400">This Week</CardDescription>
              <CardTitle className="text-3xl text-white">
                {weeklyMiles[selectedWeek - 1]?.toFixed(1) || 0}
                <span className="text-lg text-slate-500"> mi</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">Week {selectedWeek} of 18</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-400">How You&apos;re Feeling</CardDescription>
              <CardTitle className="text-2xl text-white">
                {Object.entries(feelingCounts)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3)
                  .map(([feeling]) => feelingEmojis[feeling as keyof typeof feelingEmojis])
                  .join(" ") || "—"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">
                {state.logs.length > 0 ? "Based on your logs" : "Log runs to track"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="schedule" className="space-y-4">
          <TabsList className="bg-slate-800">
            <TabsTrigger value="schedule">Training Schedule</TabsTrigger>
            <TabsTrigger value="progress">Progress Charts</TabsTrigger>
            <TabsTrigger value="log">Run Log</TabsTrigger>
          </TabsList>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-4">
            {/* Week Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {Array.from({ length: 18 }, (_, i) => i + 1).map((week) => {
                const weekLogs = state.logs.filter((l) => l.week === week);
                const weekWorkouts = trainingPlan.filter((w) => w.week === week && w.type !== "rest");
                const isComplete = weekLogs.length >= weekWorkouts.length;
                return (
                  <Button
                    key={week}
                    variant={selectedWeek === week ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedWeek(week)}
                    className={`min-w-[60px] ${
                      selectedWeek === week
                        ? "bg-purple-600"
                        : isComplete
                        ? "border-green-500 text-green-400"
                        : "border-slate-600 text-slate-400"
                    }`}
                  >
                    W{week}
                    {isComplete && " ✓"}
                  </Button>
                );
              })}
            </div>

            {/* Week Schedule */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Week {selectedWeek}</CardTitle>
                <CardDescription className="text-slate-400">
                  {selectedWeek <= 4
                    ? "Base Building"
                    : selectedWeek <= 8
                    ? "Building Mileage"
                    : selectedWeek <= 12
                    ? "Peak Training"
                    : selectedWeek <= 14
                    ? "Final Push"
                    : selectedWeek <= 17
                    ? "Taper"
                    : "Race Week! 🎉"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {currentWeekWorkouts.map((workout) => {
                    const log = getLogForWorkout(workout.week, workout.day);
                    const date = getDateForWorkout(workout.week, workout.day);
                    const isToday = date === new Date().toISOString().split("T")[0];
                    return (
                      <div
                        key={`${workout.week}-${workout.day}`}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          isToday ? "border-purple-500 bg-purple-500/10" : "border-slate-700 bg-slate-800/50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-center min-w-[60px]">
                            <p className="text-xs text-slate-500">{dayNames[workout.day - 1]}</p>
                            <p className="text-sm text-white">
                              {date ? new Date(date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge className={typeColors[workout.type]}>{workout.type}</Badge>
                              {workout.miles > 0 && (
                                <span className="text-white font-medium">{workout.miles} mi</span>
                              )}
                              {log && <span className="text-green-400">✓</span>}
                            </div>
                            <p className="text-sm text-slate-400 mt-1">{workout.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {log && (
                            <div className="text-right mr-4">
                              <p className="text-white">{log.actualMiles} mi</p>
                              <p className="text-sm text-slate-400">{log.pace}/mi {feelingEmojis[log.feeling]}</p>
                            </div>
                          )}
                          {workout.type !== "rest" && (
                            <Dialog open={logDialogOpen && selectedWorkout?.day === workout.day && selectedWorkout?.week === workout.week} onOpenChange={setLogDialogOpen}>
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
                                      });
                                    } else {
                                      setLogForm({
                                        actualMiles: workout.miles.toString(),
                                        duration: "",
                                        feeling: "good",
                                        notes: "",
                                      });
                                    }
                                  }}
                                  className={log ? "border-slate-600" : "bg-purple-600 hover:bg-purple-700"}
                                >
                                  {log ? "Edit" : "Log"}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-slate-800 border-slate-700">
                                <DialogHeader>
                                  <DialogTitle className="text-white">Log Your Run</DialogTitle>
                                  <DialogDescription className="text-slate-400">
                                    {workout.description}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 mt-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-slate-300">Distance (miles)</Label>
                                      <Input
                                        type="number"
                                        step="0.1"
                                        value={logForm.actualMiles}
                                        onChange={(e) => setLogForm((f) => ({ ...f, actualMiles: e.target.value }))}
                                        className="bg-slate-700 border-slate-600 text-white"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-slate-300">Duration (mm:ss)</Label>
                                      <Input
                                        placeholder="32:00"
                                        value={logForm.duration}
                                        onChange={(e) => setLogForm((f) => ({ ...f, duration: e.target.value }))}
                                        className="bg-slate-700 border-slate-600 text-white"
                                      />
                                    </div>
                                  </div>
                                  {logForm.actualMiles && logForm.duration && (
                                    <p className="text-slate-400 text-sm">
                                      Pace: {calculatePace(logForm.actualMiles, logForm.duration)}/mi
                                    </p>
                                  )}
                                  <div>
                                    <Label className="text-slate-300">How did it feel?</Label>
                                    <Select
                                      value={logForm.feeling}
                                      onValueChange={(v) => setLogForm((f) => ({ ...f, feeling: v as RunLog["feeling"] }))}
                                    >
                                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="bg-slate-700 border-slate-600">
                                        <SelectItem value="great">🔥 Great</SelectItem>
                                        <SelectItem value="good">😊 Good</SelectItem>
                                        <SelectItem value="okay">😐 Okay</SelectItem>
                                        <SelectItem value="tough">😤 Tough</SelectItem>
                                        <SelectItem value="struggled">😵 Struggled</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label className="text-slate-300">Notes</Label>
                                    <Textarea
                                      placeholder="How was the run? Any observations..."
                                      value={logForm.notes}
                                      onChange={(e) => setLogForm((f) => ({ ...f, notes: e.target.value }))}
                                      className="bg-slate-700 border-slate-600 text-white"
                                    />
                                  </div>
                                  <Button onClick={handleLogRun} className="w-full bg-purple-600 hover:bg-purple-700">
                                    Save Run
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Weekly Mileage</CardTitle>
                <CardDescription className="text-slate-400">Your actual miles per week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-1 h-48">
                  {weeklyMiles.map((miles, i) => {
                    const plannedMiles = trainingPlan
                      .filter((w) => w.week === i + 1)
                      .reduce((sum, w) => sum + w.miles, 0);
                    const maxMiles = 60; // Scale
                    const height = (miles / maxMiles) * 100;
                    const plannedHeight = (plannedMiles / maxMiles) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="relative w-full h-40 flex items-end justify-center">
                          {/* Planned (ghost) */}
                          <div
                            className="absolute bottom-0 w-full bg-slate-700/50 rounded-t"
                            style={{ height: `${plannedHeight}%` }}
                          />
                          {/* Actual */}
                          <div
                            className={`relative w-full rounded-t ${
                              miles >= plannedMiles ? "bg-green-500" : "bg-purple-500"
                            }`}
                            style={{ height: `${height}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">{i + 1}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded" />
                    <span className="text-slate-400">Actual</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-slate-700 rounded" />
                    <span className="text-slate-400">Planned</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Pace Trend</CardTitle>
                  <CardDescription className="text-slate-400">Your average pace over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {state.logs
                      .filter((l) => l.pace)
                      .slice(-10)
                      .map((log) => (
                        <div key={log.id} className="flex justify-between items-center">
                          <span className="text-slate-400 text-sm">
                            W{log.week}D{log.day}
                          </span>
                          <div className="flex-1 mx-4 h-2 bg-slate-700 rounded overflow-hidden">
                            <div
                              className="h-full bg-purple-500"
                              style={{
                                width: `${Math.max(0, 100 - (parseInt(log.pace) - 6) * 10)}%`,
                              }}
                            />
                          </div>
                          <span className="text-white font-mono">{log.pace}/mi</span>
                        </div>
                      ))}
                    {state.logs.filter((l) => l.pace).length === 0 && (
                      <p className="text-slate-500 text-center py-8">Log runs to see pace trend</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Feeling Distribution</CardTitle>
                  <CardDescription className="text-slate-400">How your runs have felt</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(["great", "good", "okay", "tough", "struggled"] as const).map((feeling) => {
                      const count = feelingCounts[feeling] || 0;
                      const percentage = state.logs.length > 0 ? (count / state.logs.length) * 100 : 0;
                      return (
                        <div key={feeling} className="flex items-center gap-3">
                          <span className="text-2xl w-8">{feelingEmojis[feeling]}</span>
                          <div className="flex-1 h-4 bg-slate-700 rounded overflow-hidden">
                            <div
                              className="h-full bg-purple-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-slate-400 w-8 text-right">{count}</span>
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
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Run History</CardTitle>
                <CardDescription className="text-slate-400">All your logged runs</CardDescription>
              </CardHeader>
              <CardContent>
                {state.logs.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No runs logged yet. Get out there! 🏃</p>
                ) : (
                  <div className="space-y-3">
                    {[...state.logs]
                      .sort((a, b) => {
                        if (a.week !== b.week) return b.week - a.week;
                        return b.day - a.day;
                      })
                      .map((log) => (
                        <div
                          key={log.id}
                          className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">
                                Week {log.week}, Day {log.day}
                              </span>
                              <span className="text-xl">{feelingEmojis[log.feeling]}</span>
                            </div>
                            <p className="text-sm text-slate-400">{log.date}</p>
                            {log.notes && <p className="text-sm text-slate-500 mt-1">{log.notes}</p>}
                          </div>
                          <div className="text-right">
                            <p className="text-white font-medium">{log.actualMiles} mi</p>
                            <p className="text-sm text-slate-400">{log.duration} • {log.pace}/mi</p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
