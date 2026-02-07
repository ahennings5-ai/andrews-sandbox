import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Hero Section */}
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Andrew&apos;s Sandbox
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            A playground for ideas, experiments, and things I&apos;m building.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="#projects">Explore</Link>
            </Button>
            <Button size="lg" variant="outline">
              About Me
            </Button>
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
