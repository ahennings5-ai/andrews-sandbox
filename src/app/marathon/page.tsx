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

export default function MarathonTracker() {
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
  
  // Custom starting location for routes
  const HOME_ADDRESS = "5241+Center+Blvd,+Long+Island+City,+NY";
  const [customLocation, setCustomLocation] = useState<string | null>(null);
  const [locationInput, setLocationInput] = useState("");
  const [gettingLocation, setGettingLocation] = useState(false);
  
  const startingPoint = customLocation || HOME_ADDRESS;
  const startingPointDisplay = customLocation 
    ? decodeURIComponent(customLocation.replace(/\+/g, " ")) 
    : "5241 Center Blvd";

  // Get user's current location via GPS
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser");
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCustomLocation(`${latitude},${longitude}`);
        setGettingLocation(false);
      },
      (error) => {
        alert("Could not get location: " + error.message);
        setGettingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // Set custom address
  const setCustomAddress = () => {
    if (locationInput.trim()) {
      setCustomLocation(encodeURIComponent(locationInput.trim()).replace(/%20/g, "+"));
      setLocationInput("");
    }
  };

  // Reset to home
  const resetToHome = () => {
    setCustomLocation(null);
  };
  
  // Route destinations (without starting point - we'll add that dynamically)
  const routeDestinations: Record<number, { name: string; description: string; miles: number; waypoints: string[] }[]> = {
    3: [
      { name: "Hunters Point South Loop", miles: 3, description: "Waterfront loop around the park", waypoints: ["Hunters+Point+South+Park", "Gantry+Plaza+State+Park"] },
      { name: "Gantry to Vernon", miles: 3, description: "North along waterfront and back", waypoints: ["Vernon+Blvd,+Long+Island+City"] },
    ],
    4: [
      { name: "Roosevelt Island Loop", miles: 4, description: "Cross the bridge, loop the island", waypoints: ["Roosevelt+Island+Bridge", "Roosevelt+Island"] },
      { name: "Waterfront to Rainey Park", miles: 4, description: "North along East River to Rainey Park", waypoints: ["Rainey+Park,+Queens"] },
    ],
    5: [
      { name: "Queensboro Bridge Out & Back", miles: 5, description: "Waterfront to the bridge and back", waypoints: ["Queensboro+Bridge"] },
      { name: "Socrates Sculpture Park", miles: 5, description: "North to Socrates and Astoria", waypoints: ["Socrates+Sculpture+Park"] },
    ],
    6: [
      { name: "Queensboro + Roosevelt Island", miles: 6, description: "Over the bridge, loop Roosevelt Island", waypoints: ["Queensboro+Bridge", "Roosevelt+Island"] },
      { name: "Astoria Park Loop", miles: 6, description: "Waterfront up to Astoria Park", waypoints: ["Astoria+Park"] },
    ],
    8: [
      { name: "Queensboro + East Side", miles: 8, description: "Over bridge, south on East Side path, back", waypoints: ["Queensboro+Bridge", "East+63rd+Street,+Manhattan", "Queensboro+Bridge"] },
      { name: "Full Roosevelt + Astoria", miles: 8, description: "Roosevelt Island + waterfront to Astoria", waypoints: ["Roosevelt+Island", "Astoria+Park"] },
    ],
    10: [
      { name: "Central Park South Loop", miles: 10, description: "Queensboro → Central Park south end → back", waypoints: ["Queensboro+Bridge", "Central+Park+South,+Manhattan", "Queensboro+Bridge"] },
    ],
    12: [
      { name: "Central Park Half Loop", miles: 12, description: "Queensboro → half Central Park loop → back", waypoints: ["Queensboro+Bridge", "Central+Park,+Manhattan", "Queensboro+Bridge"] },
    ],
    14: [
      { name: "Central Park Full Loop", miles: 14, description: "Queensboro → full Central Park loop (6 mi) → back", waypoints: ["Queensboro+Bridge", "Central+Park+North,+Manhattan", "Central+Park+South,+Manhattan", "Queensboro+Bridge"] },
    ],
    16: [
      { name: "Central Park + Harlem Hill", miles: 16, description: "Full park loop with Harlem Hill repeats", waypoints: ["Queensboro+Bridge", "Central+Park,+Manhattan", "Harlem+Hill,+Central+Park", "Queensboro+Bridge"] },
    ],
    18: [
      { name: "Central Park Double", miles: 18, description: "Queensboro → 1.5 Central Park loops → back", waypoints: ["Queensboro+Bridge", "Central+Park,+Manhattan", "Queensboro+Bridge"] },
    ],
    20: [
      { name: "Marathon Simulation", miles: 20, description: "Queensboro → 2 full Central Park loops → back", waypoints: ["Queensboro+Bridge", "Central+Park,+Manhattan", "Queensboro+Bridge"] },
    ],
  };

  // Build an OnTheGoMap URL for route creation
  // onthegomap.com centers on a location where user can draw their route
  const buildMapUrl = (waypoints: string[], miles: number) => {
    // For GPS coordinates (lat,lng format)
    if (startingPoint.includes(",") && !startingPoint.includes("+")) {
      const [lat, lng] = startingPoint.split(",");
      return `https://onthegomap.com/?lat=${lat}&lng=${lng}&zoom=14&d=${miles}`;
    }
    // For addresses, use a Google search redirect to get coords, or just center on LIC
    // Default to Hunters Point coordinates
    return `https://onthegomap.com/?lat=40.7433&lng=-73.9575&zoom=14&d=${miles}`;
  };
  
  // Also provide a direct link to create a route on OnTheGoMap
  const getOnTheGoMapLink = () => {
    if (startingPoint.includes(",") && !startingPoint.includes("+")) {
      const [lat, lng] = startingPoint.split(",");
      return `https://onthegomap.com/?lat=${lat}&lng=${lng}&zoom=14`;
    }
    return "https://onthegomap.com/?lat=40.7433&lng=-73.9575&zoom=14";
  };

  // Get route suggestions for a given distance (with dynamic starting point)
  const getRouteSuggestions = (miles: number): { name: string; description: string; miles: number; mapUrl: string }[] => {
    const distances = Object.keys(routeDestinations).map(Number).sort((a, b) => a - b);
    
    // Get exact match or closest
    const exactMatch = distances.find(d => d === miles);
    const matchedRoutes = exactMatch ? routeDestinations[exactMatch] : null;
    
    // Find closest distance
    const closest = distances.reduce((prev, curr) => 
      Math.abs(curr - miles) < Math.abs(prev - miles) ? curr : prev
    );
    
    // Also include one distance up if it's close
    const nextUp = distances.find(d => d > miles);
    const suggestions = [...(matchedRoutes || routeDestinations[closest] || [])];
    
    if (nextUp && nextUp - miles <= 2 && routeDestinations[nextUp]) {
      suggestions.push(...routeDestinations[nextUp].slice(0, 1));
    }
    
    // Build mapUrl for each route using current starting point
    return suggestions.map(route => ({
      name: route.name,
      description: route.description,
      miles: route.miles,
      mapUrl: buildMapUrl(route.waypoints, route.miles),
    }));
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

  const handleLogRun = async () => {
    if (!selectedWorkout) return;
    const pace = calculatePace(logForm.actualMiles, logForm.duration);
    const logData = {
      week: selectedWorkout.week,
      day: selectedWorkout.day,
      date: getDateForWorkout(selectedWorkout.week, selectedWorkout.day),
      actualMiles: parseFloat(logForm.actualMiles) || 0,
      duration: logForm.duration,
      pace,
      feeling: logForm.feeling,
      notes: logForm.notes,
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
    setLogForm({ actualMiles: "", duration: "", feeling: "good", notes: "" });
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

  // Stats
  const totalPlannedMiles = trainingPlan.reduce((sum, w) => sum + w.miles, 0);
  const totalLoggedMiles = state.logs.reduce((sum, l) => sum + l.actualMiles, 0);
  const completedWorkouts = state.logs.length;
  const totalWorkouts = trainingPlan.filter((w) => w.type !== "rest").length;
  const completionRate = totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0;

  const weeklyMiles = Array.from({ length: TOTAL_WEEKS }, (_, i) => {
    const weekLogs = state.logs.filter((l) => l.week === i + 1);
    return weekLogs.reduce((sum, l) => sum + l.actualMiles, 0);
  });

  const weeklyPlannedMiles = Array.from({ length: TOTAL_WEEKS }, (_, i) => {
    return trainingPlan.filter((w) => w.week === i + 1).reduce((sum, w) => sum + w.miles, 0);
  });

  const currentWeekWorkouts = trainingPlan.filter((w) => w.week === selectedWeek);

  const feelingCounts = state.logs.reduce(
    (acc, log) => {
      acc[log.feeling] = (acc[log.feeling] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const today = new Date();
  const daysUntilRace = Math.ceil((RACE_DATE.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
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
                  .map(([f]) => feelingConfig[f as keyof typeof feelingConfig].emoji)
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
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="log">Run Log</TabsTrigger>
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
                            {log.pace}/mi {feelingConfig[log.feeling].emoji}
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
                          className="flex items-center gap-4 p-4 rounded-lg border border-border"
                        >
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Week {log.week}, Day {log.day}</span>
                              <Badge variant="outline" className={log.week <= BASE_WEEKS ? "border-emerald-500/30 text-emerald-500" : ""}>
                                {log.week <= BASE_WEEKS ? "Base" : "Marathon"}
                              </Badge>
                              <span className="text-lg">{feelingConfig[log.feeling].emoji}</span>
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
                      ))}
                  </div>
                )}
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

                  {/* Suggested Routes */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">🗺️ Routes</h3>
                      {customLocation && (
                        <Button variant="ghost" size="sm" onClick={resetToHome} className="text-xs h-7">
                          ← Back to home
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Starting from {startingPointDisplay}
                    </p>
                    
                    {/* Route list */}
                    <div className="space-y-2">
                      {getRouteSuggestions(selectedWorkout.miles).map((route, i) => (
                        <a
                          key={i}
                          href={route.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm">{route.name}</p>
                                <Badge variant="secondary" className="text-xs">{route.miles} mi</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{route.description}</p>
                            </div>
                            <span className="text-primary text-sm">Map →</span>
                          </div>
                        </a>
                      ))}
                    </div>

                    {/* Running away from home? */}
                    <div className="mt-4 p-3 rounded-lg border border-dashed border-border">
                      <p className="text-sm font-medium mb-2">🏃 Running away from home?</p>
                      <div className="flex gap-2 mb-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={useCurrentLocation}
                          disabled={gettingLocation}
                          className="text-xs"
                        >
                          {gettingLocation ? "Getting location..." : "📍 Use my location"}
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Or enter an address..."
                          value={locationInput}
                          onChange={(e) => setLocationInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && setCustomAddress()}
                          className="text-sm h-8"
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={setCustomAddress}
                          disabled={!locationInput.trim()}
                          className="text-xs"
                        >
                          Set
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        💡 Click to open in OnTheGoMap
                      </p>
                      <a 
                        href={getOnTheGoMapLink()} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        Draw custom route →
                      </a>
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
