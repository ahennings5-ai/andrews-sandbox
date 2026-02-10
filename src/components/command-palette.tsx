"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  Activity,
  Utensils,
  Lightbulb,
  Trophy,
  Home,
  Search,
  Plus,
  Calendar,
  TrendingUp,
  Users,
  Calculator,
  FileText,
  Settings,
  Zap,
  Target,
  Dumbbell,
  ChefHat,
  Brain,
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = React.useState("");

  const runCommand = React.useCallback((command: () => void) => {
    onOpenChange(false);
    command();
  }, [onOpenChange]);

  // Navigation commands
  const navigationCommands = [
    { icon: Home, label: "Go to Dashboard", shortcut: "G D", action: () => router.push("/") },
    { icon: Activity, label: "Go to Marathon Tracker", shortcut: "G M", action: () => router.push("/marathon") },
    { icon: Utensils, label: "Go to Meal Planner", shortcut: "G E", action: () => router.push("/meals") },
    { icon: Lightbulb, label: "Go to Business Ideas", shortcut: "G I", action: () => router.push("/ideas") },
    { icon: Trophy, label: "Go to Dynasty Manager", shortcut: "G Y", action: () => router.push("/dynasty") },
  ];

  // Marathon actions
  const marathonCommands = [
    { icon: Plus, label: "Log a Run", shortcut: "L R", action: () => router.push("/marathon?action=log") },
    { icon: Calendar, label: "View Training Plan", action: () => router.push("/marathon?tab=plan") },
    { icon: TrendingUp, label: "View Progress Stats", action: () => router.push("/marathon?tab=progress") },
    { icon: Target, label: "Set Running Goal", action: () => router.push("/marathon?action=goal") },
  ];

  // Ideas actions  
  const ideaCommands = [
    { icon: Plus, label: "Add New Idea", shortcut: "N I", action: () => router.push("/ideas?action=new") },
    { icon: Brain, label: "Review Ideas Pipeline", action: () => router.push("/ideas") },
    { icon: FileText, label: "View Researched Ideas", action: () => router.push("/ideas?filter=researched") },
  ];

  // Meal actions
  const mealCommands = [
    { icon: ChefHat, label: "Plan This Week's Meals", action: () => router.push("/meals") },
    { icon: Calendar, label: "View Meal Calendar", action: () => router.push("/meals?view=calendar") },
    { icon: Dumbbell, label: "View Deals", action: () => router.push("/meals?tab=deals") },
  ];

  // Dynasty actions
  const dynastyCommands = [
    { icon: Users, label: "View My Roster", action: () => router.push("/dynasty?tab=assets") },
    { icon: Search, label: "Scout Prospects", action: () => router.push("/dynasty?tab=scouting") },
    { icon: Calculator, label: "Trade Calculator", action: () => router.push("/dynasty?tab=calculator") },
    { icon: TrendingUp, label: "League Intel", action: () => router.push("/dynasty?tab=intel") },
  ];

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Command Menu"
      className="fixed inset-0 z-50"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Dialog */}
      <div className="fixed left-1/2 top-[20%] -translate-x-1/2 w-full max-w-xl">
        <div className="glass-card rounded-xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent text-lg text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <kbd className="px-2 py-1 text-xs bg-white/5 rounded text-muted-foreground">
              ESC
            </kbd>
          </div>

          {/* Commands List */}
          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-muted-foreground">
              No results found.
            </Command.Empty>

            {/* Navigation */}
            <Command.Group heading="Navigation" className="mb-2">
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Navigation
              </div>
              {navigationCommands.map((cmd) => (
                <Command.Item
                  key={cmd.label}
                  value={cmd.label}
                  onSelect={() => runCommand(cmd.action)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-foreground/80 hover:bg-white/5 hover:text-foreground data-[selected=true]:bg-primary/20 data-[selected=true]:text-primary transition-colors"
                >
                  <cmd.icon className="w-4 h-4" />
                  <span className="flex-1">{cmd.label}</span>
                  {cmd.shortcut && (
                    <kbd className="px-1.5 py-0.5 text-xs bg-white/5 rounded text-muted-foreground">
                      {cmd.shortcut}
                    </kbd>
                  )}
                </Command.Item>
              ))}
            </Command.Group>

            {/* Marathon */}
            <Command.Group heading="Marathon" className="mb-2">
              <div className="px-2 py-1.5 text-xs font-medium text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-3 h-3" />
                Marathon
              </div>
              {marathonCommands.map((cmd) => (
                <Command.Item
                  key={cmd.label}
                  value={cmd.label}
                  onSelect={() => runCommand(cmd.action)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-foreground/80 hover:bg-emerald-500/10 hover:text-emerald-400 data-[selected=true]:bg-emerald-500/20 data-[selected=true]:text-emerald-400 transition-colors"
                >
                  <cmd.icon className="w-4 h-4" />
                  <span className="flex-1">{cmd.label}</span>
                  {cmd.shortcut && (
                    <kbd className="px-1.5 py-0.5 text-xs bg-white/5 rounded text-muted-foreground">
                      {cmd.shortcut}
                    </kbd>
                  )}
                </Command.Item>
              ))}
            </Command.Group>

            {/* Ideas */}
            <Command.Group heading="Ideas" className="mb-2">
              <div className="px-2 py-1.5 text-xs font-medium text-primary uppercase tracking-wider flex items-center gap-2">
                <Lightbulb className="w-3 h-3" />
                Business Ideas
              </div>
              {ideaCommands.map((cmd) => (
                <Command.Item
                  key={cmd.label}
                  value={cmd.label}
                  onSelect={() => runCommand(cmd.action)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-foreground/80 hover:bg-primary/10 hover:text-primary data-[selected=true]:bg-primary/20 data-[selected=true]:text-primary transition-colors"
                >
                  <cmd.icon className="w-4 h-4" />
                  <span className="flex-1">{cmd.label}</span>
                  {cmd.shortcut && (
                    <kbd className="px-1.5 py-0.5 text-xs bg-white/5 rounded text-muted-foreground">
                      {cmd.shortcut}
                    </kbd>
                  )}
                </Command.Item>
              ))}
            </Command.Group>

            {/* Meals */}
            <Command.Group heading="Meals" className="mb-2">
              <div className="px-2 py-1.5 text-xs font-medium text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Utensils className="w-3 h-3" />
                Meal Planner
              </div>
              {mealCommands.map((cmd) => (
                <Command.Item
                  key={cmd.label}
                  value={cmd.label}
                  onSelect={() => runCommand(cmd.action)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-foreground/80 hover:bg-amber-500/10 hover:text-amber-400 data-[selected=true]:bg-amber-500/20 data-[selected=true]:text-amber-400 transition-colors"
                >
                  <cmd.icon className="w-4 h-4" />
                  <span className="flex-1">{cmd.label}</span>
                </Command.Item>
              ))}
            </Command.Group>

            {/* Dynasty */}
            <Command.Group heading="Dynasty" className="mb-2">
              <div className="px-2 py-1.5 text-xs font-medium text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Trophy className="w-3 h-3" />
                Dynasty Manager
              </div>
              {dynastyCommands.map((cmd) => (
                <Command.Item
                  key={cmd.label}
                  value={cmd.label}
                  onSelect={() => runCommand(cmd.action)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-foreground/80 hover:bg-cyan-500/10 hover:text-cyan-400 data-[selected=true]:bg-cyan-500/20 data-[selected=true]:text-cyan-400 transition-colors"
                >
                  <cmd.icon className="w-4 h-4" />
                  <span className="flex-1">{cmd.label}</span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-white/5 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-white/5 rounded">↑↓</kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-white/5 rounded">↵</kbd>
                select
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-primary" />
              <span>Quick Actions</span>
            </div>
          </div>
        </div>
      </div>
    </Command.Dialog>
  );
}

// Hook to use the command palette
export function useCommandPalette() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return { open, setOpen };
}
