"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

// Meal database with NYC pricing
const breakfasts = [
  { id: "b1", name: "Overnight Oats", ingredients: ["oats", "oat milk", "banana", "honey"], cost: 2.5, prepTime: 5, prepAhead: true, protein: 8, carbs: 45, calories: 320 },
  { id: "b2", name: "Eggs & Avocado Toast", ingredients: ["eggs", "bread", "avocado"], cost: 4, prepTime: 10, prepAhead: false, protein: 14, carbs: 25, calories: 380 },
  { id: "b3", name: "Greek Yogurt Parfait", ingredients: ["greek yogurt", "granola", "berries"], cost: 4.5, prepTime: 5, prepAhead: true, protein: 18, carbs: 35, calories: 340 },
  { id: "b4", name: "Veggie Egg Muffins", ingredients: ["eggs", "spinach", "cheese", "bell pepper"], cost: 3, prepTime: 25, prepAhead: true, protein: 16, carbs: 4, calories: 220 },
  { id: "b5", name: "Smoothie Bowl", ingredients: ["frozen berries", "banana", "oat milk", "granola"], cost: 4, prepTime: 5, prepAhead: false, protein: 6, carbs: 55, calories: 350 },
  { id: "b6", name: "Bagel & Cream Cheese", ingredients: ["bagel", "cream cheese", "smoked salmon"], cost: 5, prepTime: 5, prepAhead: false, protein: 15, carbs: 45, calories: 420 },
  { id: "b7", name: "Banana Pancakes", ingredients: ["banana", "eggs", "oats"], cost: 2.5, prepTime: 15, prepAhead: false, protein: 12, carbs: 40, calories: 310 },
  { id: "b8", name: "Chia Pudding", ingredients: ["chia seeds", "oat milk", "maple syrup", "berries"], cost: 3.5, prepTime: 5, prepAhead: true, protein: 6, carbs: 30, calories: 280 },
];

const lunches = [
  { id: "l1", name: "Chicken Rice Bowl", ingredients: ["chicken thighs", "rice", "roasted veggies", "tahini"], cost: 6, prepTime: 5, prepAhead: true, protein: 35, carbs: 45, calories: 520 },
  { id: "l2", name: "Turkey Taco Bowl", ingredients: ["ground turkey", "rice", "salsa", "cheese", "greens"], cost: 5.5, prepTime: 5, prepAhead: true, protein: 32, carbs: 40, calories: 480 },
  { id: "l3", name: "Big Chicken Salad", ingredients: ["chicken thighs", "salad greens", "egg", "veggies", "dressing"], cost: 6, prepTime: 5, prepAhead: true, protein: 38, carbs: 12, calories: 420 },
  { id: "l4", name: "Quinoa Power Bowl", ingredients: ["quinoa", "chicken thighs", "sweet potato", "kale"], cost: 6.5, prepTime: 5, prepAhead: true, protein: 34, carbs: 48, calories: 540 },
  { id: "l5", name: "Turkey Lettuce Wraps", ingredients: ["ground turkey", "lettuce", "rice", "hoisin"], cost: 5, prepTime: 5, prepAhead: true, protein: 28, carbs: 30, calories: 380 },
  { id: "l6", name: "Mediterranean Bowl", ingredients: ["chicken thighs", "quinoa", "cucumber", "tomato", "feta", "hummus"], cost: 7, prepTime: 5, prepAhead: true, protein: 36, carbs: 42, calories: 520 },
  { id: "l7", name: "Asian Noodle Salad", ingredients: ["rice noodles", "chicken thighs", "edamame", "cabbage", "peanut sauce"], cost: 6, prepTime: 10, prepAhead: true, protein: 30, carbs: 50, calories: 510 },
  { id: "l8", name: "Burrito Bowl", ingredients: ["rice", "black beans", "chicken thighs", "corn", "salsa", "cheese"], cost: 5.5, prepTime: 5, prepAhead: true, protein: 38, carbs: 52, calories: 560 },
  { id: "l9", name: "Greek Salad + Chicken", ingredients: ["chicken thighs", "cucumber", "tomato", "olives", "feta", "greens"], cost: 7, prepTime: 5, prepAhead: true, protein: 35, carbs: 15, calories: 450 },
  { id: "l10", name: "Grain Bowl", ingredients: ["farro", "roasted veggies", "chicken thighs", "lemon dressing"], cost: 6.5, prepTime: 5, prepAhead: true, protein: 32, carbs: 48, calories: 500 },
];

