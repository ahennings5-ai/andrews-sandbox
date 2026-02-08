"use client";

import React, { useState, useEffect, useCallback } from "react";
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
    cost: 3.5, prepTime: 5, cookTime: 0, prepAhead: false, protein: 15, carbs: 42, calories: 360,
    instructions: ["Add yogurt, frozen banana, berries, and milk to blender", "Blend until thick and smooth (add more milk if needed)", "Pour into a bowl", "Top with granola", "Add any extra toppings (chia seeds, coconut, more fruit)", "Eat immediately with a spoon"]
  },
  { 
    id: "b8", name: "Bagel with Cream Cheese & Lox", 
    ingredients: [{ item: "bagel", amount: "1" }, { item: "cream cheese", amount: "2 tbsp" }, { item: "smoked salmon", amount: "2 oz" }, { item: "capers", amount: "1 tsp" }, { item: "red onion", amount: "2 slices" }],
    cost: 8, prepTime: 5, cookTime: 2, prepAhead: false, protein: 18, carbs: 48, calories: 420,
    instructions: ["Slice and toast bagel", "Spread cream cheese on both halves", "Layer smoked salmon on top", "Add capers and thin red onion slices", "Season with pepper", "Optional: add fresh dill or lemon squeeze"]
  },
  { 
    id: "b9", name: "Protein Pancakes", 
    ingredients: [{ item: "pancake mix", amount: "1 cup" }, { item: "protein powder", amount: "1 scoop" }, { item: "egg", amount: "1" }, { item: "milk", amount: "¾ cup" }, { item: "maple syrup", amount: "2 tbsp" }],
    cost: 3.5, prepTime: 5, cookTime: 10, prepAhead: true, protein: 28, carbs: 55, calories: 450,
    instructions: ["Mix pancake mix and protein powder", "Add egg and milk, whisk until smooth", "Heat greased pan over medium heat", "Pour ¼ cup batter per pancake", "Cook until bubbles form, flip, cook 1-2 min more", "Stack and top with maple syrup"]
  },
  { 
    id: "b10", name: "Peanut Butter Banana Toast", 
    ingredients: [{ item: "bread", amount: "2 slices" }, { item: "peanut butter", amount: "2 tbsp" }, { item: "banana", amount: "1" }, { item: "honey", amount: "1 tsp" }, { item: "chia seeds", amount: "1 tsp" }],
    cost: 2.5, prepTime: 3, cookTime: 2, prepAhead: false, protein: 12, carbs: 48, calories: 380,
    instructions: ["Toast bread until golden", "Spread peanut butter on toast", "Slice banana and arrange on top", "Drizzle with honey", "Sprinkle chia seeds", "Serve immediately"]
  },
  { 
    id: "b11", name: "Egg & Cheese Sandwich", 
    ingredients: [{ item: "english muffin", amount: "1" }, { item: "eggs", amount: "2" }, { item: "cheese", amount: "1 slice" }, { item: "butter", amount: "1 tbsp" }],
    cost: 3, prepTime: 2, cookTime: 8, prepAhead: false, protein: 18, carbs: 28, calories: 380,
    instructions: ["Toast english muffin", "Melt butter in pan over medium heat", "Fry eggs to your preference", "Place cheese on eggs to melt slightly", "Assemble sandwich with eggs between muffin halves", "Season with salt & pepper"]
  },
  { 
    id: "b12", name: "Cottage Cheese & Fruit", 
    ingredients: [{ item: "cottage cheese", amount: "1 cup" }, { item: "berries", amount: "½ cup" }, { item: "honey", amount: "1 tbsp" }, { item: "almonds", amount: "2 tbsp sliced" }],
    cost: 4, prepTime: 3, cookTime: 0, prepAhead: false, protein: 28, carbs: 25, calories: 320,
    instructions: ["Add cottage cheese to bowl", "Top with fresh berries", "Drizzle honey over top", "Sprinkle sliced almonds", "Mix gently or eat layered", "Great cold protein boost"]
  },
  { 
    id: "b13", name: "French Toast", 
    ingredients: [{ item: "bread", amount: "3 slices thick" }, { item: "eggs", amount: "2" }, { item: "milk", amount: "¼ cup" }, { item: "cinnamon", amount: "½ tsp" }, { item: "butter", amount: "1 tbsp" }, { item: "maple syrup", amount: "2 tbsp" }],
    cost: 3, prepTime: 5, cookTime: 10, prepAhead: false, protein: 16, carbs: 52, calories: 420,
    instructions: ["Whisk eggs, milk, and cinnamon in shallow dish", "Heat butter in pan over medium heat", "Dip bread slices in egg mixture, coating both sides", "Cook 2-3 min per side until golden", "Serve with maple syrup", "Optional: add powdered sugar or berries"]
  },
  { 
    id: "b14", name: "Overnight Oats", 
    ingredients: [{ item: "oats", amount: "½ cup" }, { item: "milk", amount: "½ cup" }, { item: "greek yogurt", amount: "¼ cup" }, { item: "honey", amount: "1 tbsp" }, { item: "berries", amount: "¼ cup" }, { item: "chia seeds", amount: "1 tbsp" }],
    cost: 3, prepTime: 5, cookTime: 0, prepAhead: true, protein: 15, carbs: 48, calories: 350,
    instructions: ["Combine oats, milk, yogurt, honey, and chia in jar", "Stir well to combine", "Refrigerate overnight (or at least 4 hours)", "In morning, stir and top with berries", "Eat cold or microwave 1 min if preferred warm", "Keeps 3 days in fridge"]
  },
  { 
    id: "b15", name: "Ham & Cheese Croissant", 
    ingredients: [{ item: "croissant", amount: "1" }, { item: "deli ham", amount: "2 oz" }, { item: "swiss cheese", amount: "1 slice" }, { item: "dijon mustard", amount: "1 tsp" }],
    cost: 4, prepTime: 2, cookTime: 5, prepAhead: false, protein: 16, carbs: 28, calories: 380,
    instructions: ["Slice croissant in half horizontally", "Spread dijon on bottom half", "Layer ham and swiss cheese", "Top with other croissant half", "Optional: warm in oven 3 min at 350°F", "Serve warm"]
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
  { 
    id: "l6", name: "Tuna Salad Sandwich", 
    ingredients: [{ item: "canned tuna", amount: "5 oz drained" }, { item: "bread", amount: "2 slices" }, { item: "mayo", amount: "2 tbsp" }, { item: "celery", amount: "2 tbsp diced" }, { item: "lettuce", amount: "2 leaves" }],
    cost: 4.5, prepTime: 5, cookTime: 0, prepAhead: true, protein: 30, carbs: 28, calories: 380,
    instructions: ["Drain tuna and add to bowl", "Mix with mayo and diced celery", "Season with salt, pepper, lemon juice if desired", "Toast bread if preferred", "Layer tuna salad and lettuce between bread", "Cut in half and serve"]
  },
  { 
    id: "l7", name: "Caprese Pasta Salad", 
    ingredients: [{ item: "pasta", amount: "4 oz cooked" }, { item: "cherry tomatoes", amount: "1 cup halved" }, { item: "mozzarella", amount: "4 oz cubed" }, { item: "basil", amount: "¼ cup fresh" }, { item: "olive oil", amount: "2 tbsp" }, { item: "balsamic", amount: "1 tbsp" }],
    cost: 6, prepTime: 10, cookTime: 0, prepAhead: true, protein: 20, carbs: 45, calories: 450,
    instructions: ["Cook pasta, drain and cool", "Halve tomatoes, cube mozzarella", "Combine pasta, tomatoes, and mozzarella", "Chiffonade basil and add", "Drizzle with olive oil and balsamic", "Season with salt and pepper, toss gently"]
  },
  { 
    id: "l8", name: "Buffalo Chicken Wrap", 
    ingredients: [{ item: "cooked chicken", amount: "5 oz shredded" }, { item: "large tortilla", amount: "1" }, { item: "buffalo sauce", amount: "2 tbsp" }, { item: "ranch dressing", amount: "1 tbsp" }, { item: "lettuce", amount: "1 cup shredded" }, { item: "blue cheese", amount: "2 tbsp crumbled" }],
    cost: 5.5, prepTime: 5, cookTime: 2, prepAhead: true, protein: 32, carbs: 30, calories: 440,
    instructions: ["Toss shredded chicken with buffalo sauce", "Warm tortilla in microwave 15 seconds", "Spread ranch down center of tortilla", "Add buffalo chicken", "Top with lettuce and blue cheese", "Roll tightly, cut in half"]
  },
  { 
    id: "l9", name: "Greek Salad with Chicken", 
    ingredients: [{ item: "cooked chicken", amount: "5 oz" }, { item: "romaine", amount: "3 cups chopped" }, { item: "cucumber", amount: "½ cup" }, { item: "tomatoes", amount: "½ cup" }, { item: "feta", amount: "¼ cup" }, { item: "olives", amount: "¼ cup" }, { item: "olive oil", amount: "2 tbsp" }, { item: "red wine vinegar", amount: "1 tbsp" }],
    cost: 7, prepTime: 10, cookTime: 0, prepAhead: true, protein: 35, carbs: 15, calories: 420,
    instructions: ["Chop romaine and place in large bowl", "Dice cucumber and tomatoes", "Add veggies, feta, and olives to lettuce", "Slice or cube chicken and add on top", "Whisk olive oil and vinegar, drizzle over salad", "Season with oregano, salt, pepper, toss"]
  },
  { 
    id: "l10", name: "BBQ Chicken Quesadilla", 
    ingredients: [{ item: "cooked chicken", amount: "4 oz shredded" }, { item: "large tortilla", amount: "1" }, { item: "bbq sauce", amount: "2 tbsp" }, { item: "cheese", amount: "½ cup shredded" }, { item: "red onion", amount: "2 tbsp diced" }],
    cost: 4.5, prepTime: 3, cookTime: 6, prepAhead: true, protein: 30, carbs: 35, calories: 450,
    instructions: ["Mix shredded chicken with BBQ sauce", "Place tortilla in dry skillet over medium heat", "Add cheese to half the tortilla", "Top with BBQ chicken and onion", "Fold tortilla in half", "Cook 3 min per side until golden and cheese melts", "Cut into wedges"]
  },
  { 
    id: "l11", name: "Hummus & Veggie Wrap", 
    ingredients: [{ item: "large tortilla", amount: "1" }, { item: "hummus", amount: "¼ cup" }, { item: "cucumber", amount: "½ cup sliced" }, { item: "tomato", amount: "½ sliced" }, { item: "spinach", amount: "1 cup" }, { item: "feta", amount: "2 tbsp" }],
    cost: 4, prepTime: 5, cookTime: 0, prepAhead: true, protein: 12, carbs: 38, calories: 320,
    instructions: ["Spread hummus evenly over tortilla", "Layer spinach leaves", "Add cucumber and tomato slices", "Crumble feta on top", "Roll tightly", "Cut in half diagonally"]
  },
  { 
    id: "l12", name: "Leftover Dinner Bowl", 
    ingredients: [{ item: "leftover protein", amount: "5 oz" }, { item: "cooked rice or grain", amount: "1 cup" }, { item: "leftover veggies", amount: "1 cup" }, { item: "sauce of choice", amount: "2 tbsp" }],
    cost: 3, prepTime: 2, cookTime: 3, prepAhead: true, protein: 28, carbs: 40, calories: 400,
    instructions: ["Microwave leftovers until heated through", "Combine in bowl", "Add your sauce (soy, teriyaki, hot sauce, etc.)", "Mix and enjoy", "Great for reducing food waste!"]
  },
  { 
    id: "l13", name: "Chicken Salad Lettuce Wraps", 
    ingredients: [{ item: "cooked chicken", amount: "6 oz diced" }, { item: "mayo", amount: "2 tbsp" }, { item: "grapes", amount: "¼ cup halved" }, { item: "celery", amount: "2 tbsp diced" }, { item: "butter lettuce", amount: "4 leaves" }, { item: "almonds", amount: "2 tbsp sliced" }],
    cost: 6, prepTime: 10, cookTime: 0, prepAhead: true, protein: 35, carbs: 12, calories: 380,
    instructions: ["Dice chicken into small pieces", "Mix with mayo, grapes, celery, and almonds", "Season with salt and pepper", "Wash and dry lettuce cups", "Spoon chicken salad into lettuce cups", "Serve immediately"]
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
    cost: 16, prepTime: 10, cookTime: 20, prepAhead: false, protein: 35, carbs: 30, calories: 480,
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
    cost: 14, prepTime: 5, cookTime: 15, prepAhead: false, protein: 28, carbs: 52, calories: 500,
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
    cost: 17, prepTime: 5, cookTime: 15, prepAhead: false, protein: 36, carbs: 42, calories: 500,
    instructions: ["Heat oil in oven-safe skillet over medium-high", "Season salmon with salt, pepper, half the lemon zest", "Sear salmon skin-side up 3 min", "Flip salmon, add asparagus around it", "Squeeze lemon juice over everything", "Bake at 400°F for 8-10 min", "Garnish with fresh herbs, serve with rice"]
  },
  { 
    id: "d13", name: "Teriyaki Chicken Bowl", 
    ingredients: [{ item: "chicken thighs", amount: "8 oz boneless" }, { item: "rice", amount: "1 cup cooked" }, { item: "broccoli", amount: "2 cups" }, { item: "teriyaki sauce", amount: "¼ cup" }, { item: "sesame seeds", amount: "1 tsp" }, { item: "green onions", amount: "2 sliced" }],
    cost: 7, prepTime: 5, cookTime: 15, prepAhead: false, protein: 35, carbs: 50, calories: 520,
    instructions: ["Cut chicken into bite-size pieces", "Cook chicken in oiled pan 6-7 min until done", "Steam broccoli until tender-crisp", "Add teriyaki sauce to chicken, coat well", "Serve chicken and broccoli over rice", "Garnish with sesame seeds and green onions"]
  },
  { 
    id: "d14", name: "Spaghetti & Meatballs", 
    ingredients: [{ item: "ground beef", amount: "8 oz" }, { item: "spaghetti", amount: "8 oz" }, { item: "marinara sauce", amount: "2 cups" }, { item: "breadcrumbs", amount: "¼ cup" }, { item: "egg", amount: "1" }, { item: "parmesan", amount: "¼ cup" }, { item: "Italian seasoning", amount: "1 tsp" }],
    cost: 8, prepTime: 15, cookTime: 20, prepAhead: false, protein: 35, carbs: 65, calories: 600,
    instructions: ["Mix beef, breadcrumbs, egg, half the parmesan, and seasoning", "Form into 8-10 meatballs", "Brown meatballs in oiled pan on all sides", "Add marinara, cover and simmer 15 min", "Cook spaghetti according to package", "Serve meatballs and sauce over spaghetti", "Top with remaining parmesan"]
  },
  { 
    id: "d15", name: "Honey Garlic Shrimp + Veggies", 
    ingredients: [{ item: "shrimp", amount: "8 oz peeled" }, { item: "rice", amount: "1 cup cooked" }, { item: "green beans", amount: "2 cups" }, { item: "honey", amount: "2 tbsp" }, { item: "soy sauce", amount: "2 tbsp" }, { item: "garlic", amount: "4 cloves minced" }],
    cost: 15, prepTime: 5, cookTime: 12, prepAhead: false, protein: 28, carbs: 55, calories: 480,
    instructions: ["Mix honey, soy sauce, and garlic for sauce", "Steam or sauté green beans until tender", "Cook shrimp in oiled pan 2 min per side", "Pour sauce over shrimp, cook 1 min until glazed", "Serve shrimp and green beans over rice", "Drizzle extra sauce on top"]
  },
  { 
    id: "d16", name: "Stuffed Bell Peppers", 
    ingredients: [{ item: "bell peppers", amount: "2 large" }, { item: "ground turkey", amount: "8 oz" }, { item: "rice", amount: "½ cup cooked" }, { item: "tomato sauce", amount: "1 cup" }, { item: "cheese", amount: "½ cup shredded" }, { item: "onion", amount: "¼ diced" }, { item: "Italian seasoning", amount: "1 tsp" }],
    cost: 7, prepTime: 15, cookTime: 30, prepAhead: true, protein: 32, carbs: 35, calories: 450,
    instructions: ["Preheat oven to 375°F", "Cut tops off peppers, remove seeds", "Brown turkey with onion", "Mix turkey with rice, half the tomato sauce, and seasoning", "Stuff peppers with mixture", "Place in baking dish, top with remaining sauce", "Bake 25-30 min, add cheese last 5 min"]
  },
  { 
    id: "d17", name: "Pork Chops with Apple", 
    ingredients: [{ item: "pork chops", amount: "2 bone-in" }, { item: "apple", amount: "1 sliced" }, { item: "sweet potato", amount: "1 large cubed" }, { item: "olive oil", amount: "2 tbsp" }, { item: "rosemary", amount: "1 tsp" }, { item: "brown sugar", amount: "1 tbsp" }],
    cost: 13, prepTime: 10, cookTime: 25, prepAhead: false, protein: 35, carbs: 45, calories: 520,
    instructions: ["Preheat oven to 400°F", "Toss sweet potato with 1 tbsp oil, salt, pepper", "Roast 15 min", "Season pork chops with salt, pepper, rosemary", "Sear in hot pan 3 min per side", "Add apples and brown sugar to sweet potatoes", "Add pork to sheet, roast 10 min more"]
  },
  { 
    id: "d18", name: "Thai Basil Chicken", 
    ingredients: [{ item: "ground chicken", amount: "8 oz" }, { item: "rice", amount: "1 cup cooked" }, { item: "fresh basil", amount: "1 cup" }, { item: "garlic", amount: "4 cloves" }, { item: "fish sauce", amount: "2 tbsp" }, { item: "soy sauce", amount: "1 tbsp" }, { item: "chili flakes", amount: "1 tsp" }],
    cost: 7, prepTime: 5, cookTime: 10, prepAhead: false, protein: 32, carbs: 45, calories: 480,
    instructions: ["Heat oil in wok over high heat", "Add garlic and chili, cook 30 seconds", "Add ground chicken, break up and cook 5 min", "Add fish sauce and soy sauce", "Stir in basil leaves until wilted", "Serve over rice", "Optional: top with fried egg"]
  },
  { 
    id: "d19", name: "Chicken Parmesan", 
    ingredients: [{ item: "chicken breast", amount: "8 oz" }, { item: "breadcrumbs", amount: "½ cup" }, { item: "marinara sauce", amount: "1 cup" }, { item: "mozzarella", amount: "½ cup shredded" }, { item: "parmesan", amount: "¼ cup" }, { item: "egg", amount: "1" }, { item: "pasta", amount: "6 oz" }],
    cost: 9, prepTime: 10, cookTime: 20, prepAhead: false, protein: 42, carbs: 55, calories: 580,
    instructions: ["Pound chicken to even thickness", "Dip in beaten egg, then breadcrumbs mixed with parmesan", "Pan-fry in oil 4 min per side until golden", "Place in baking dish, top with marinara and mozzarella", "Bake at 400°F 10 min until cheese melts", "Cook pasta, serve chicken over pasta"]
  },
  { 
    id: "d20", name: "One-Pot Chili", 
    ingredients: [{ item: "ground beef", amount: "8 oz" }, { item: "kidney beans", amount: "1 can drained" }, { item: "diced tomatoes", amount: "1 can" }, { item: "onion", amount: "½ diced" }, { item: "chili powder", amount: "2 tbsp" }, { item: "cumin", amount: "1 tsp" }, { item: "cheese", amount: "½ cup" }],
    cost: 7, prepTime: 10, cookTime: 25, prepAhead: true, protein: 35, carbs: 40, calories: 520,
    instructions: ["Brown beef in large pot, drain fat", "Add onion, cook 3 min", "Add chili powder and cumin, stir", "Add tomatoes and beans", "Simmer 20 min, stirring occasionally", "Season with salt and pepper", "Serve topped with cheese and sour cream"]
  },
  { 
    id: "d21", name: "Coconut Curry Chicken", 
    ingredients: [{ item: "chicken thighs", amount: "8 oz" }, { item: "coconut milk", amount: "1 can" }, { item: "curry paste", amount: "2 tbsp" }, { item: "rice", amount: "1 cup cooked" }, { item: "spinach", amount: "2 cups" }, { item: "lime", amount: "1" }],
    cost: 8, prepTime: 5, cookTime: 20, prepAhead: false, protein: 35, carbs: 48, calories: 550,
    instructions: ["Cut chicken into pieces", "Brown chicken in pot 5 min", "Add curry paste, stir 1 min", "Pour in coconut milk, simmer 12 min", "Add spinach, stir until wilted", "Squeeze lime juice over", "Serve over rice"]
  },
  { 
    id: "d22", name: "Greek Turkey Burgers", 
    ingredients: [{ item: "ground turkey", amount: "8 oz" }, { item: "feta", amount: "¼ cup crumbled" }, { item: "spinach", amount: "1 cup chopped" }, { item: "burger buns", amount: "2" }, { item: "tzatziki", amount: "4 tbsp" }, { item: "tomato", amount: "1 sliced" }, { item: "red onion", amount: "4 slices" }],
    cost: 8, prepTime: 10, cookTime: 12, prepAhead: false, protein: 36, carbs: 32, calories: 480,
    instructions: ["Mix turkey with feta and chopped spinach", "Form into 2 patties", "Grill or pan-fry 5-6 min per side", "Toast buns lightly", "Spread tzatziki on buns", "Add burger, tomato, and onion", "Serve with side salad or fries"]
  },
  { 
    id: "d23", name: "Sheet Pan Sausage & Veggies", 
    ingredients: [{ item: "italian sausages", amount: "4 links" }, { item: "bell peppers", amount: "2 sliced" }, { item: "zucchini", amount: "1 sliced" }, { item: "red onion", amount: "1 sliced" }, { item: "olive oil", amount: "2 tbsp" }, { item: "Italian seasoning", amount: "1 tsp" }],
    cost: 13, prepTime: 10, cookTime: 25, prepAhead: false, protein: 28, carbs: 20, calories: 450,
    instructions: ["Preheat oven to 400°F", "Slice sausages into rounds", "Toss all veggies with oil and seasoning", "Spread sausage and veggies on sheet pan", "Bake 25 min, stirring halfway", "Season with salt and pepper", "Serve as is or over rice"]
  },
  { 
    id: "d24", name: "Lemon Garlic Pasta with Chicken", 
    ingredients: [{ item: "chicken breast", amount: "6 oz" }, { item: "pasta", amount: "8 oz" }, { item: "garlic", amount: "4 cloves" }, { item: "lemon", amount: "1" }, { item: "parmesan", amount: "½ cup" }, { item: "olive oil", amount: "3 tbsp" }, { item: "parsley", amount: "2 tbsp fresh" }],
    cost: 8, prepTime: 5, cookTime: 18, prepAhead: false, protein: 35, carbs: 60, calories: 550,
    instructions: ["Cook pasta, reserve 1 cup pasta water", "Season and cook chicken 5-6 min per side, slice", "Sauté garlic in olive oil 1 min", "Add pasta, lemon zest, lemon juice", "Toss with parmesan and pasta water until creamy", "Top with sliced chicken and parsley"]
  },
];

