import React from 'react';
import { Moon, Sun, Shield } from 'lucide-react';
import { useTheme } from '@/lib/theme';

export default function Header() {
  const { dark, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Shield className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold tracking-tight text-foreground">
            Paytm <span className="text-primary">AI</span>
          </span>
        </div>
        <button
          onClick={toggle}
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Toggle theme"
        >
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
    </header>
  );
}
