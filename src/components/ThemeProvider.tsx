"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export const THEMES = [
  { id: "bubblegum", label: "Bubblegum", swatch: ["#FF4D9D", "#B14CFF", "#FFB13C"] },
  { id: "sunrise", label: "Sunrise", swatch: ["#FF6B3D", "#E94CC8", "#FFB13C"] },
  { id: "midnight", label: "Midnight", swatch: ["#8B7BFF", "#FF6BD9", "#4FE3C2"] },
  { id: "meadow", label: "Meadow", swatch: ["#2BC48A", "#4FB6E3", "#F8C44A"] },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

const ThemeContext = createContext<{
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
}>({ theme: "bubblegum", setTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

function applyTheme(t: string) {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", t);
  }
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>("bubblegum");

  useEffect(() => {
    // Load the creator's saved theme
    fetch("/api/creator")
      .then((r) => r.json())
      .then((d) => {
        const t = d?.creator?.theme;
        if (t) {
          setThemeState(t);
          applyTheme(t);
        }
      })
      .catch(() => {});
  }, []);

  const setTheme = (t: ThemeId) => {
    setThemeState(t);
    applyTheme(t);
    fetch("/api/creator", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: t }),
    }).catch(() => {});
  };

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}
