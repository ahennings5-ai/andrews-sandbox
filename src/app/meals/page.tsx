"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

// Simplified meal database - focused on fewer core ingredients
// Core proteins: chicken thighs, ground turkey, eggs
// Core carbs: rice, pasta, tortillas, oats
// Core veggies: broccoli, spinach, bell peppers, onions, tomatoes
// Staples: cheese, beans, salsa, soy sauce, eggs

const breakfasts = [
  { id: "b1", name: "Overnight Oats", ingredients: ["oats", "milk", "banana"], cost: 2, prepTime: 5, prepAhead: true, protein: 8, carbs: 45, calories: 320 },
  { id: "b2", name: "Eggs & Toast", ingredients: ["eggs", "bread", "butter"], cost: 3, prepTime: 10, prepAhead: false, protein: 14, carbs: 25, calories: 350 },
  { id: "b3", name: "Veggie Egg Scramble", ingredients: ["eggs", "spinach", "cheese", "bell peppers"], cost: 3.5, prepTime: 10, prepAhead: false, protein: 18, carbs: 6, calories: 280 },
  { id: "b4", name: "Breakfast Burrito", ingredients: ["eggs", "tortillas", "cheese", "salsa"], cost: 3, prepTime: 10, prepAhead: true, protein: 16, carbs: 28, calories: 380 },
  { id: "b5", name: "Oatmeal + Eggs", ingredients: ["oats", "eggs", "banana"], cost: 2.5, prepTime: 10, prepAhead: false, protein: 14, carbs: 42, calories: 360 },
  { id: "b6", name: "Egg Muffins", ingredients: ["eggs", "spinach", "cheese", "onions"], cost: 3, prepTime: 25, prepAhead: true, protein: 16, carbs: 4, calories: 220 },
];

const lunches = [
  { id: "l1", name: "Chicken Rice Bowl", ingredients: ["chicken thighs", "rice", "broccoli", "soy sauce"], cost: 5, prepTime: 5, prepAhead: true, protein: 35, carbs: 45, calories: 480 },
  { id: "l2", name: "Turkey Taco Bowl", ingredients: ["ground turkey", "rice", "salsa", "cheese", "beans"], cost: 5, prepTime: 5, prepAhead: true, protein: 32, carbs: 42, calories: 460 },
  { id: "l3", name: "Chicken & Veggie Wrap", ingredients: ["chicken thighs", "tortillas", "spinach", "cheese"], cost: 4.5, prepTime: 5, prepAhead: true, protein: 30, carbs: 28, calories: 420 },
  { id: "l4", name: "Turkey Rice Bowl", ingredients: ["ground turkey", "rice", "broccoli", "soy sauce"], cost: 5, prepTime: 5, prepAhead: true, protein: 30, carbs: 45, calories: 470 },
  { id: "l5", name: "Bean & Cheese Burrito", ingredients: ["beans", "tortillas", "cheese", "salsa", "rice"], cost: 4, prepTime: 5, prepAhead: true, protein: 18, carbs: 52, calories: 440 },
  { id: "l6", name: "Chicken Quesadilla", ingredients: ["chicken thighs", "tortillas", "cheese", "salsa"], cost: 5, prepTime: 10, prepAhead: true, protein: 32, carbs: 30, calories: 450 },
];

