"use client";

import * as React from "react";
import { CommandPalette, useCommandPalette } from "./command-palette";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const { open, setOpen } = useCommandPalette();

  return (
    <>
      {children}
      <CommandPalette open={open} onOpenChange={setOpen} />
      
      {/* Keyboard shortcut hint */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-card/80 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-card hover:text-foreground transition-all shadow-lg"
        >
          <span>Quick Actions</span>
          <kbd className="px-1.5 py-0.5 text-xs bg-white/10 rounded">⌘K</kbd>
        </button>
      </div>
    </>
  );
}
