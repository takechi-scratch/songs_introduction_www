import type { Metadata } from "next";
import "./globals.css";
// import { Noto_Sans_JP } from "next/font/google";

// 将来的に移行予定
// Noto_Sans_JP();

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { ColorSchemeScript, MantineProvider, mantineHtmlProps, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

import { AuthProvider } from "@/contexts/AuthContext";

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
        card: "summary_large_image",
        title: title,
        description: description,
        images: [imageUrl],
    },
};

const theme = createTheme({
    // fontFamily: "Noto Sans JP, Arial, sans-serif",
});

export function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ja" {...mantineHtmlProps}>
            <head>
                <ColorSchemeScript />
            </head>
            <body>
                <MantineProvider theme={theme}>
                    <ModalsProvider>
                        <Notifications />
                        <AuthProvider>{children}</AuthProvider>
                    </ModalsProvider>
                </MantineProvider>
            </body>
        </html>
    );
}

export default RootLayout;
