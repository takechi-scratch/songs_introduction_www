import type { Metadata } from "next";
import "./globals.css";

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from "@mantine/core";

export const metadata: Metadata = {
    title: "MIMIさん全曲紹介",
    description: "MIMIさんの曲を全曲掲載・おすすめの曲が見つかるアプリ。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ja" {...mantineHtmlProps}>
            <head>
                <ColorSchemeScript />
            </head>
            <body>
                <MantineProvider>{children}</MantineProvider>
            </body>
        </html>
    );
}
