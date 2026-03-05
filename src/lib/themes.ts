export const ColorThemes = {
    auto: { value: "auto", label: "自動", mantineScheme: "auto" },
    sky: {
        value: "sky",
        label: "静寂に咲く",
        mantineScheme: "light",
        background: { start: "#dbf3ff", end: "#c3d9eb" },
    },
    teal: {
        value: "teal",
        label: "マシュマリー",
        mantineScheme: "light",
        background: { start: "#e6f5fa", end: "#8bbdc7" },
    },
    indigo: {
        value: "indigo",
        label: "ただ声一つ",
        mantineScheme: "dark",
        background: { start: "#416987", end: "#101947" },
    },
} as const;

export type ColorMode = (typeof ColorThemes)[keyof typeof ColorThemes]["value"];
export const DefaultColorMode = { auto: "sky", light: "sky", dark: "indigo" } as const;
