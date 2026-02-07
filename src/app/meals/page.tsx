"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";

// Meal type with full recipe instructions
interface MealData {
  id: string;
  name: string;
  ingredients: { item: string; amount: string }[];
  cost: number;
  prepTime: number;
  cookTime: number;
  prepAhead: boolean;
  protein: number;
  carbs: number;
  calories: number;
  instructions: string[];
}

const breakfasts: MealData[] = [
  { 
    id: "b1", name: "Eggs & Toast", 
    ingredients: [{ item: "eggs", amount: "2" }, { item: "bread", amount: "2 slices" }, { item: "butter", amount: "1 tbsp" }],
    cost: 2.5, prepTime: 2, cookTime: 8, prepAhead: false, protein: 14, carbs: 25, calories: 320,
    instructions: ["Heat a non-stick pan over medium heat", "Add butter and let it melt", "Crack eggs into pan, season with salt & pepper", "Cook to desired doneness (3-4 min for over-easy)", "Toast bread while eggs cook", "Serve eggs on toast"]
  },
  { 
    id: "b2", name: "Breakfast Burrito", 
    ingredients: [{ item: "eggs", amount: "2" }, { item: "tortilla", amount: "1 large" }, { item: "cheese", amount: "¼ cup shredded" }, { item: "salsa", amount: "2 tbsp" }],
    cost: 3, prepTime: 3, cookTime: 7, prepAhead: true, protein: 16, carbs: 28, calories: 380,
    instructions: ["Scramble eggs in a pan over medium heat", "Warm tortilla in microwave for 15 seconds", "Place scrambled eggs in center of tortilla", "Top with cheese and salsa", "Fold sides in, then roll up burrito-style", "Optional: toast seam-side down in pan for crispiness"]
  },
  { 
    id: "b3", name: "Avocado Toast + Eggs", 
    ingredients: [{ item: "eggs", amount: "2" }, { item: "bread", amount: "2 slices" }, { item: "avocado", amount: "½" }, { item: "salt & pepper", amount: "to taste" }, { item: "red pepper flakes", amount: "pinch" }],
    cost: 4, prepTime: 3, cookTime: 7, prepAhead: false, protein: 16, carbs: 22, calories: 380,
    instructions: ["Toast bread until golden", "While bread toasts, fry or poach eggs", "Mash avocado with salt and pepper", "Spread avocado on toast", "Top with eggs", "Garnish with red pepper flakes"]
  },
  { 
    id: "b4", name: "Greek Yogurt Parfait", 
    ingredients: [{ item: "greek yogurt", amount: "1 cup" }, { item: "granola", amount: "¼ cup" }, { item: "berries", amount: "½ cup" }, { item: "honey", amount: "1 tbsp" }],
    cost: 4, prepTime: 5, cookTime: 0, prepAhead: false, protein: 18, carbs: 35, calories: 340,
    instructions: ["Add half the yogurt to a bowl or jar", "Layer with half the granola and berries", "Add remaining yogurt", "Top with rest of granola and berries", "Drizzle with honey", "Serve immediately (or granola gets soggy)"]
  },
  { 
    id: "b5", name: "Oatmeal with Banana", 
    ingredients: [{ item: "oats", amount: "½ cup" }, { item: "water or milk", amount: "1 cup" }, { item: "banana", amount: "1" }, { item: "peanut butter", amount: "1 tbsp" }, { item: "cinnamon", amount: "pinch" }],
    cost: 2, prepTime: 2, cookTime: 6, prepAhead: false, protein: 12, carbs: 52, calories: 380,
    instructions: ["Combine oats and water/milk in a pot", "Bring to a boil, then reduce to simmer", "Cook 5 minutes, stirring occasionally", "Slice banana", "Transfer oatmeal to bowl", "Top with banana slices, peanut butter, and cinnamon"]
  },
  { 
    id: "b6", name: "Veggie Scramble", 
    ingredients: [{ item: "eggs", amount: "3" }, { item: "spinach", amount: "1 cup" }, { item: "cheese", amount: "¼ cup" }, { item: "onion", amount: "¼ diced" }, { item: "olive oil", amount: "1 tsp" }],
    cost: 3, prepTime: 5, cookTime: 7, prepAhead: false, protein: 18, carbs: 8, calories: 280,
    instructions: ["Heat oil in pan over medium heat", "Sauté onion until softened (2-3 min)", "Add spinach, cook until wilted", "Beat eggs and pour into pan", "Stir gently as eggs cook", "Add cheese in last 30 seconds", "Season with salt & pepper"]
  },
  { 
    id: "b7", name: "Smoothie Bowl", 
    ingredients: [{ item: "greek yogurt", amount: "½ cup" }, { item: "frozen banana", amount: "1" }, { item: "frozen berries", amount: "½ cup" }, { item: "granola", amount: "¼ cup" }, { item: "milk", amount: "¼ cup" }],
    cost: 4.5, prepTime: 5, cookTime: 0, prepAhead: false, protein: 15, carbs: 42, calories: 360,
    instructions: ["Add yogurt, frozen banana, berries, and milk to blender", "Blend until thick and smooth (add more milk if needed)", "Pour into a bowl", "Top with granola", "Add any extra toppings (chia seeds, coconut, more fruit)", "Eat immediately with a spoon"]
  },
];

