// src/contexts/ColorModeContext.tsx
"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useMantineColorScheme } from "@mantine/core";
import { ColorMode, ColorThemes } from "@/lib/themes";

export const COLOR_MODE_COOKIE_KEY = "colorMode";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
const BROADCAST_CHANNEL_NAME = "theme-sync";

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

    // 無限ループを防ぐためのフラグ
    const isUpdatingFromBroadcast = useRef(false);
    const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

    const setColorMode = useCallback((mode: ColorMode) => {
        setColorModeState(mode);
    }, []);

    useEffect(() => {
        setColorModeState(initialColorMode);
    }, [initialColorMode]);

    // BroadcastChannelの初期化
    useEffect(() => {
        // BroadcastChannel APIが利用可能かチェック
        if (typeof BroadcastChannel === "undefined") {
            return;
        }

        const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        broadcastChannelRef.current = channel;

        // 他のタブからのメッセージを受信
        channel.onmessage = (event) => {
            if (event.data?.type === "theme-change" && event.data?.colorMode) {
                isUpdatingFromBroadcast.current = true;
                setColorModeState(event.data.colorMode);
            }
        };

        return () => {
            channel.close();
            broadcastChannelRef.current = null;
        };
    }, []);

    // colorModeが変更されたら実際のモードを計算してMantineに反映
    useEffect(() => {
        const mantineScheme = ColorThemes[colorMode]?.mantineScheme || "auto";
        setColorScheme(mantineScheme);

        // 他のタブからの更新の場合はCookieの設定とブロードキャストをスキップ
        if (isUpdatingFromBroadcast.current) {
            isUpdatingFromBroadcast.current = false;
            return;
        }

        // Cookieを設定
        document.cookie = `${COLOR_MODE_COOKIE_KEY}=${colorMode}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;

        // 他のタブに変更を通知
        if (broadcastChannelRef.current) {
            broadcastChannelRef.current.postMessage({
                type: "theme-change",
                colorMode: colorMode,
            });
        }
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