type Meal = MealData;

interface DayPlan {
  breakfast: typeof breakfasts[0];
  lunch: typeof lunches[0];
  dinner: typeof dinners[0];
}

// Deal insights structure
interface DealInsight {
  store: string;
  item: string;
  deal: string;
  price?: string;
  savings?: string;
  expires?: string;
  relevantIngredients?: string[]; // Which grocery list items this applies to
}

interface DealsData {
  lastUpdated: string;
  summary: string;
  deals: DealInsight[];
  tips?: string[];
}

// Who's eating each meal
interface MealAttendance {
  andrew: boolean;
  olivia: boolean;
}

// Who's eating at home each day (per meal)
interface DayAttendance {
  breakfast: MealAttendance;
  lunch: MealAttendance;
  dinner: MealAttendance;
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

  const defaultMealAttendance: MealAttendance = { andrew: true, olivia: true };
  const defaultAttendance: DayAttendance[] = Array(7).fill(null).map(() => ({ 
    breakfast: { ...defaultMealAttendance },
    lunch: { ...defaultMealAttendance },
    dinner: { ...defaultMealAttendance },
  }));
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

// Helper to parse and aggregate amounts
function aggregateAmounts(amounts: string[]): string {
  // Try to aggregate numeric amounts with same units
  const unitGroups: Record<string, number> = {};
  const nonNumeric: string[] = [];
  
  amounts.forEach(amt => {
    // Match patterns like "2 cups", "6 oz", "1 lb", "3", "1/2 cup"
    const match = amt.match(/^([\d./]+)\s*(.*)$/);
    if (match) {
      const numStr = match[1];
      const unit = match[2].toLowerCase().trim();
      // Handle fractions
      let num = 0;
      if (numStr.includes("/")) {
        const [n, d] = numStr.split("/").map(Number);
        num = n / d;
      } else {
        num = parseFloat(numStr);
      }
      if (!isNaN(num)) {
        unitGroups[unit] = (unitGroups[unit] || 0) + num;
      } else {
        nonNumeric.push(amt);
      }
    } else {
      nonNumeric.push(amt);
    }
  });
  
  // Format aggregated amounts
  const formatted = Object.entries(unitGroups).map(([unit, total]) => {
    // Round to reasonable precision
    const rounded = Math.round(total * 10) / 10;
    const display = rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1);
    return unit ? `${display} ${unit}` : display;
  });
  