const lunches: MealData[] = [
  { 
    id: "l1", name: "Chicken Rice Bowl", 
    ingredients: [{ item: "cooked chicken", amount: "6 oz" }, { item: "cooked rice", amount: "1 cup" }, { item: "frozen veggies", amount: "1 cup" }, { item: "soy sauce", amount: "1 tbsp" }],
    cost: 5, prepTime: 2, cookTime: 3, prepAhead: true, protein: 35, carbs: 45, calories: 480,
    instructions: ["If meal prepped: microwave rice and chicken for 2 min", "Steam or microwave frozen veggies", "Combine in bowl", "Drizzle with soy sauce", "Mix and enjoy"]
  },
  { 
    id: "l2", name: "Turkey Taco Bowl", 
    ingredients: [{ item: "cooked ground turkey", amount: "5 oz" }, { item: "cooked rice", amount: "1 cup" }, { item: "black beans", amount: "½ cup" }, { item: "cheese", amount: "¼ cup" }, { item: "salsa", amount: "3 tbsp" }],
    cost: 5, prepTime: 2, cookTime: 3, prepAhead: true, protein: 32, carbs: 42, calories: 460,
    instructions: ["Heat rice and turkey in microwave (2 min)", "Warm beans (or use straight from can, drained)", "Layer rice, turkey, and beans in bowl", "Top with cheese and salsa", "Optional: add sour cream, lettuce, hot sauce"]
  },
  { 
    id: "l3", name: "Chicken Caesar Wrap", 
    ingredients: [{ item: "cooked chicken", amount: "5 oz sliced" }, { item: "large tortilla", amount: "1" }, { item: "romaine", amount: "1 cup chopped" }, { item: "parmesan", amount: "2 tbsp" }, { item: "caesar dressing", amount: "2 tbsp" }],
    cost: 5.5, prepTime: 5, cookTime: 0, prepAhead: true, protein: 34, carbs: 32, calories: 440,
    instructions: ["Lay tortilla flat", "Spread caesar dressing down the center", "Add chopped romaine", "Layer sliced chicken on top", "Sprinkle with parmesan", "Fold sides in, roll tightly", "Cut in half diagonally to serve"]
  },
  { 
    id: "l4", name: "Mediterranean Grain Bowl", 
    ingredients: [{ item: "cooked chicken", amount: "5 oz" }, { item: "cooked rice", amount: "1 cup" }, { item: "cucumber", amount: "½ cup diced" }, { item: "tomatoes", amount: "½ cup diced" }, { item: "feta", amount: "2 tbsp" }, { item: "olive oil", amount: "1 tbsp" }, { item: "lemon juice", amount: "1 tbsp" }],
    cost: 6, prepTime: 5, cookTime: 2, prepAhead: true, protein: 32, carbs: 48, calories: 480,
    instructions: ["Heat rice and chicken if cold", "Dice cucumber and tomatoes", "Arrange rice in bowl, top with chicken", "Add cucumber and tomatoes around the bowl", "Crumble feta on top", "Drizzle with olive oil and lemon juice", "Season with salt, pepper, oregano"]
  },
  { 
    id: "l5", name: "Asian Noodle Bowl", 
    ingredients: [{ item: "cooked chicken", amount: "5 oz" }, { item: "rice noodles", amount: "4 oz cooked" }, { item: "frozen stir fry veggies", amount: "1 cup" }, { item: "soy sauce", amount: "2 tbsp" }, { item: "sesame oil", amount: "1 tsp" }],
    cost: 5, prepTime: 2, cookTime: 3, prepAhead: true, protein: 30, carbs: 50, calories: 470,
    instructions: ["Heat noodles and chicken in microwave", "Steam or microwave veggies", "Combine in bowl", "Mix soy sauce and sesame oil", "Pour sauce over bowl and toss", "Optional: top with green onions, sesame seeds"]
  },
];

