import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Andrew&apos;s Sandbox
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            A playground for ideas, experiments, and things I&apos;m building.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Explore
            </Button>
            <Button size="lg" variant="outline" className="border-slate-500 text-slate-300 hover:bg-slate-800">
              About Me
            </Button>
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">🚀 Projects</CardTitle>
              <CardDescription className="text-slate-400">
                Things I&apos;m building and experimenting with
              </CardDescription>
            </CardHeader>
            <CardContent className="text-slate-300">
              <p>Coming soon...</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">💡 Ideas</CardTitle>
              <CardDescription className="text-slate-400">
                Thoughts and concepts worth exploring
              </CardDescription>
            </CardHeader>
            <CardContent className="text-slate-300">
              <p>Coming soon...</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">📝 Notes</CardTitle>
              <CardDescription className="text-slate-400">
                Learnings and documentation
              </CardDescription>
            </CardHeader>
            <CardContent className="text-slate-300">
              <p>Coming soon...</p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-slate-500">
          <p>Built with Next.js, Tailwind, and Shadcn UI</p>
        </footer>
      </div>
    </div>
  );
}
