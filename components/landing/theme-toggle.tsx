"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full p-2" aria-hidden="true" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2 rounded-full glass hover:bg-white/20 dark:hover:bg-slate-800/80 text-ink dark:text-slate-200 transition-all cursor-pointer flex items-center justify-center shadow-xs"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
      ) : (
        <Moon className="w-4 h-4 text-teal-deep hover:-rotate-12 transition-transform" />
      )}
    </button>
  );
}