const dinners: MealData[] = [
  { 
    id: "d1", name: "Chicken Stir Fry + Rice", 
    ingredients: [{ item: "chicken breast", amount: "8 oz sliced" }, { item: "frozen stir fry veggies", amount: "2 cups" }, { item: "rice", amount: "1 cup cooked" }, { item: "soy sauce", amount: "3 tbsp" }, { item: "garlic", amount: "2 cloves minced" }, { item: "vegetable oil", amount: "1 tbsp" }],
    cost: 7, prepTime: 10, cookTime: 10, prepAhead: false, protein: 35, carbs: 48, calories: 520,
    instructions: ["Cook rice according to package (or use pre-cooked)", "Heat oil in large pan or wok over high heat", "Add chicken, cook until browned (4-5 min)", "Add garlic, cook 30 seconds", "Add frozen veggies, stir fry 3-4 min", "Pour in soy sauce, toss to coat", "Serve over rice"]
  },
  { 
    id: "d2", name: "Beef Tacos", 
    ingredients: [{ item: "ground beef", amount: "8 oz" }, { item: "small tortillas", amount: "4" }, { item: "cheese", amount: "½ cup shredded" }, { item: "salsa", amount: "¼ cup" }, { item: "onion", amount: "¼ diced" }, { item: "taco seasoning", amount: "1 tbsp" }],
    cost: 8, prepTime: 5, cookTime: 15, prepAhead: false, protein: 32, carbs: 38, calories: 520,
    instructions: ["Brown ground beef in skillet over medium-high heat", "Drain excess fat", "Add diced onion, cook 2 min", "Stir in taco seasoning and ¼ cup water", "Simmer 5 min until thickened", "Warm tortillas in dry pan or microwave", "Fill tortillas with beef, top with cheese and salsa"]
  },
  { 
    id: "d3", name: "Chicken Burrito Bowls", 
    ingredients: [{ item: "chicken breast", amount: "8 oz" }, { item: "rice", amount: "1 cup cooked" }, { item: "black beans", amount: "½ cup" }, { item: "cheese", amount: "¼ cup" }, { item: "salsa", amount: "¼ cup" }, { item: "avocado", amount: "½" }, { item: "cumin & chili powder", amount: "1 tsp each" }],
    cost: 8, prepTime: 5, cookTime: 10, prepAhead: false, protein: 38, carbs: 52, calories: 580,
    instructions: ["Season chicken with cumin, chili powder, salt", "Cook chicken in oiled pan 5-6 min per side until done", "Let rest 3 min, then slice", "Warm rice and beans", "Build bowl: rice base, then beans, then chicken", "Top with cheese, salsa, and sliced avocado", "Optional: add sour cream, lime juice"]
  },
  { 
    id: "d4", name: "Salmon with Roasted Veggies", 
    ingredients: [{ item: "salmon fillet", amount: "6 oz" }, { item: "broccoli", amount: "2 cups florets" }, { item: "potatoes", amount: "1 cup cubed" }, { item: "olive oil", amount: "2 tbsp" }, { item: "garlic powder", amount: "1 tsp" }, { item: "lemon", amount: "½" }],
    cost: 10, prepTime: 10, cookTime: 20, prepAhead: false, protein: 35, carbs: 30, calories: 480,
    instructions: ["Preheat oven to 425°F", "Toss potatoes with 1 tbsp oil, salt, pepper", "Spread on baking sheet, roast 10 min", "Toss broccoli with remaining oil and garlic powder", "Add broccoli to sheet, place salmon on top", "Season salmon with salt, pepper, lemon juice", "Roast 12-15 min until salmon flakes easily"]
  },
  { 
    id: "d5", name: "Turkey Bolognese Pasta", 
    ingredients: [{ item: "ground turkey", amount: "8 oz" }, { item: "pasta", amount: "8 oz" }, { item: "canned crushed tomatoes", amount: "1 can (14 oz)" }, { item: "onion", amount: "½ diced" }, { item: "garlic", amount: "3 cloves minced" }, { item: "Italian seasoning", amount: "1 tsp" }],
    cost: 7, prepTime: 5, cookTime: 20, prepAhead: false, protein: 32, carbs: 62, calories: 560,
    instructions: ["Cook pasta according to package, reserve ½ cup pasta water", "Brown turkey in large pan, breaking up with spoon", "Add onion, cook until soft (3 min)", "Add garlic and Italian seasoning, cook 1 min", "Pour in crushed tomatoes, simmer 10 min", "Add pasta water if sauce is too thick", "Toss pasta with sauce, serve with parmesan"]
  },
  { 
    id: "d6", name: "Shrimp Fried Rice", 
    ingredients: [{ item: "shrimp", amount: "8 oz peeled" }, { item: "cooked rice", amount: "2 cups (day-old best)" }, { item: "eggs", amount: "2" }, { item: "frozen peas & carrots", amount: "1 cup" }, { item: "soy sauce", amount: "3 tbsp" }, { item: "sesame oil", amount: "1 tsp" }],
    cost: 9, prepTime: 5, cookTime: 15, prepAhead: false, protein: 28, carbs: 52, calories: 500,
    instructions: ["Heat oil in large pan or wok over high heat", "Cook shrimp 2 min per side, set aside", "Scramble eggs in same pan, set aside", "Add more oil, stir fry veggies 2 min", "Add rice, break up clumps, cook 3 min", "Add soy sauce and sesame oil, toss", "Return shrimp and eggs, mix everything", "Serve hot, garnish with green onions"]
  },
  { 
    id: "d7", name: "Chicken Fajitas", 
    ingredients: [{ item: "chicken breast", amount: "8 oz sliced" }, { item: "bell peppers", amount: "2 sliced" }, { item: "onion", amount: "1 sliced" }, { item: "tortillas", amount: "4" }, { item: "fajita seasoning", amount: "1 tbsp" }, { item: "cheese", amount: "½ cup" }, { item: "lime", amount: "1" }],
    cost: 8, prepTime: 10, cookTime: 10, prepAhead: false, protein: 34, carbs: 35, calories: 490,
    instructions: ["Season chicken with fajita seasoning", "Heat oil in large skillet over high heat", "Cook chicken 5-6 min until done, set aside", "Add peppers and onions, cook 4-5 min until charred", "Return chicken to pan, squeeze lime over", "Warm tortillas", "Serve with cheese, sour cream, salsa"]
  },
  { 
    id: "d8", name: "Beef & Broccoli + Rice", 
    ingredients: [{ item: "ground beef", amount: "8 oz" }, { item: "broccoli", amount: "3 cups florets" }, { item: "rice", amount: "1 cup cooked" }, { item: "soy sauce", amount: "3 tbsp" }, { item: "garlic", amount: "2 cloves" }, { item: "brown sugar", amount: "1 tbsp" }, { item: "cornstarch", amount: "1 tsp" }],
    cost: 8, prepTime: 5, cookTime: 15, prepAhead: false, protein: 30, carbs: 48, calories: 530,
    instructions: ["Mix soy sauce, brown sugar, and cornstarch for sauce", "Brown beef in skillet, breaking into pieces", "Add garlic, cook 1 min", "Add broccoli and 2 tbsp water, cover and steam 4 min", "Pour sauce over, stir until thickened", "Serve over rice"]
  },
  { 
    id: "d9", name: "Baked Chicken Thighs + Potatoes", 
    ingredients: [{ item: "chicken thighs", amount: "4 bone-in" }, { item: "potatoes", amount: "1 lb cubed" }, { item: "onion", amount: "1 quartered" }, { item: "olive oil", amount: "2 tbsp" }, { item: "garlic powder", amount: "1 tsp" }, { item: "paprika", amount: "1 tsp" }, { item: "thyme", amount: "1 tsp" }],
    cost: 7, prepTime: 10, cookTime: 35, prepAhead: false, protein: 38, carbs: 35, calories: 520,
    instructions: ["Preheat oven to 425°F", "Toss potatoes and onion with 1 tbsp oil, salt, pepper", "Spread on baking sheet", "Rub chicken with remaining oil, garlic powder, paprika, thyme", "Place chicken on top of vegetables", "Bake 35-40 min until chicken reaches 165°F", "Let rest 5 min before serving"]
  },
  { 
    id: "d10", name: "Veggie Pasta Primavera", 
    ingredients: [{ item: "pasta", amount: "8 oz" }, { item: "frozen mixed veggies", amount: "2 cups" }, { item: "parmesan", amount: "½ cup grated" }, { item: "olive oil", amount: "3 tbsp" }, { item: "garlic", amount: "3 cloves" }, { item: "red pepper flakes", amount: "pinch" }],
    cost: 5, prepTime: 5, cookTime: 15, prepAhead: false, protein: 14, carbs: 68, calories: 480,
    instructions: ["Cook pasta according to package, reserve 1 cup pasta water", "Heat oil in large pan over medium heat", "Add garlic and red pepper flakes, cook 1 min", "Add frozen veggies, sauté 5 min until tender", "Add pasta and ½ cup pasta water", "Toss with parmesan until creamy", "Add more pasta water if needed, season to taste"]
  },
  { 
    id: "d11", name: "Black Bean Quesadillas", 
    ingredients: [{ item: "black beans", amount: "1 can drained" }, { item: "large tortillas", amount: "2" }, { item: "cheese", amount: "1 cup shredded" }, { item: "salsa", amount: "¼ cup" }, { item: "avocado", amount: "1" }, { item: "cumin", amount: "½ tsp" }],
    cost: 6, prepTime: 5, cookTime: 10, prepAhead: false, protein: 20, carbs: 52, calories: 520,
    instructions: ["Mash half the beans with cumin, leave rest whole", "Spread bean mixture on half of each tortilla", "Add whole beans, cheese, and a spoonful of salsa", "Fold tortillas in half", "Cook in dry skillet 3 min per side until golden", "Slice into wedges", "Serve with remaining salsa and sliced avocado"]
  },
  { 
    id: "d12", name: "Lemon Herb Salmon + Rice", 
    ingredients: [{ item: "salmon fillet", amount: "6 oz" }, { item: "rice", amount: "1 cup cooked" }, { item: "asparagus", amount: "1 bunch trimmed" }, { item: "lemon", amount: "1" }, { item: "olive oil", amount: "2 tbsp" }, { item: "dill or parsley", amount: "2 tbsp fresh" }],
    cost: 11, prepTime: 5, cookTime: 15, prepAhead: false, protein: 36, carbs: 42, calories: 500,
    instructions: ["Heat oil in oven-safe skillet over medium-high", "Season salmon with salt, pepper, half the lemon zest", "Sear salmon skin-side up 3 min", "Flip salmon, add asparagus around it", "Squeeze lemon juice over everything", "Bake at 400°F for 8-10 min", "Garnish with fresh herbs, serve with rice"]
  },
];