const dinners = [
  { id: "d1", name: "Sheet Pan Salmon + Asparagus", ingredients: ["salmon", "asparagus", "rice", "lemon"], cost: 16, prepTime: 25, prepAhead: false, protein: 42, carbs: 35, calories: 580 },
  { id: "d2", name: "Chicken Stir Fry", ingredients: ["chicken thighs", "stir fry veggies", "soy sauce", "rice"], cost: 8, prepTime: 20, prepAhead: false, protein: 35, carbs: 48, calories: 520 },
  { id: "d3", name: "Turkey Marinara Pasta", ingredients: ["ground turkey", "pasta", "marinara", "parmesan"], cost: 9, prepTime: 25, prepAhead: false, protein: 32, carbs: 65, calories: 620 },
  { id: "d4", name: "Chicken Quesadillas", ingredients: ["chicken thighs", "tortillas", "cheese", "salsa", "guacamole"], cost: 8, prepTime: 15, prepAhead: false, protein: 38, carbs: 42, calories: 580 },
  { id: "d5", name: "Naan Pizza Night", ingredients: ["naan bread", "mozzarella", "tomato sauce", "toppings"], cost: 10, prepTime: 20, prepAhead: false, protein: 22, carbs: 55, calories: 540 },
  { id: "d6", name: "Shrimp Tacos", ingredients: ["shrimp", "tortillas", "cabbage slaw", "lime crema"], cost: 14, prepTime: 20, prepAhead: false, protein: 28, carbs: 38, calories: 480 },
  { id: "d7", name: "Slow Cooker Chili", ingredients: ["ground turkey", "beans", "tomatoes", "spices", "cheese"], cost: 10, prepTime: 15, prepAhead: true, protein: 35, carbs: 42, calories: 520 },
  { id: "d8", name: "Lemon Herb Chicken + Veggies", ingredients: ["chicken thighs", "potatoes", "green beans", "lemon"], cost: 9, prepTime: 35, prepAhead: false, protein: 38, carbs: 40, calories: 540 },
  { id: "d9", name: "Beef & Broccoli", ingredients: ["flank steak", "broccoli", "rice", "soy sauce"], cost: 14, prepTime: 20, prepAhead: false, protein: 38, carbs: 45, calories: 560 },
  { id: "d10", name: "Fish Tacos", ingredients: ["white fish", "tortillas", "cabbage", "chipotle mayo"], cost: 12, prepTime: 20, prepAhead: false, protein: 30, carbs: 35, calories: 460 },
  { id: "d11", name: "Chicken Fajitas", ingredients: ["chicken thighs", "bell peppers", "onions", "tortillas"], cost: 10, prepTime: 25, prepAhead: false, protein: 36, carbs: 42, calories: 520 },
  { id: "d12", name: "Garlic Butter Shrimp Pasta", ingredients: ["shrimp", "pasta", "garlic", "butter", "parsley"], cost: 14, prepTime: 20, prepAhead: false, protein: 32, carbs: 58, calories: 580 },
  { id: "d13", name: "Turkey Meatballs + Rice", ingredients: ["ground turkey", "rice", "marinara", "parmesan"], cost: 9, prepTime: 30, prepAhead: true, protein: 34, carbs: 50, calories: 540 },
  { id: "d14", name: "Honey Garlic Salmon", ingredients: ["salmon", "honey", "garlic", "broccoli", "rice"], cost: 15, prepTime: 25, prepAhead: false, protein: 40, carbs: 48, calories: 560 },
  { id: "d15", name: "Black Bean Tacos", ingredients: ["black beans", "tortillas", "cheese", "salsa", "avocado"], cost: 7, prepTime: 15, prepAhead: false, protein: 18, carbs: 52, calories: 480 },
];

