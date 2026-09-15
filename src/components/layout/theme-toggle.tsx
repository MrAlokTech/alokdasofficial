"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="min-h-[44px] min-w-[44px] h-[44px] w-[44px] flex items-center justify-center rounded-xl border border-transparent"
        aria-hidden="true"
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="min-h-[44px] min-w-[44px] h-[44px] w-[44px] flex items-center justify-center rounded-xl border border-border/70 bg-card/60 text-foreground/80 transition-all hover:bg-secondary/70 hover:text-foreground active:scale-95 focus-visible:ring-2 focus-visible:ring-ring"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform duration-200" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 transition-transform duration-200" />
      )}
    </button>
  );
}