type Meal = MealData;

interface DayPlan {
  breakfast: typeof breakfasts[0];
  lunch: typeof lunches[0];
  dinner: typeof dinners[0];
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

// Meal preferences: 1 = dislike, 2 = like
type Preferences = Record<string, Record<string, number>>; // mealId -> { person: rating }

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
  // Shuffle all options
  const shuffledBreakfasts = shuffleArray(breakfasts);
  const shuffledDinners = shuffleArray(dinners);
  const shuffledLunches = shuffleArray(lunches);
  
  // Pick 2 breakfasts (alternating pattern: A, B, A, B, A, B, A)
  const breakfastA = shuffledBreakfasts[0];
  const breakfastB = shuffledBreakfasts[1];
  
  // Pick 2 lunches for weekdays: 2 days of one, 3 days of another (Mon-Fri only)
  // Pattern: A, A, B, B, B (or randomly swap which gets 2 vs 3)
  const lunchA = shuffledLunches[0];
  const lunchB = shuffledLunches[1];
  const lunchPattern = Math.random() > 0.5 
    ? [lunchA, lunchA, lunchB, lunchB, lunchB, lunchA, lunchB] // weekends get variety
    : [lunchB, lunchB, lunchA, lunchA, lunchA, lunchB, lunchA];
  