const snacks = [
  { id: "s1", name: "Greek Yogurt + Honey", cost: 2, calories: 150 },
  { id: "s2", name: "Hummus + Veggies", cost: 2.5, calories: 180 },
  { id: "s3", name: "Apple + Almond Butter", cost: 2, calories: 220 },
  { id: "s4", name: "Cheese + Crackers", cost: 2.5, calories: 200 },
  { id: "s5", name: "Trail Mix", cost: 2, calories: 210 },
  { id: "s6", name: "Banana + Peanut Butter", cost: 1.5, calories: 250 },
  { id: "s7", name: "Hard Boiled Eggs", cost: 1, calories: 140 },
  { id: "s8", name: "Protein Bar", cost: 3, calories: 220 },
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

interface WeekPlan {
  days: DayPlan[];
  generatedAt: string;
  checkedItems: Record<string, boolean>;
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

  return { days, generatedAt: new Date().toISOString(), checkedItems: existingPlan?.checkedItems || {} };
}

function calculateWeeklyStats(plan: WeekPlan) {
  let totalCost = 0;
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;

  const allIngredients: string[] = [];
  const prepAheadMeals: { day: string; meal: string; name: string }[] = [];

  plan.days.forEach((day, i) => {
    // Cost (x2 for couple)
    totalCost += (day.breakfast.cost + day.lunch.cost + day.dinner.cost + day.snack.cost) * 2;

    // Macros (per person)
    totalCalories += day.breakfast.calories + day.lunch.calories + day.dinner.calories + day.snack.calories;
    totalProtein += day.breakfast.protein + day.lunch.protein + day.dinner.protein;
    totalCarbs += day.breakfast.carbs + day.lunch.carbs + day.dinner.carbs;

    // Ingredients
    allIngredients.push(...day.breakfast.ingredients, ...day.lunch.ingredients, ...day.dinner.ingredients);

    // Prep ahead
    if (day.breakfast.prepAhead) prepAheadMeals.push({ day: dayNames[i], meal: "Breakfast", name: day.breakfast.name });
    if (day.lunch.prepAhead) prepAheadMeals.push({ day: dayNames[i], meal: "Lunch", name: day.lunch.name });
    if (day.dinner.prepAhead) prepAheadMeals.push({ day: dayNames[i], meal: "Dinner", name: day.dinner.name });
  });

  // Deduplicate ingredients
  const ingredientCounts = allIngredients.reduce((acc, ing) => {
    acc[ing] = (acc[ing] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const groceryList = Object.entries(ingredientCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  return {
    totalCost: Math.round(totalCost),
    avgDailyCalories: Math.round(totalCalories / 7),
    avgDailyProtein: Math.round(totalProtein / 7),
    avgDailyCarbs: Math.round(totalCarbs / 7),
    groceryList,
    prepAheadMeals,
  };
}

export default function MealPlanner() {
  const [plan, setPlan] = useState<WeekPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const regeneratePlan = useCallback(() => {
    setPlan((current) => generateWeekPlan(current || undefined));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("meal-plan-v1");
    if (saved) {
      setPlan(JSON.parse(saved));
    } else {
      setPlan(generateWeekPlan());
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && plan) {
      localStorage.setItem("meal-plan-v1", JSON.stringify(plan));
    }
  }, [plan, isLoading]);

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
  };

  const toggleCheckedItem = (itemName: string) => {
    if (!plan) return;
    setPlan({
      ...plan,
      checkedItems: {
        ...plan.checkedItems,
        [itemName]: !plan.checkedItems[itemName],
      },
    });
  };

  const clearCheckedItems = () => {
    if (!plan) return;
    setPlan({ ...plan, checkedItems: {} });
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
  const isOverBudget = stats.totalCost > 150;

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
                <span className="text-base font-normal text-muted-foreground"> / $150</span>
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
            <TabsTrigger value="plan">Meal Plan</TabsTrigger>
            <TabsTrigger value="prep">Sunday Prep</TabsTrigger>
            <TabsTrigger value="grocery">Grocery List</TabsTrigger>
          </TabsList>

          {/* Meal Plan Tab */}
          <TabsContent value="plan" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              🔒 Lock meals you like, then shuffle to regenerate the rest
            </p>

            {plan.days.map((day, dayIndex) => (
              <Card key={dayIndex}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{dayNames[dayIndex]}</CardTitle>
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
            ))}
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
