"use client";

import { useTheme, THEMES, ThemeId } from "./ThemeProvider";
import { Check } from "lucide-react";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {THEMES.map((t) => {
        const active = theme === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id as ThemeId)}
            className={`card relative flex flex-col items-start gap-3 p-4 text-left transition-transform hover:-translate-y-0.5 ${
              active ? "ring-2 ring-c1" : ""
            }`}
          >
            <div className="flex gap-1.5">
              {t.swatch.map((c) => (
                <span key={c} className="h-6 w-6 rounded-full" style={{ background: c }} />
              ))}
            </div>
            <span className="text-sm font-semibold text-ink">{t.label}</span>
            {active && (
              <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-c1 text-white">
                <Check size={12} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