const dinners = [
  { id: "d1", name: "Chicken Stir Fry", ingredients: ["chicken thighs", "broccoli", "bell peppers", "rice", "soy sauce"], cost: 7, prepTime: 20, prepAhead: false, protein: 35, carbs: 48, calories: 520 },
  { id: "d2", name: "Turkey Pasta", ingredients: ["ground turkey", "pasta", "tomatoes", "onions", "cheese"], cost: 7, prepTime: 25, prepAhead: false, protein: 32, carbs: 58, calories: 560 },
  { id: "d3", name: "Chicken Fajitas", ingredients: ["chicken thighs", "bell peppers", "onions", "tortillas", "cheese"], cost: 8, prepTime: 25, prepAhead: false, protein: 36, carbs: 35, calories: 520 },
  { id: "d4", name: "Turkey Tacos", ingredients: ["ground turkey", "tortillas", "cheese", "salsa", "beans"], cost: 7, prepTime: 20, prepAhead: false, protein: 30, carbs: 38, calories: 480 },
  { id: "d5", name: "Chicken & Rice Bake", ingredients: ["chicken thighs", "rice", "broccoli", "cheese"], cost: 7, prepTime: 35, prepAhead: true, protein: 38, carbs: 45, calories: 540 },
  { id: "d6", name: "Pasta Primavera", ingredients: ["pasta", "broccoli", "bell peppers", "tomatoes", "cheese"], cost: 6, prepTime: 20, prepAhead: false, protein: 16, carbs: 62, calories: 480 },
  { id: "d7", name: "Turkey Chili", ingredients: ["ground turkey", "beans", "tomatoes", "onions", "cheese"], cost: 8, prepTime: 30, prepAhead: true, protein: 35, carbs: 42, calories: 520 },
  { id: "d8", name: "Chicken Burrito Bowls", ingredients: ["chicken thighs", "rice", "beans", "salsa", "cheese"], cost: 7, prepTime: 15, prepAhead: false, protein: 38, carbs: 52, calories: 560 },
  { id: "d9", name: "Egg Fried Rice", ingredients: ["eggs", "rice", "broccoli", "soy sauce", "onions"], cost: 5, prepTime: 15, prepAhead: false, protein: 16, carbs: 52, calories: 420 },
  { id: "d10", name: "Turkey Stuffed Peppers", ingredients: ["ground turkey", "bell peppers", "rice", "tomatoes", "cheese"], cost: 8, prepTime: 40, prepAhead: true, protein: 32, carbs: 38, calories: 480 },
];

const snacks = [
  { id: "s1", name: "Hard Boiled Eggs", cost: 1, calories: 140 },
  { id: "s2", name: "Cheese & Crackers", cost: 2, calories: 200 },
  { id: "s3", name: "Banana", cost: 0.5, calories: 105 },
  { id: "s4", name: "Tortilla + Cheese", cost: 1.5, calories: 180 },
];

type Meal = typeof breakfasts[0] | typeof lunches[0] | typeof dinners[0];
type Snack = typeof snacks[0];

interface DayPlan {
  breakfast: typeof breakfasts[0];
  lunch: typeof lunches[0];
  dinner: typeof dinners[0];
  snack: Snack;
  locked: { breakfast: boolean; lunch: boolean; dinner: boolean; snack: boolean };
}

// Who's eating at home each day
interface DayAttendance {
  andrew: boolean;
  olivia: boolean;
}

interface WeekPlan {
  days: DayPlan[];
  generatedAt: string;
  checkedItems: Record<string, boolean>;
  attendance: DayAttendance[]; // 7 days
}

const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateWeekPlan(existingPlan?: WeekPlan): WeekPlan {
  const shuffledBreakfasts = shuffleArray(breakfasts);
  const shuffledLunches = shuffleArray(lunches);
  const shuffledDinners = shuffleArray(dinners);
  const shuffledSnacks = shuffleArray(snacks);

  const days: DayPlan[] = [];

  for (let i = 0; i < 7; i++) {
    const existing = existingPlan?.days[i];
    const locked = existing?.locked || { breakfast: false, lunch: false, dinner: false, snack: false };

    days.push({
      breakfast: locked.breakfast && existing ? existing.breakfast : shuffledBreakfasts[i % shuffledBreakfasts.length],
      lunch: locked.lunch && existing ? existing.lunch : shuffledLunches[i % shuffledLunches.length],
      dinner: locked.dinner && existing ? existing.dinner : shuffledDinners[i % shuffledDinners.length],
      snack: locked.snack && existing ? existing.snack : shuffledSnacks[i % shuffledSnacks.length],
      locked,
    });
  }

  const defaultAttendance: DayAttendance[] = Array(7).fill(null).map(() => ({ andrew: true, olivia: true }));
  return { 
    days, 
    generatedAt: new Date().toISOString(), 
    checkedItems: existingPlan?.checkedItems || {},
    attendance: existingPlan?.attendance || defaultAttendance,
  };
}

