import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Noto_Sans_JP } from "next/font/google";

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"] });

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./globals.css";

import { ColorSchemeScript, MantineProvider, mantineHtmlProps, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

import { AuthProvider } from "@/contexts/AuthContext";
import { ColorModeProvider } from "@/contexts/ThemeContext";
import { ColorMode, ColorThemes } from "@/lib/themes";

const title = "MIMIさん全曲紹介";
const description = "MIMIさんの曲を全曲掲載・おすすめの曲が見つかるアプリ。";
const imageUrl = "https://mimi.takechi.f5.si/assets/card.png";

export const metadata: Metadata = {
    title: title,
    description: description,
    openGraph: {
        title: title,
        description: description,
        url: imageUrl,
        siteName: title,
        images: [
            {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: title,
            },
        ],
        locale: "ja_JP",
        type: "website",
    },
    twitter: {
        card: "summary",
        title: title,
        description: description,
        images: [imageUrl],
    },
};

const theme = createTheme({
    fontFamily: "Noto Sans JP, Arial, sans-serif",
});

export async function RootLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    function toColorMode(value: string | undefined): ColorMode {
        if (value && ColorThemes.hasOwnProperty(value)) {
            return value as ColorMode;
        }
        return "auto";
    }

    const initialColorMode = toColorMode(cookieStore.get("colorMode")?.value);

    return (
        <html lang="ja" {...mantineHtmlProps} className={notoSansJP.className}>
            <head>
                <ColorSchemeScript defaultColorScheme="auto" />
            </head>
            <body>
                <MantineProvider theme={theme} defaultColorScheme="auto">
                    <ModalsProvider>
                        <Notifications />
                        <AuthProvider>
                            <ColorModeProvider initialColorMode={initialColorMode}>
                                {children}
                            </ColorModeProvider>
                        </AuthProvider>
                    </ModalsProvider>
                </MantineProvider>
            </body>
        </html>
    );
}

export default RootLayout;
