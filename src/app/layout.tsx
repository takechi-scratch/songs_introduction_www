import type { Metadata } from "next";
import "./globals.css";

import Script from "next/script";

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const gaId = process.env.NEXT_PUBLIC_GA_ID;

    return (
        <html lang="ja" {...mantineHtmlProps}>
            <head>
                <ColorSchemeScript />
                {gaId && (
                    <>
                        <Script
                            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                            strategy="afterInteractive"
                        />
                        <Script id="google-analytics" strategy="afterInteractive">
                            {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', '${gaId}');
                        `}
                        </Script>
                    </>
                )}
            </head>
            <body>
                <MantineProvider>
                    <Notifications />
                    <AuthProvider>{children}</AuthProvider>
                </MantineProvider>
            </body>
        </html>
    );
}