function calculateWeeklyStats(plan: WeekPlan) {
  let totalCost = 0;
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalPeopleDays = 0;

  const allIngredients: string[] = [];
  const ingredientMultipliers: Record<string, number> = {};
  const prepAheadMeals: { day: string; meal: string; name: string }[] = [];

  plan.days.forEach((day, i) => {
    const attendance = plan.attendance?.[i] || { andrew: true, olivia: true };
    const peopleCount = (attendance.andrew ? 1 : 0) + (attendance.olivia ? 1 : 0);
    
    if (peopleCount === 0) return; // Skip days with no one eating
    
    totalPeopleDays += peopleCount;

    // Cost based on how many people are eating
    totalCost += (day.breakfast.cost + day.lunch.cost + day.dinner.cost + day.snack.cost) * peopleCount;

    // Macros (per person, averaged later)
    totalCalories += (day.breakfast.calories + day.lunch.calories + day.dinner.calories + day.snack.calories) * peopleCount;
    totalProtein += (day.breakfast.protein + day.lunch.protein + day.dinner.protein) * peopleCount;
    totalCarbs += (day.breakfast.carbs + day.lunch.carbs + day.dinner.carbs) * peopleCount;

    // Ingredients with multiplier based on people count
    [...day.breakfast.ingredients, ...day.lunch.ingredients, ...day.dinner.ingredients].forEach(ing => {
      allIngredients.push(ing);
      ingredientMultipliers[ing] = (ingredientMultipliers[ing] || 0) + peopleCount;
    });

    // Prep ahead (only if someone is eating)
    if (day.breakfast.prepAhead) prepAheadMeals.push({ day: dayNames[i], meal: "Breakfast", name: day.breakfast.name });
    if (day.lunch.prepAhead) prepAheadMeals.push({ day: dayNames[i], meal: "Lunch", name: day.lunch.name });
    if (day.dinner.prepAhead) prepAheadMeals.push({ day: dayNames[i], meal: "Dinner", name: day.dinner.name });
  });

  // Use multipliers for grocery quantities
  const groceryList = Object.entries(ingredientMultipliers)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count: Math.ceil(count) }));

  const avgDays = totalPeopleDays > 0 ? totalPeopleDays : 1;

  return {
    totalCost: Math.round(totalCost),
    avgDailyCalories: Math.round(totalCalories / avgDays),
    avgDailyProtein: Math.round(totalProtein / avgDays),
    avgDailyCarbs: Math.round(totalCarbs / avgDays),
    groceryList,
    prepAheadMeals,
    totalPeopleDays,
  };
}

