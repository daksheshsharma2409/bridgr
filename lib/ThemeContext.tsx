"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type VibePreset = "midnight" | "cyberpunk" | "forest" | "vaporwave" | "solar" | "ocean" | "petal" | "sage";

export const VIBE_PRESETS: { id: VibePreset; label: string; emoji: string; preview: string[]; light?: boolean }[] = [
  {
    id: "midnight",
    label: "Midnight Hacker",
    emoji: "🌑",
    preview: ["#FF4D00", "#EAB308", "#050505"],
  },
  {
    id: "cyberpunk",
    label: "Cyberpunk",
    emoji: "⚡",
    preview: ["#00F5FF", "#FF00A0", "#050A1A"],
  },
  {
    id: "forest",
    label: "Forest Mode",
    emoji: "🌿",
    preview: ["#22C55E", "#EAB308", "#061210"],
  },
  {
    id: "vaporwave",
    label: "Vaporwave",
    emoji: "🌸",
    preview: ["#A855F7", "#FF6EC7", "#120020"],
  },
  // ── Light mode ──────────────────────────────────────────────
  {
    id: "solar",
    label: "Solar Cream",
    emoji: "☀️",
    preview: ["#E86B00", "#D97706", "#FDFAF4"],
    light: true,
  },
  {
    id: "ocean",
    label: "Ocean Breeze",
    emoji: "🌊",
    preview: ["#0066FF", "#F59E0B", "#F0F6FF"],
    light: true,
  },
  {
    id: "petal",
    label: "Petal",
    emoji: "🌸",
    preview: ["#E11D78", "#F97316", "#FFF5F9"],
    light: true,
  },
  {
    id: "sage",
    label: "Sage",
    emoji: "🌿",
    preview: ["#15803D", "#CA8A04", "#F2FAF5"],
    light: true,
  },
];

type ThemeContextType = {
  theme: VibePreset;
  setTheme: (t: VibePreset) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "midnight",
  setTheme: () => {},
});

export function BridgrThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<VibePreset>("midnight");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bridgr_vibe") as VibePreset | null;
      if (stored && VIBE_PRESETS.find(p => p.id === stored)) {
        setThemeState(stored);
        document.documentElement.dataset.theme = stored;
      }
    } catch {}
  }, []);

  const setTheme = (t: VibePreset) => {
    setThemeState(t);
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem("bridgr_vibe", t);
    } catch {}
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useVibeTheme() {
  return useContext(ThemeContext);
}
