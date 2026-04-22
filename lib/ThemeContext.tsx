"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type VibePreset = "handdrawn";

export const VIBE_PRESETS: {
    id: VibePreset;
    label: string;
    emoji: string;
    preview: string[];
    light?: boolean;
}[] = [
    {
        id: "handdrawn",
        label: "Hand-Drawn",
        emoji: "✏️",
        preview: ["#ff4d4d", "#fff9c4", "#fdfbf7"],
        light: true,
    },
];

type ThemeContextType = {
    theme: VibePreset;
    setTheme: (t: VibePreset) => void;
};

const ThemeContext = createContext<ThemeContextType>({
    theme: "handdrawn",
    setTheme: () => {},
});

export function BridgrThemeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [theme, setThemeState] = useState<VibePreset>("handdrawn");

    useEffect(() => {
        // Always use handdrawn theme - no switching
        document.documentElement.dataset.theme = "handdrawn";
    }, []);

    const setTheme = (t: VibePreset) => {
        // Theme is locked to handdrawn, but keep the API for compatibility
        setThemeState("handdrawn");
        document.documentElement.dataset.theme = "handdrawn";
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