export default function MealPlanner() {
  const [plan, setPlan] = useState<WeekPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const savePlanToDb = useCallback(async (planToSave: WeekPlan) => {
    try {
      await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planData: planToSave.days,
          checkedItems: planToSave.checkedItems,
          attendance: planToSave.attendance,
        }),
      });
    } catch (error) {
      console.error("Failed to save meal plan:", error);
    }
  }, []);

  const regeneratePlan = useCallback(() => {
    setPlan((current) => {
      const newPlan = generateWeekPlan(current || undefined);
      savePlanToDb(newPlan);
      return newPlan;
    });
  }, [savePlanToDb]);

  // Load from database
  useEffect(() => {
    async function loadPlan() {
      try {
        const response = await fetch("/api/meals");
        if (response.ok) {
          const data = await response.json();
          if (data && data.planData) {
            const defaultAttendance = Array(7).fill(null).map(() => ({ andrew: true, olivia: true }));
            setPlan({
              days: data.planData,
              generatedAt: data.updatedAt,
              checkedItems: data.checkedItems || {},
              attendance: data.attendance || defaultAttendance,
            });
          } else {
            // No plan in DB, generate new one
            const newPlan = generateWeekPlan();
            setPlan(newPlan);
            savePlanToDb(newPlan);
          }
        } else {
          // No plan found, generate new one
          const newPlan = generateWeekPlan();
          setPlan(newPlan);
          savePlanToDb(newPlan);
        }
      } catch (error) {
        console.error("Failed to load meal plan:", error);
        setPlan(generateWeekPlan());
      } finally {
        setIsLoading(false);
      }
    }
    loadPlan();
  }, [savePlanToDb]);

  const toggleLock = (dayIndex: number, mealType: "breakfast" | "lunch" | "dinner" | "snack") => {
    if (!plan) return;
    const newPlan = { ...plan, days: [...plan.days] };
    newPlan.days[dayIndex] = {
      ...newPlan.days[dayIndex],
      locked: {
        ...newPlan.days[dayIndex].locked,
        [mealType]: !newPlan.days[dayIndex].locked[mealType],
      },
    };
    setPlan(newPlan);
    savePlanToDb(newPlan);
  };

  const toggleAttendance = (dayIndex: number, person: "andrew" | "olivia") => {
    if (!plan) return;
    const newAttendance = [...(plan.attendance || Array(7).fill(null).map(() => ({ andrew: true, olivia: true })))];
    newAttendance[dayIndex] = {
      ...newAttendance[dayIndex],
      [person]: !newAttendance[dayIndex][person],
    };
    const newPlan = { ...plan, attendance: newAttendance };
    setPlan(newPlan);
    savePlanToDb(newPlan);
  };

  const toggleCheckedItem = async (itemName: string) => {
    if (!plan) return;
    const newCheckedItems = {
      ...plan.checkedItems,
      [itemName]: !plan.checkedItems[itemName],
    };
    setPlan({
      ...plan,
      checkedItems: newCheckedItems,
    });
    // Save just the checked items
    try {
      await fetch("/api/meals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkedItems: newCheckedItems }),
      });
    } catch (error) {
      console.error("Failed to save checked items:", error);
    }
  };

  const clearCheckedItems = async () => {
    if (!plan) return;
    setPlan({ ...plan, checkedItems: {} });
    try {
      await fetch("/api/meals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkedItems: {} }),
      });
    } catch (error) {
      console.error("Failed to clear checked items:", error);
    }
  };

  const checkedCount = plan ? Object.values(plan.checkedItems).filter(Boolean).length : 0;

  if (isLoading || !plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const stats = calculateWeeklyStats(plan);
  const isOverBudget = stats.totalCost > 200;

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
              <h1 className="text-3xl font-bold text-foreground">Weekly Meal Plan</h1>
              <p className="text-muted-foreground mt-1">Balanced meals for two, NYC budget</p>
            </div>
            <Button onClick={regeneratePlan} size="lg">
              🔀 Shuffle Meals
            </Button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className={isOverBudget ? "border-destructive" : ""}>
            <CardHeader className="pb-2">
              <CardDescription>Weekly Cost</CardDescription>
              <CardTitle className={`text-2xl ${isOverBudget ? "text-destructive" : ""}`}>
                ${stats.totalCost}
                <span className="text-base font-normal text-muted-foreground"> / $200</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">For 2 people</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Daily Calories</CardDescription>
              <CardTitle className="text-2xl">{stats.avgDailyCalories}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Per person avg</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Daily Protein</CardDescription>
              <CardTitle className="text-2xl">{stats.avgDailyProtein}g</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Per person avg</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Prep Ahead</CardDescription>
              <CardTitle className="text-2xl">{stats.prepAheadMeals.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Meals to prep Sunday</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="plan" className="space-y-6">
          <TabsList>
            <TabsTrigger value="schedule">Who&apos;s Eating</TabsTrigger>
            <TabsTrigger value="plan">Meal Plan</TabsTrigger>
            <TabsTrigger value="prep">Sunday Prep</TabsTrigger>
            <TabsTrigger value="grocery">Grocery List</TabsTrigger>
          </TabsList>

          {/* Schedule Tab - Who's eating each day */}
          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
                <CardDescription>Toggle who&apos;s eating at home each day — costs adjust automatically</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-8 gap-2 text-center text-sm">
                  <div></div>
                  {dayNames.map((day) => (
                    <div key={day} className="font-medium">{day.slice(0, 3)}</div>
                  ))}
                  
                  {/* Andrew's row */}
                  <div className="text-left font-medium py-2">Andrew</div>
                  {plan.attendance?.map((att, i) => (
                    <button
                      key={`andrew-${i}`}
                      onClick={() => toggleAttendance(i, "andrew")}
                      className={`p-2 rounded-lg border transition-all ${
                        att.andrew
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted text-muted-foreground border-border hover:border-primary/50"
                      }`}
                    >
                      {att.andrew ? "✓" : "—"}
                    </button>
                  ))}
                  
                  {/* Olivia's row */}
                  <div className="text-left font-medium py-2">Olivia</div>
                  {plan.attendance?.map((att, i) => (
                    <button
                      key={`olivia-${i}`}
                      onClick={() => toggleAttendance(i, "olivia")}
                      className={`p-2 rounded-lg border transition-all ${
                        att.olivia
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted text-muted-foreground border-border hover:border-primary/50"
                      }`}
                    >
                      {att.olivia ? "✓" : "—"}
                    </button>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">This week:</span>
                    <span>
                      <strong>{plan.attendance?.filter(a => a.andrew).length || 7}</strong> days for Andrew, 
                      <strong> {plan.attendance?.filter(a => a.olivia).length || 7}</strong> days for Olivia
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Meal Plan Tab */}
          <TabsContent value="plan" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              🔒 Lock meals you like, then shuffle to regenerate the rest
            </p>

            {plan.days.map((day, dayIndex) => {
              const attendance = plan.attendance?.[dayIndex] || { andrew: true, olivia: true };
              const peopleCount = (attendance.andrew ? 1 : 0) + (attendance.olivia ? 1 : 0);
              
              return (
              <Card key={dayIndex} className={peopleCount === 0 ? "opacity-50" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{dayNames[dayIndex]}</CardTitle>
                    <div className="flex items-center gap-2 text-sm">
                      {attendance.andrew && <Badge variant="outline">Andrew</Badge>}
                      {attendance.olivia && <Badge variant="outline">Olivia</Badge>}
                      {peopleCount === 0 && <Badge variant="secondary">No meals needed</Badge>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Breakfast */}
                    <MealCard
                      label="Breakfast"
                      meal={day.breakfast}
                      locked={day.locked.breakfast}
                      onToggleLock={() => toggleLock(dayIndex, "breakfast")}
                    />
                    {/* Lunch */}
                    <MealCard
                      label="Lunch"
                      meal={day.lunch}
                      locked={day.locked.lunch}
                      onToggleLock={() => toggleLock(dayIndex, "lunch")}
                    />
                    {/* Dinner */}
                    <MealCard
                      label="Dinner"
                      meal={day.dinner}
                      locked={day.locked.dinner}
                      onToggleLock={() => toggleLock(dayIndex, "dinner")}
                    />
                    {/* Snack */}
                    <div className="p-3 rounded-lg border border-border bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Snack</span>
                        <button
                          onClick={() => toggleLock(dayIndex, "snack")}
                          className="text-sm hover:opacity-70"
                        >
                          {day.locked.snack ? "🔒" : "🔓"}
                        </button>
                      </div>
                      <p className="font-medium text-sm">{day.snack.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{day.snack.calories} cal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
            })}
          </TabsContent>

          {/* Sunday Prep Tab */}
          <TabsContent value="prep">
            <Card>
              <CardHeader>
                <CardTitle>Sunday Prep Session</CardTitle>
                <CardDescription>Get these ready for the week ahead</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.prepAheadMeals.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">No prep-ahead meals this week!</p>
                ) : (
                  <div className="space-y-3">
                    {/* Group by protein */}
                    <div className="p-4 rounded-lg border border-border bg-muted/30">
                      <h3 className="font-medium mb-3">🍗 Proteins to Cook</h3>
                      <ul className="space-y-2 text-sm">
                        {stats.groceryList
                          .filter((i) => ["chicken thighs", "ground turkey", "eggs"].includes(i.name))
                          .map((item) => (
                            <li key={item.name} className="flex items-center gap-2">
                              <span className="w-4 h-4 rounded border border-border" />
                              <span className="capitalize">{item.name}</span>
                              <span className="text-muted-foreground">({item.count}x this week)</span>
                            </li>
                          ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-lg border border-border bg-muted/30">
                      <h3 className="font-medium mb-3">🍚 Grains to Cook</h3>
                      <ul className="space-y-2 text-sm">
                        {stats.groceryList
                          .filter((i) => ["rice", "quinoa", "farro"].includes(i.name))
                          .map((item) => (
                            <li key={item.name} className="flex items-center gap-2">
                              <span className="w-4 h-4 rounded border border-border" />
                              <span className="capitalize">{item.name}</span>
                              <span className="text-muted-foreground">({item.count}x this week)</span>
                            </li>
                          ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-lg border border-border bg-muted/30">
                      <h3 className="font-medium mb-3">📋 Meals to Prep</h3>
                      <ul className="space-y-2 text-sm">
                        {stats.prepAheadMeals.map((meal, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded border border-border" />
                            <span>{meal.name}</span>
                            <Badge variant="outline" className="text-xs">{meal.day} {meal.meal}</Badge>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Grocery List Tab */}
          <TabsContent value="grocery">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      🛒 Shopping List
                      {checkedCount > 0 && (
                        <Badge variant="secondary">
                          {checkedCount}/{stats.groceryList.length} done
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>Tap items as you shop — progress saves automatically</CardDescription>
                  </div>
                  {checkedCount > 0 && (
                    <Button variant="outline" size="sm" onClick={clearCheckedItems}>
                      Clear All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Progress bar */}
                {stats.groceryList.length > 0 && (
                  <div className="mb-6">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${(checkedCount / stats.groceryList.length) * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {checkedCount === stats.groceryList.length
                        ? "✅ All done! Ready to prep."
                        : `${stats.groceryList.length - checkedCount} items remaining`}
                    </p>
                  </div>
                )}

                {/* Categorized grocery list */}
                <div className="space-y-6">
                  {/* Proteins */}
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">🍗 Proteins</h3>
                    <div className="space-y-1">
                      {stats.groceryList
                        .filter((i) => ["chicken thighs", "ground turkey", "salmon", "shrimp", "eggs", "flank steak", "white fish", "smoked salmon"].includes(i.name))
                        .map((item) => (
                          <GroceryItem
                            key={item.name}
                            item={item}
                            checked={plan?.checkedItems[item.name] || false}
                            onToggle={() => toggleCheckedItem(item.name)}
                          />
                        ))}
                    </div>
                  </div>

                  {/* Produce */}
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">🥦 Produce</h3>
                    <div className="space-y-1">
                      {stats.groceryList
                        .filter((i) => ["broccoli", "asparagus", "bell pepper", "sweet potato", "spinach", "kale", "lettuce", "cabbage", "cucumber", "tomato", "onions", "garlic", "avocado", "banana", "berries", "frozen berries", "apple", "lemon", "lime", "green beans", "potatoes", "corn", "edamame", "salad greens", "stir fry veggies", "roasted veggies"].includes(i.name))
                        .map((item) => (
                          <GroceryItem
                            key={item.name}
                            item={item}
                            checked={plan?.checkedItems[item.name] || false}
                            onToggle={() => toggleCheckedItem(item.name)}
                          />
                        ))}
                    </div>
                  </div>

                  {/* Grains & Carbs */}
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">🍚 Grains & Carbs</h3>
                    <div className="space-y-1">
                      {stats.groceryList
                        .filter((i) => ["rice", "quinoa", "farro", "pasta", "rice noodles", "bread", "bagel", "tortillas", "naan bread", "oats", "granola"].includes(i.name))
                        .map((item) => (
                          <GroceryItem
                            key={item.name}
                            item={item}
                            checked={plan?.checkedItems[item.name] || false}
                            onToggle={() => toggleCheckedItem(item.name)}
                          />
                        ))}
                    </div>
                  </div>

                  {/* Dairy */}
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">🧀 Dairy</h3>
                    <div className="space-y-1">
                      {stats.groceryList
                        .filter((i) => ["cheese", "feta", "mozzarella", "parmesan", "cream cheese", "greek yogurt", "oat milk", "butter"].includes(i.name))
                        .map((item) => (
                          <GroceryItem
                            key={item.name}
                            item={item}
                            checked={plan?.checkedItems[item.name] || false}
                            onToggle={() => toggleCheckedItem(item.name)}
                          />
                        ))}
                    </div>
                  </div>

                  {/* Pantry & Sauces */}
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">🫙 Pantry & Sauces</h3>
                    <div className="space-y-1">
                      {stats.groceryList
                        .filter((i) => !["chicken thighs", "ground turkey", "salmon", "shrimp", "eggs", "flank steak", "white fish", "smoked salmon", "broccoli", "asparagus", "bell pepper", "sweet potato", "spinach", "kale", "lettuce", "cabbage", "cucumber", "tomato", "onions", "garlic", "avocado", "banana", "berries", "frozen berries", "apple", "lemon", "lime", "green beans", "potatoes", "corn", "edamame", "salad greens", "stir fry veggies", "roasted veggies", "rice", "quinoa", "farro", "pasta", "rice noodles", "bread", "bagel", "tortillas", "naan bread", "oats", "granola", "cheese", "feta", "mozzarella", "parmesan", "cream cheese", "greek yogurt", "oat milk", "butter"].includes(i.name))
                        .map((item) => (
                          <GroceryItem
                            key={item.name}
                            item={item}
                            checked={plan?.checkedItems[item.name] || false}
                            onToggle={() => toggleCheckedItem(item.name)}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function GroceryItem({
  item,
  checked,
  onToggle,
}: {
  item: { name: string; count: number };
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
        checked
          ? "bg-primary/10 border-primary/30 opacity-60"
          : "bg-card border-border hover:border-primary/50"
      }`}
    >
      <div
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          checked ? "bg-primary border-primary" : "border-muted-foreground"
        }`}
      >
        {checked && (
          <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className={`flex-1 capitalize ${checked ? "line-through" : ""}`}>{item.name}</span>
      {item.count > 1 && (
        <Badge variant="secondary" className="text-xs">
          ×{item.count}
        </Badge>
      )}
    </button>
  );
}

function MealCard({
  label,
  meal,
  locked,
  onToggleLock,
}: {
  label: string;
  meal: Meal;
  locked: boolean;
  onToggleLock: () => void;
}) {
  return (
    <div className={`p-3 rounded-lg border ${locked ? "border-primary bg-primary/5" : "border-border"} bg-card`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
        <button onClick={onToggleLock} className="text-sm hover:opacity-70">
          {locked ? "🔒" : "🔓"}
        </button>
      </div>
      <p className="font-medium text-sm">{meal.name}</p>
      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
        <span>${meal.cost}</span>
        <span>•</span>
        <span>{meal.calories} cal</span>
        <span>•</span>
        <span>{meal.protein}g protein</span>
      </div>
      {meal.prepAhead && (
        <Badge variant="secondary" className="mt-2 text-xs">
          Prep ahead
        </Badge>
      )}
    </div>
  );
}
