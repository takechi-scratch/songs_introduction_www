export const ColorThemes = {
    auto: { value: "auto", label: "自動", mantineScheme: "auto" },
    blue: {
        value: "blue",
        label: "ハナタバ",
        mantineScheme: "light",
        background: { start: "#e6f5fa", end: "#aedfee" },
    },
    teal: {
        value: "teal",
        label: "マシュマリー",
        mantineScheme: "light",
        background: { start: "#e6f5fa", end: "#8bbdc7" },
    },
    pink: {
        value: "pink",
        label: "花びら哀歌",
        mantineScheme: "light",
        background: { start: "#f8e3ec", end: "#e2b6c8" },
    },
    indigo: {
        value: "indigo",
        label: "ただ声一つ",
        mantineScheme: "dark",
        background: { start: "#416987", end: "#101947" },
    },
} as const;

export type ColorMode = (typeof ColorThemes)[keyof typeof ColorThemes]["value"];
export const DefaultColorMode = { auto: "blue", light: "blue", dark: "indigo" } as const;
