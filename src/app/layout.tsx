import type { Metadata } from "next";
import "./globals.css";

import Script from "next/script";

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from "@mantine/core";

export const metadata: Metadata = {
    title: "MIMIさん全曲紹介",
    description: "MIMIさんの曲を全曲掲載・おすすめの曲が見つかるアプリ。",
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
                            async
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
                <MantineProvider>{children}</MantineProvider>
            </body>
        </html>
    );
}
