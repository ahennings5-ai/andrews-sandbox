"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

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

export default function Home() {
  const [quote, setQuote] = useState(coachQuotes[0]);
  
  // Pick a new random quote every time the page is visited/focused
  useEffect(() => {
    const pickRandomQuote = () => {
      const randomQuote = coachQuotes[Math.floor(Math.random() * coachQuotes.length)];
      setQuote(randomQuote);
    };
    
    // Pick on initial load
    pickRandomQuote();
    
    // Also pick when window regains focus (coming back to the tab)
    window.addEventListener("focus", pickRandomQuote);
    return () => window.removeEventListener("focus", pickRandomQuote);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Hero Section */}
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Andrew&apos;s Sandbox
          </h1>
          
          {/* Motivational Quote */}
          <div className="max-w-2xl mx-auto mb-8 p-6 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-lg md:text-xl text-foreground italic mb-3">
              &ldquo;{quote.quote}&rdquo;
            </p>
            <p className="text-sm text-primary font-medium">
              — {quote.coach}
            </p>
          </div>
        </header>

        {/* Projects Section */}
        <section id="projects" className="grid md:grid-cols-3 gap-6">
          <Link href="/marathon" className="group">
            <Card className="h-full transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>🏃</span>
                  <span>NYC Marathon</span>
                </CardTitle>
                <CardDescription>
                  18-week training program with run logging & progress tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-primary text-sm font-medium group-hover:underline">
                  Start training →
                </span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/meals" className="group">
            <Card className="h-full transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>🍽️</span>
                  <span>Meal Planner</span>
                </CardTitle>
                <CardDescription>
                  Weekly meals for two, Sunday prep, $200 NYC budget
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-primary text-sm font-medium group-hover:underline">
                  Plan meals →
                </span>
              </CardContent>
            </Card>
          </Link>

          <Card className="h-full opacity-60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>📝</span>
                <span>Notes</span>
              </CardTitle>
              <CardDescription>
                Learnings and documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-muted-foreground text-sm">Coming soon...</span>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-border">
          <p className="text-muted-foreground text-sm">
            Built with Next.js, Tailwind CSS, and shadcn/ui
          </p>
        </footer>
      </div>
    </div>
  );
}
