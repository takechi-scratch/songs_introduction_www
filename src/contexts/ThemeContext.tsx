// src/contexts/ColorModeContext.tsx
"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useMantineColorScheme } from "@mantine/core";
import { ColorMode, ColorThemes } from "@/lib/themes";

export const COLOR_MODE_COOKIE_KEY = "colorMode";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

interface ColorModeContextType {
    colorMode: ColorMode;
    setColorMode: (mode: ColorMode) => void;
    mantineScheme: "light" | "dark" | "auto";
}

const ColorModeContext = createContext<ColorModeContextType | undefined>(undefined);

interface ColorModeProviderProps {
    children: React.ReactNode;
    initialColorMode?: ColorMode;
}

export function ColorModeProvider({ children, initialColorMode = "auto" }: ColorModeProviderProps) {
    const { setColorScheme } = useMantineColorScheme();

    const [colorMode, setColorModeState] = useState<ColorMode>(initialColorMode);
    const mantineScheme = ColorThemes[colorMode]?.mantineScheme || "auto";

    const setColorMode = useCallback((mode: ColorMode) => {
        setColorModeState(mode);
    }, []);

    useEffect(() => {
        setColorModeState(initialColorMode);
    }, [initialColorMode]);

    // colorModeが変更されたら実際のモードを計算してMantineに反映
    useEffect(() => {
        const mantineScheme = ColorThemes[colorMode]?.mantineScheme || "auto";
        setColorScheme(mantineScheme);

        document.cookie = `${COLOR_MODE_COOKIE_KEY}=${colorMode}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
    }, [colorMode, setColorScheme]);

    const value = useMemo(
        () => ({ colorMode, setColorMode, mantineScheme }),
        [colorMode, setColorMode, mantineScheme]
    );

    return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
}

export function useColorMode() {
    const context = useContext(ColorModeContext);
    if (!context) throw new Error("useColorMode must be used within ColorModeProvider");
    return context;
}
