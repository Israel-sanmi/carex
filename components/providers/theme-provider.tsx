"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isLandingPage: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  // Initial load: retrieve user preference
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("carerloop-theme") as Theme | null;
    if (stored === "dark" || stored === "light") {
      setThemeState(stored);
    } else {
      setThemeState("dark");
    }
  }, []);

  // Sync .dark class ONLY when on the landing page ("/")
  // Every other page (auth, onboarding, dashboards) always stays in standard light mode
  useEffect(() => {
    if (!mounted) return;

    if (isLandingPage) {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      // Strictly remove dark class outside the landing page
      document.documentElement.classList.remove("dark");
    }
  }, [theme, isLandingPage, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("carerloop-theme", newTheme);
    if (isLandingPage) {
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, setTheme, isLandingPage }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
