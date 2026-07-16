import type { Config } from "tailwindcss";

// Colors reference CSS variables that hold *space-separated RGB channels*
// (e.g. --c1: 255 107 61), so Tailwind's opacity modifiers like bg-c1/20 work.
// Theme palettes are swapped via [data-theme] in globals.css.
const withVar = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: withVar("--bg"),
        "bg-2": withVar("--bg2"),
        surface: withVar("--card"),
        "surface-2": withVar("--bg2"),
        card: withVar("--card"),
        border: withVar("--line"),
        ink: withVar("--ink"),
        "ink-2": withVar("--ink2"),
        muted: withVar("--ink3"),
        c1: withVar("--c1"),
        c2: withVar("--c2"),
        c3: withVar("--c3"),
        c4: withVar("--c4"),
        c5: withVar("--c5"),
        c6: withVar("--c6"),
        accent: withVar("--c5"),
        // "halo" scale maps to the violet accent so existing utilities recolor
        halo: {
          50: withVar("--c4"),
          100: withVar("--c4"),
          200: withVar("--c4"),
          300: withVar("--c4"),
          400: withVar("--c4"),
          500: withVar("--c4"),
          600: withVar("--c4"),
          700: withVar("--c4"),
        },
      },
      fontFamily: {
        sans: ["var(--font-geist)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        xl: "18px",
        "2xl": "22px",
        "3xl": "28px",
      },
      boxShadow: {
        sm: "0 1px 2px rgb(var(--ink) / 0.06), 0 2px 8px rgb(var(--ink) / 0.04)",
        md: "0 8px 24px rgb(var(--ink) / 0.08), 0 2px 6px rgb(var(--ink) / 0.05)",
        lg: "0 24px 60px rgb(var(--ink) / 0.14), 0 4px 12px rgb(var(--ink) / 0.06)",
        glow: "0 8px 30px rgb(var(--c1) / 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