  // Dinners: different every night (7 unique)
  const weekDinners = shuffledDinners.slice(0, 7);
  
  const days: DayPlan[] = [];

  for (let i = 0; i < 7; i++) {
    days.push({
      // Breakfasts: 2 types alternating (A, B, A, B, A, B, A)
      breakfast: i % 2 === 0 ? breakfastA : breakfastB,
      // Lunches: 2 types batched (2 days + 3 days for weekdays)
      lunch: lunchPattern[i],
      // Dinners: different every night
      dinner: weekDinners[i],
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

// Revise a single meal - pick a different option
function reviseMeal(plan: WeekPlan, dayIndex: number, mealType: "breakfast" | "lunch" | "dinner"): WeekPlan {
  const currentMeal = plan.days[dayIndex][mealType];
  const mealList = mealType === "breakfast" ? breakfasts : mealType === "lunch" ? lunches : dinners;
  
  // Get a different meal than the current one
  const otherMeals = mealList.filter(m => m.id !== currentMeal.id);
  const newMeal = otherMeals[Math.floor(Math.random() * otherMeals.length)];
  
  const newDays = [...plan.days];
  newDays[dayIndex] = { ...newDays[dayIndex], [mealType]: newMeal };
  
  return { ...plan, days: newDays };
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
    totalCost += (day.breakfast.cost + day.lunch.cost + day.dinner.cost) * peopleCount;

    // Macros (per person, averaged later)
    totalCalories += (day.breakfast.calories + day.lunch.calories + day.dinner.calories) * peopleCount;
    totalProtein += (day.breakfast.protein + day.lunch.protein + day.dinner.protein) * peopleCount;
    totalCarbs += (day.breakfast.carbs + day.lunch.carbs + day.dinner.carbs) * peopleCount;

    // Ingredients with multiplier based on people count
    [...day.breakfast.ingredients, ...day.lunch.ingredients, ...day.dinner.ingredients].forEach(ing => {
      allIngredients.push(ing.item);
      ingredientMultipliers[ing.item] = (ingredientMultipliers[ing.item] || 0) + peopleCount;
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
  const [preferences, setPreferences] = useState<Preferences>({});
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

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

  // Rate a meal (like/dislike)
  const rateMeal = async (mealId: string, mealType: string, mealName: string, rating: number) => {
    try {
      // Toggle: if same rating, remove it; otherwise set new rating
      const currentRating = preferences[mealId]?.household;
      if (currentRating === rating) {
        // Remove the rating
        await fetch(`/api/meals/preferences?mealId=${mealId}`, { method: "DELETE" });
        setPreferences((prev) => {
          const updated = { ...prev };
          delete updated[mealId];
          return updated;
        });
      } else {
        // Set new rating
        await fetch("/api/meals/preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mealId, mealType, mealName, rating }),
        });
        setPreferences((prev) => ({
          ...prev,
          [mealId]: { ...prev[mealId], household: rating },
        }));
      }
    } catch (error) {
      console.error("Failed to save preference:", error);
    }
  };

  // Helper to hydrate saved meals with current definitions (in case DB has old data)
  const hydrateMeal = useCallback((savedMeal: { id: string }, type: "breakfast" | "lunch" | "dinner"): Meal => {
    const mealList = type === "breakfast" ? breakfasts : type === "lunch" ? lunches : dinners;
    return mealList.find(m => m.id === savedMeal.id) || mealList[0];
  }, []);

  // Load from database
  useEffect(() => {
    async function loadData() {
      try {
        // Load meal plan and preferences in parallel
        const [planResponse, prefsResponse] = await Promise.all([
          fetch("/api/meals"),
          fetch("/api/meals/preferences"),
        ]);
        
        // Load preferences
        if (prefsResponse.ok) {
          const prefsData = await prefsResponse.json();
          setPreferences(prefsData.preferences || {});
        }
        
        // Load plan
        if (planResponse.ok) {
          const data = await planResponse.json();
          if (data && data.planData) {
            const defaultAttendance = Array(7).fill(null).map(() => ({ andrew: true, olivia: true }));
            // Hydrate saved meals with current definitions (ensures all fields like instructions exist)
            const hydratedDays = data.planData.map((day: DayPlan) => ({
              breakfast: hydrateMeal(day.breakfast, "breakfast"),
              lunch: hydrateMeal(day.lunch, "lunch"),
              dinner: hydrateMeal(day.dinner, "dinner"),
            }));
            setPlan({
              days: hydratedDays,
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
    loadData();
  }, [savePlanToDb, hydrateMeal]);

  // Revise a single meal - swap it for a different option
  const handleRevise = (dayIndex: number, mealType: "breakfast" | "lunch" | "dinner") => {
    if (!plan) return;
    const newPlan = reviseMeal(plan, dayIndex, mealType);
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
              📖 Click a meal for the recipe • 🔄 Revise to swap • 👍👎 Rate to improve suggestions
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
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Breakfast */}
                    <MealCard
                      label="Breakfast"
                      meal={day.breakfast}
                      onRevise={() => handleRevise(dayIndex, "breakfast")}
                      onClick={() => setSelectedMeal(day.breakfast)}
                      rating={preferences[day.breakfast.id]?.household}
                      onRate={(r) => rateMeal(day.breakfast.id, "breakfast", day.breakfast.name, r)}
                    />
                    {/* Lunch */}
                    <MealCard
                      label="Lunch"
                      meal={day.lunch}
                      onRevise={() => handleRevise(dayIndex, "lunch")}
                      onClick={() => setSelectedMeal(day.lunch)}
                      rating={preferences[day.lunch.id]?.household}
                      onRate={(r) => rateMeal(day.lunch.id, "lunch", day.lunch.name, r)}
                    />
                    {/* Dinner */}
                    <MealCard
                      label="Dinner"
                      meal={day.dinner}
                      onRevise={() => handleRevise(dayIndex, "dinner")}
                      onClick={() => setSelectedMeal(day.dinner)}
                      rating={preferences[day.dinner.id]?.household}
                      onRate={(r) => rateMeal(day.dinner.id, "dinner", day.dinner.name, r)}
                    />
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
                <div className="space-y-4">
                  {/* Proteins to batch cook */}
                  {(() => {
                    const proteins = stats.groceryList.filter((i) => 
                      ["chicken", "ground turkey", "ground beef"].includes(i.name)
                    );
                    if (proteins.length === 0) return null;
                    return (
                      <div className="p-4 rounded-lg border border-border bg-muted/30">
                        <h3 className="font-medium mb-3">🍗 Proteins to Cook</h3>
                        <ul className="space-y-2 text-sm">
                          {proteins.map((item) => (
                            <li key={item.name} className="flex items-center gap-2">
                              <span className="w-4 h-4 rounded border border-border" />
                              <span className="capitalize">{item.name}</span>
                              <span className="text-muted-foreground">(×{item.count} servings)</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })()}

                  {/* Grains to batch cook */}
                  {(() => {
                    const grains = stats.groceryList.filter((i) => 
                      ["rice", "pasta"].includes(i.name)
                    );
                    if (grains.length === 0) return null;
                    return (
                      <div className="p-4 rounded-lg border border-border bg-muted/30">
                        <h3 className="font-medium mb-3">🍚 Grains to Cook</h3>
                        <ul className="space-y-2 text-sm">
                          {grains.map((item) => (
                            <li key={item.name} className="flex items-center gap-2">
                              <span className="w-4 h-4 rounded border border-border" />
                              <span className="capitalize">{item.name}</span>
                              <span className="text-muted-foreground">(×{item.count} servings)</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })()}

                  {/* Breakfast prep - 2 types alternating */}
                  <div className="p-4 rounded-lg border border-border bg-muted/30">
                    <h3 className="font-medium mb-3">🍳 Breakfasts (2 types, alternating)</h3>
                    <ul className="space-y-2 text-sm">
                      {Array.from(new Set(plan.days.map(d => d.breakfast.name))).map((name) => {
                        const count = plan.days.filter(d => d.breakfast.name === name).length;
                        const meal = plan.days.find(d => d.breakfast.name === name)?.breakfast;
                        return (
                          <li key={name} className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded border border-border" />
                            <span>{name}</span>
                            <Badge variant="secondary" className="text-xs">×{count} days</Badge>
                            {meal?.prepAhead && <Badge variant="outline" className="text-xs">prep ahead</Badge>}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Lunch prep - 2 types batched */}
                  <div className="p-4 rounded-lg border border-border bg-muted/30">
                    <h3 className="font-medium mb-3">🥡 Lunches (2 types, batch prep)</h3>
                    <ul className="space-y-2 text-sm">
                      {Array.from(new Set(plan.days.map(d => d.lunch.name))).map((lunchName) => {
                        const count = plan.days.filter(d => d.lunch.name === lunchName).length;
                        return (
                          <li key={lunchName} className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded border border-border" />
                            <span>{lunchName}</span>
                            <Badge variant="secondary" className="text-xs">×{count} days</Badge>
                          </li>
                        );
                      })}
                    </ul>
                    <p className="text-xs text-muted-foreground mt-3">
                      💡 Prep all portions Sunday, store in containers for grab-and-go lunches
                    </p>
                  </div>

                  {/* Other prep-ahead meals */}
                  {stats.prepAheadMeals.filter(m => m.meal !== "Lunch").length > 0 && (
                    <div className="p-4 rounded-lg border border-border bg-muted/30">
                      <h3 className="font-medium mb-3">📋 Other Prep-Ahead</h3>
                      <ul className="space-y-2 text-sm">
                        {stats.prepAheadMeals.filter(m => m.meal !== "Lunch").map((meal, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded border border-border" />
                            <span>{meal.name}</span>
                            <Badge variant="outline" className="text-xs">{meal.day} {meal.meal}</Badge>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Grocery List Tab */}
          <TabsContent value="grocery">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>🛒 Grocery List</CardTitle>
                    <CardDescription>Based on this week&apos;s meal plan</CardDescription>
                  </div>
                  {checkedCount > 0 && (
                    <Button variant="outline" size="sm" onClick={clearCheckedItems}>
                      Reset
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Group ingredients by category */}
                {(() => {
                  const categories: Record<string, string[]> = {
                    protein: ["chicken", "ground beef", "ground turkey", "salmon", "shrimp", "eggs"],
                    dairy: ["cheese", "greek yogurt", "feta", "parmesan"],
                    produce: ["avocado", "banana", "berries", "spinach", "onion", "garlic", "bell peppers", "broccoli", "asparagus", "romaine", "cucumber", "tomatoes", "lemon", "potatoes"],
                    carbs: ["rice", "pasta", "tortillas", "bread", "rice noodles", "oats", "granola"],
                    pantry: ["beans", "salsa", "soy sauce", "olive oil", "peanut butter", "canned tomatoes", "trail mix"],
                    frozen: ["frozen veggies"],
                  };
                  
                  const categoryNames: Record<string, string> = {
                    protein: "🥩 Protein",
                    dairy: "🧀 Dairy",
                    produce: "🥬 Produce",
                    carbs: "🍚 Carbs & Grains",
                    pantry: "🥫 Pantry",
                    frozen: "❄️ Frozen",
                  };
                  
                  const categorized: Record<string, typeof stats.groceryList> = {};
                  stats.groceryList.forEach((item) => {
                    const cat = Object.entries(categories).find(([, items]) => items.includes(item.name))?.[0] || "other";
                    if (!categorized[cat]) categorized[cat] = [];
                    categorized[cat].push(item);
                  });
                  
                  return (
                    <div className="space-y-6">
                      {Object.entries(categorized).map(([cat, items]) => (
                        <div key={cat}>
                          <h3 className="font-medium mb-3 text-sm text-muted-foreground">{categoryNames[cat] || "📦 Other"}</h3>
                          <div className="space-y-2">
                            {items.map((item) => (
                              <GroceryItem
                                key={item.name}
                                item={item}
                                checked={plan?.checkedItems[item.name] || false}
                                onToggle={() => toggleCheckedItem(item.name)}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground">
                    <strong>{stats.groceryList.length} items</strong> for {stats.totalPeopleDays} person-days of meals.
                    Estimated: <strong>${Math.round(stats.totalCost * 0.5)}-${Math.round(stats.totalCost * 0.7)}</strong> at NYC grocery stores.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

                  </Tabs>

        {/* Recipe Modal */}
        <Dialog open={!!selectedMeal} onOpenChange={(open) => !open && setSelectedMeal(null)}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            {selectedMeal && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl">{selectedMeal.name}</DialogTitle>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                    <span>⏱️ {selectedMeal.prepTime + selectedMeal.cookTime} min total</span>
                    <span>•</span>
                    <span>{selectedMeal.calories} cal</span>
                    <span>•</span>
                    <span>{selectedMeal.protein}g protein</span>
                  </div>
                </DialogHeader>
                
                <div className="space-y-4 mt-4">
                  {/* Time breakdown */}
                  <div className="flex gap-4 text-sm">
                    <div className="bg-muted/50 rounded-lg px-3 py-2">
                      <span className="text-muted-foreground">Prep:</span> {selectedMeal.prepTime} min
                    </div>
                    <div className="bg-muted/50 rounded-lg px-3 py-2">
                      <span className="text-muted-foreground">Cook:</span> {selectedMeal.cookTime} min
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div>
                    <h3 className="font-semibold mb-2">Ingredients</h3>
                    <ul className="space-y-1">
                      {selectedMeal.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span className="capitalize">{ing.amount} {ing.item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Instructions */}
                  <div>
                    <h3 className="font-semibold mb-2">Instructions</h3>
                    <ol className="space-y-2">
                      {selectedMeal.instructions.map((step, i) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                            {i + 1}
                          </span>
                          <span className="pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
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
  onRevise,
  onClick,
  rating,
  onRate,
}: {
  label: string;
  meal: Meal;
  onRevise: () => void;
  onClick: () => void;
  rating?: number; // 1 = dislike, 2 = like
  onRate?: (rating: number) => void;
}) {
  return (
    <div className="p-3 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
        <div className="flex items-center gap-1">
          {onRate && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onRate(1); }}
                className={`text-sm p-1 rounded hover:bg-muted transition-colors ${rating === 1 ? "bg-red-500/20 text-red-500" : "opacity-40 hover:opacity-100"}`}
                title="Dislike"
              >
                👎
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onRate(2); }}
                className={`text-sm p-1 rounded hover:bg-muted transition-colors ${rating === 2 ? "bg-green-500/20 text-green-500" : "opacity-40 hover:opacity-100"}`}
                title="Like"
              >
                👍
              </button>
            </>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); onRevise(); }}
            className="text-sm p-1 rounded hover:bg-muted transition-colors opacity-60 hover:opacity-100"
            title="Revise - pick a different meal"
          >
            🔄
          </button>
        </div>
      </div>
      <button onClick={onClick} className="text-left w-full group">
        <p className="font-medium text-sm group-hover:text-primary transition-colors">{meal.name}</p>
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <span className="text-primary/80">⏱️ {meal.prepTime + meal.cookTime} min</span>
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
        <p className="text-xs text-primary/60 mt-2">Click for recipe →</p>
      </button>
    </div>
  );
}
