"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  Suspense,
} from "react";
import { usePathname } from "next/navigation";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function PathnameThemeSynchronizer() {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const { theme } = useTheme();

  useEffect(() => {
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
  }, [theme, isLandingPage]);

  return null;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("carerloop-theme") as Theme | null;
    if (stored === "dark" || stored === "light") {
      setThemeState(stored);
    } else {
      setThemeState("dark");
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("carerloop-theme", newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      <Suspense fallback={null}>
        <PathnameThemeSynchronizer />
      </Suspense>
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