  return [...formatted, ...nonNumeric].join(" + ") || "as needed";
}

function calculateWeeklyStats(plan: WeekPlan) {
  let totalCost = 0;
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalMealServings = 0;

  // Track ingredient amounts: { "chicken": ["8 oz", "6 oz", "8 oz"] }
  const ingredientAmounts: Record<string, string[]> = {};
  const prepAheadMeals: { day: string; meal: string; name: string }[] = [];

  // Helper to get meal attendance with migration for old data
  const getMealAttendance = (dayAtt: DayAttendance | undefined, mealType: "breakfast" | "lunch" | "dinner") => {
    if (!dayAtt) return { andrew: true, olivia: true };
    // Handle old format migration
    if (!dayAtt.breakfast) {
      const old = dayAtt as unknown as { andrew: boolean; olivia: boolean };
      return { andrew: old.andrew ?? true, olivia: old.olivia ?? true };
    }
    return dayAtt[mealType];
  };

  plan.days.forEach((day, i) => {
    const dayAttendance = plan.attendance?.[i];
    
    // Calculate per-meal
    const meals = [
      { type: "breakfast" as const, data: day.breakfast },
      { type: "lunch" as const, data: day.lunch },
      { type: "dinner" as const, data: day.dinner },
    ];

    meals.forEach(({ type, data }) => {
      const mealAtt = getMealAttendance(dayAttendance, type);
      const peopleCount = (mealAtt.andrew ? 1 : 0) + (mealAtt.olivia ? 1 : 0);
      
      if (peopleCount === 0) return; // Skip meals with no one eating
      
      totalMealServings += peopleCount;
      totalCost += data.cost * peopleCount;
      totalCalories += data.calories * peopleCount;
      totalProtein += data.protein * peopleCount;
      totalCarbs += data.carbs * peopleCount;

      // Track ingredients with their amounts
      data.ingredients.forEach(ing => {
        if (!ingredientAmounts[ing.item]) ingredientAmounts[ing.item] = [];
        for (let p = 0; p < peopleCount; p++) {
          ingredientAmounts[ing.item].push(ing.amount);
        }
      });

      // Prep ahead
      if (data.prepAhead) {
        prepAheadMeals.push({ day: dayNames[i], meal: type.charAt(0).toUpperCase() + type.slice(1), name: data.name });
      }
    });
  });

  // Build grocery list with aggregated amounts
  const groceryList = Object.entries(ingredientAmounts)
    .sort((a, b) => b[1].length - a[1].length) // Sort by frequency
    .map(([name, amounts]) => ({ 
      name, 
      count: amounts.length,
      amount: aggregateAmounts(amounts)
    }));

  // For averaging, use total meal servings (divide by 3 to get rough "day equivalent")
  const avgServings = totalMealServings > 0 ? totalMealServings : 1;

  return {
    totalCost: Math.round(totalCost),
    avgDailyCalories: Math.round((totalCalories / avgServings) * 3), // Approximate daily
    avgDailyProtein: Math.round((totalProtein / avgServings) * 3),
    avgDailyCarbs: Math.round((totalCarbs / avgServings) * 3),
    groceryList,
    prepAheadMeals,
    totalMealServings,
  };
}

export default function MealPlanner() {
  const [plan, setPlan] = useState<WeekPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [preferences, setPreferences] = useState<Preferences>({});
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);
  const [deals, setDeals] = useState<DealsData | null>(null);
  const [dealsLoading, setDealsLoading] = useState(false);

  // Fetch deals
  const fetchDeals = useCallback(async () => {
    setDealsLoading(true);
    try {
      const response = await fetch("/api/meals/deals");
      if (response.ok) {
        const data = await response.json();
        if (data.deals) {
          setDeals(data.deals);
        }
      }
    } catch (error) {
      console.error("Failed to fetch deals:", error);
    } finally {
      setDealsLoading(false);
    }
  }, []);

  // Find all meals that use a specific ingredient
  const getMealsUsingIngredient = (ingredientName: string): Meal[] => {
    if (!plan) return [];
    const allMeals = plan.days.flatMap(day => [day.breakfast, day.lunch, day.dinner]);
    const uniqueMeals = new Map<string, Meal>();
    allMeals.forEach(meal => {
      if (meal.ingredients.some(ing => ing.item.toLowerCase() === ingredientName.toLowerCase())) {
        uniqueMeals.set(meal.id, meal);
      }
    });
    return Array.from(uniqueMeals.values());
  };

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
        // Load meal plan, preferences, and deals in parallel
        const [planResponse, prefsResponse] = await Promise.all([
          fetch("/api/meals"),
          fetch("/api/meals/preferences"),
        ]);
        
        // Also fetch deals
        fetchDeals();
        
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
  }, [savePlanToDb, hydrateMeal, fetchDeals]);

  // Revise a single meal - swap it for a different option
  const handleRevise = (dayIndex: number, mealType: "breakfast" | "lunch" | "dinner") => {
    if (!plan) return;
    const newPlan = reviseMeal(plan, dayIndex, mealType);
    setPlan(newPlan);
    savePlanToDb(newPlan);
  };

  const toggleAttendance = (dayIndex: number, mealType: "breakfast" | "lunch" | "dinner", person: "andrew" | "olivia") => {
    if (!plan) return;
    const defaultMeal = { andrew: true, olivia: true };
    const defaultDay = { breakfast: { ...defaultMeal }, lunch: { ...defaultMeal }, dinner: { ...defaultMeal } };
    const newAttendance = [...(plan.attendance || Array(7).fill(null).map(() => ({ ...defaultDay })))];
    
    // Ensure the day has the new structure
    if (!newAttendance[dayIndex].breakfast) {
      // Migrate old structure to new
      const oldAtt = newAttendance[dayIndex] as unknown as { andrew: boolean; olivia: boolean };
      newAttendance[dayIndex] = {
        breakfast: { andrew: oldAtt.andrew ?? true, olivia: oldAtt.olivia ?? true },
        lunch: { andrew: oldAtt.andrew ?? true, olivia: oldAtt.olivia ?? true },
        dinner: { andrew: oldAtt.andrew ?? true, olivia: oldAtt.olivia ?? true },
      };
    }
    
    newAttendance[dayIndex] = {
      ...newAttendance[dayIndex],
      [mealType]: {
        ...newAttendance[dayIndex][mealType],
        [person]: !newAttendance[dayIndex][mealType][person],
      },
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
            <TabsTrigger value="deals">🏷️ Deals</TabsTrigger>
          </TabsList>

          {/* Schedule Tab - Who's eating each meal */}
          <TabsContent value="schedule" className="space-y-4">
            {(() => {
              const getMealAtt = (dayAtt: DayAttendance | undefined, mealType: "breakfast" | "lunch" | "dinner") => {
                if (!dayAtt) return { andrew: true, olivia: true };
                if (!dayAtt.breakfast) {
                  const old = dayAtt as unknown as { andrew: boolean; olivia: boolean };
                  return { andrew: old.andrew ?? true, olivia: old.olivia ?? true };
                }
                return dayAtt[mealType];
              };

              const mealTypes = [
                { key: "breakfast" as const, label: "Breakfast", emoji: "🍳" },
                { key: "lunch" as const, label: "Lunch", emoji: "🥗" },
                { key: "dinner" as const, label: "Dinner", emoji: "🍽️" },
              ];

              const people = [
                { key: "andrew" as const, name: "Andrew", emoji: "👨" },
                { key: "olivia" as const, name: "Olivia", emoji: "👩" },
              ];

              return people.map(({ key: person, name, emoji }) => (
                <Card key={person}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{emoji} {name}&apos;s Schedule</CardTitle>
                    <CardDescription>Toggle meals for the week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-8 gap-2 text-center text-sm">
                      <div></div>
                      {dayNames.map((day) => (
                        <div key={day} className="font-medium text-xs text-muted-foreground">{day.slice(0, 3)}</div>
                      ))}
                      
                      {mealTypes.map(({ key: mealType, label, emoji: mealEmoji }) => (
                        <React.Fragment key={mealType}>
                          <div className="text-left text-xs py-2">{mealEmoji} {label}</div>
                          {plan.attendance?.map((att, i) => {
                            const mealAtt = getMealAtt(att, mealType);
                            const isActive = mealAtt[person];
                            return (
                              <button
                                key={`${person}-${mealType}-${i}`}
                                onClick={() => toggleAttendance(i, mealType, person)}
                                className={`p-1.5 rounded-lg border transition-all text-xs ${
                                  isActive
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-muted text-muted-foreground border-border hover:border-primary/50"
                                }`}
                              >
                                {isActive ? "✓" : "—"}
                              </button>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ));
            })()}
            
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground">
                💡 Tip: Toggle off meals when traveling or eating out — grocery list and costs adjust automatically.
              </p>
            </div>
          </TabsContent>

          {/* Meal Plan Tab */}
          <TabsContent value="plan" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              📖 Click a meal for the recipe • 🔄 Revise to swap • 👍👎 Rate to improve suggestions
            </p>

            {plan.days.map((day, dayIndex) => {
              const dayAttendance = plan.attendance?.[dayIndex];
              
              // Helper to get meal attendance with old data migration
              const getMealAtt = (mealType: "breakfast" | "lunch" | "dinner") => {
                if (!dayAttendance) return { andrew: true, olivia: true };
                if (!dayAttendance.breakfast) {
                  const old = dayAttendance as unknown as { andrew: boolean; olivia: boolean };
                  return { andrew: old.andrew ?? true, olivia: old.olivia ?? true };
                }
                return dayAttendance[mealType];
              };

              const breakfastAtt = getMealAtt("breakfast");
              const lunchAtt = getMealAtt("lunch");
              const dinnerAtt = getMealAtt("dinner");
              
              // Check if anyone is eating any meal this day
              const anyMeals = (breakfastAtt.andrew || breakfastAtt.olivia) || 
                               (lunchAtt.andrew || lunchAtt.olivia) || 
                               (dinnerAtt.andrew || dinnerAtt.olivia);
              
              return (
              <Card key={dayIndex} className={!anyMeals ? "opacity-50" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{dayNames[dayIndex]}</CardTitle>
                    {!anyMeals && <Badge variant="secondary">No meals needed</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Breakfast */}
                    <div className={!(breakfastAtt.andrew || breakfastAtt.olivia) ? "opacity-40" : ""}>
                      <MealCard
                        label={`Breakfast${breakfastAtt.andrew && breakfastAtt.olivia ? "" : breakfastAtt.andrew ? " (A)" : breakfastAtt.olivia ? " (O)" : ""}`}
                        meal={day.breakfast}
                        onRevise={() => handleRevise(dayIndex, "breakfast")}
                        onClick={() => setSelectedMeal(day.breakfast)}
                        rating={preferences[day.breakfast.id]?.household}
                        onRate={(r) => rateMeal(day.breakfast.id, "breakfast", day.breakfast.name, r)}
                      />
                    </div>
                    {/* Lunch */}
                    <div className={!(lunchAtt.andrew || lunchAtt.olivia) ? "opacity-40" : ""}>
                      <MealCard
                        label={`Lunch${lunchAtt.andrew && lunchAtt.olivia ? "" : lunchAtt.andrew ? " (A)" : lunchAtt.olivia ? " (O)" : ""}`}
                        meal={day.lunch}
                        onRevise={() => handleRevise(dayIndex, "lunch")}
                        onClick={() => setSelectedMeal(day.lunch)}
                        rating={preferences[day.lunch.id]?.household}
                        onRate={(r) => rateMeal(day.lunch.id, "lunch", day.lunch.name, r)}
                      />
                    </div>
                    {/* Dinner */}
                    <div className={!(dinnerAtt.andrew || dinnerAtt.olivia) ? "opacity-40" : ""}>
                      <MealCard
                        label={`Dinner${dinnerAtt.andrew && dinnerAtt.olivia ? "" : dinnerAtt.andrew ? " (A)" : dinnerAtt.olivia ? " (O)" : ""}`}
                        meal={day.dinner}
                        onRevise={() => handleRevise(dayIndex, "dinner")}
                        onClick={() => setSelectedMeal(day.dinner)}
                        rating={preferences[day.dinner.id]?.household}
                        onRate={(r) => rateMeal(day.dinner.id, "dinner", day.dinner.name, r)}
                      />
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
                    <div className="space-y-2">
                      {Array.from(new Set(plan.days.map(d => d.breakfast.name))).map((name) => {
                        const count = plan.days.filter(d => d.breakfast.name === name).length;
                        const meal = plan.days.find(d => d.breakfast.name === name)?.breakfast;
                        return (
                          <button 
                            key={name}
                            onClick={() => meal && setSelectedMeal(meal)}
                            className="w-full flex items-center justify-between gap-2 p-3 rounded-lg border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all text-left"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">📖</span>
                              <span className="font-medium">{name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">×{count} days</Badge>
                              {meal?.prepAhead && <Badge variant="outline" className="text-xs">prep ahead</Badge>}
                              <span className="text-primary text-sm">View →</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Lunch prep - 2 types batched */}
                  <div className="p-4 rounded-lg border border-border bg-muted/30">
                    <h3 className="font-medium mb-3">🥡 Lunches (2 types, batch prep)</h3>
                    <div className="space-y-2">
                      {Array.from(new Set(plan.days.map(d => d.lunch.name))).map((lunchName) => {
                        const count = plan.days.filter(d => d.lunch.name === lunchName).length;
                        const meal = plan.days.find(d => d.lunch.name === lunchName)?.lunch;
                        return (
                          <button 
                            key={lunchName}
                            onClick={() => meal && setSelectedMeal(meal)}
                            className="w-full flex items-center justify-between gap-2 p-3 rounded-lg border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all text-left"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">📖</span>
                              <span className="font-medium">{lunchName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">×{count} days</Badge>
                              <span className="text-primary text-sm">View →</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      💡 Prep all portions Sunday, store in containers for grab-and-go lunches
                    </p>
                  </div>

                  {/* Other prep-ahead meals */}
                  {stats.prepAheadMeals.filter(m => m.meal !== "Lunch").length > 0 && (
                    <div className="p-4 rounded-lg border border-border bg-muted/30">
                      <h3 className="font-medium mb-3">📋 Other Prep-Ahead</h3>
                      <div className="space-y-2">
                        {stats.prepAheadMeals.filter(m => m.meal !== "Lunch").map((prepMeal, i) => {
                          // Find the actual meal object
                          const dayIndex = dayNames.indexOf(prepMeal.day);
                          const mealType = prepMeal.meal.toLowerCase() as "breakfast" | "lunch" | "dinner";
                          const mealObj = dayIndex >= 0 ? plan.days[dayIndex]?.[mealType] : null;
                          
                          return (
                            <button 
                              key={i}
                              onClick={() => mealObj && setSelectedMeal(mealObj)}
                              className="w-full flex items-center justify-between gap-2 p-3 rounded-lg border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all text-left"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-lg">📖</span>
                                <span className="font-medium">{prepMeal.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">{prepMeal.day} {prepMeal.meal}</Badge>
                                <span className="text-primary text-sm">View →</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
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
                                onShowDetails={() => setSelectedIngredient(item.name)}
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
                    <strong>{stats.groceryList.length} items</strong> for {stats.totalMealServings} meal servings.
                    Estimated: <strong>${Math.round(stats.totalCost * 0.5)}-${Math.round(stats.totalCost * 0.7)}</strong> at NYC grocery stores.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Deals Tab */}
          <TabsContent value="deals">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>🏷️ Weekend Grocery Deals</CardTitle>
                    <CardDescription>
                      Agent Drew&apos;s picks for this week&apos;s shopping
                    </CardDescription>
                  </div>
                  {deals && (
                    <Badge variant="outline" className="text-xs">
                      Updated {new Date(deals.lastUpdated).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {dealsLoading ? (
                  <p className="text-muted-foreground text-center py-8">Loading deals...</p>
                ) : !deals ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-2">No deals posted yet</p>
                    <p className="text-sm text-muted-foreground">
                      Agent Drew will post grocery deals here before weekend shopping! 🛒
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Summary */}
                    {deals.summary && (
                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <p className="text-sm">{deals.summary}</p>
                      </div>
                    )}

                    {/* Deals by store */}
                    {(() => {
                      const byStore = deals.deals.reduce((acc, deal) => {
                        if (!acc[deal.store]) acc[deal.store] = [];
                        acc[deal.store].push(deal);
                        return acc;
                      }, {} as Record<string, DealInsight[]>);

                      return Object.entries(byStore).map(([store, storeDeals]) => (
                        <div key={store} className="space-y-3">
                          <h3 className="font-semibold flex items-center gap-2">
                            🏪 {store}
                          </h3>
                          <div className="space-y-2">
                            {storeDeals.map((deal, i) => {
                              // Check if this deal is relevant to our grocery list
                              const isRelevant = deal.relevantIngredients?.some(ing =>
                                stats.groceryList.some(g => 
                                  g.name.toLowerCase().includes(ing.toLowerCase()) ||
                                  ing.toLowerCase().includes(g.name.toLowerCase())
                                )
                              );

                              return (
                                <div
                                  key={i}
                                  className={`p-3 rounded-lg border transition-colors ${
                                    isRelevant
                                      ? "border-green-500/30 bg-green-500/5"
                                      : "border-border bg-card"
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-medium">{deal.item}</span>
                                        {isRelevant && (
                                          <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-600">
                                            On your list!
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-sm text-primary mt-1">{deal.deal}</p>
                                      {deal.relevantIngredients && deal.relevantIngredients.length > 0 && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                          Good for: {deal.relevantIngredients.join(", ")}
                                        </p>
                                      )}
                                    </div>
                                    <div className="text-right shrink-0">
                                      {deal.price && (
                                        <span className="font-bold text-lg">{deal.price}</span>
                                      )}
                                      {deal.savings && (
                                        <p className="text-xs text-green-600">{deal.savings}</p>
                                      )}
                                      {deal.expires && (
                                        <p className="text-xs text-muted-foreground">Exp: {deal.expires}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ));
                    })()}

                    {/* Tips */}
                    {deals.tips && deals.tips.length > 0 && (
                      <div className="p-4 rounded-lg bg-muted/30 border border-border">
                        <h3 className="font-medium mb-2">💡 Shopping Tips</h3>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {deals.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-primary">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
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

        {/* Ingredient Details Modal */}
        <Dialog open={!!selectedIngredient} onOpenChange={(open) => !open && setSelectedIngredient(null)}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            {selectedIngredient && (
              <>
                <DialogHeader>
                  <DialogTitle className="capitalize text-xl">{selectedIngredient}</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 mt-4">
                  <p className="text-sm text-muted-foreground">
                    Used in {getMealsUsingIngredient(selectedIngredient).length} meal(s) this week
                  </p>

                  {getMealsUsingIngredient(selectedIngredient).map((meal) => {
                    const ingredientInfo = meal.ingredients.find(
                      ing => ing.item.toLowerCase() === selectedIngredient.toLowerCase()
                    );
                    
                    return (
                      <div key={meal.id} className="p-4 rounded-lg border border-border bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{meal.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {ingredientInfo?.amount || ""}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground mb-3">
                          ⏱️ {meal.prepTime + meal.cookTime} min total
                        </div>

                        {/* Show relevant steps that mention this ingredient */}
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground uppercase">Prep Steps:</p>
                          <ol className="space-y-1">
                            {meal.instructions.map((step, i) => (
                              <li key={i} className="flex gap-2 text-sm">
                                <span className="text-primary font-medium shrink-0">{i + 1}.</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    );
                  })}
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
  onShowDetails,
}: {
  item: { name: string; count: number; amount: string };
  checked: boolean;
  onToggle: () => void;
  onShowDetails: () => void;
}) {
  return (
    <div
      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
        checked
          ? "bg-primary/10 border-primary/30 opacity-60"
          : "bg-card border-border hover:border-primary/50"
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${
          checked ? "bg-primary border-primary" : "border-muted-foreground hover:border-primary"
        }`}
      >
        {checked && (
          <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      
      {/* Item name - clickable for details */}
      <button 
        onClick={onShowDetails}
        className={`flex-1 text-left capitalize hover:text-primary transition-colors ${checked ? "line-through" : ""}`}
      >
        {item.name}
        <span className="text-xs text-primary/60 ml-2">ⓘ</span>
      </button>
      
      <Badge variant="secondary" className="text-xs">
        {item.amount}
      </Badge>
    </div>
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
