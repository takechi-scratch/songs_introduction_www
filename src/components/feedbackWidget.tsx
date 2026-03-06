"use client";

import { useColorMode } from "@/contexts/ThemeContext";
import { Skeleton } from "@mantine/core";
import Script from "next/script";
import { useEffect, useState } from "react";

// KoeLoopWidget の型定義
declare global {
    interface Window {
        KoeLoopWidget: new (config: {
            productId: string;
            containerId: string;
            theme: string;
            primaryColor: string;
            showVoting: boolean;
            showFeedback: boolean;
            showFAQ: boolean;
            showEmailField: boolean;
            locale: string;
            apiBase: string;
        }) => void;
    }
}

export default function KoeLoopWidget() {
    const [isLoading, setIsLoading] = useState(true);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const { mantineScheme } = useColorMode();

    useEffect(() => {
        // スクリプトが読み込まれていない場合は何もしない
        if (!scriptLoaded || !window.KoeLoopWidget) {
            return;
        }

        new window.KoeLoopWidget({
            productId: "10300196-bddc-4e37-a315-ef77401e6f14",
            containerId: "koeloop-widget-10300196-bddc-4e37-a315-ef77401e6f14",
            theme: mantineScheme,
            primaryColor: "#1864ab",
            showVoting: true,
            showFeedback: true,
            showFAQ: false,
            showEmailField: true,
            locale: "ja",
            apiBase: "https://koeloop.dev",
        });
        setIsLoading(false);

        return () => {
            // クリーンアップ: ウィジェットのコンテナを空にする
            const container = document.getElementById(
                "koeloop-widget-10300196-bddc-4e37-a315-ef77401e6f14"
            );
            if (container) {
                container.innerHTML = "";
            }
        };
    }, [scriptLoaded, mantineScheme]);

    return (
        <>
            <Skeleton
                visible={isLoading}
                height={isLoading ? 600 : undefined}
                mt="md"
                mb="xl"
                radius="lg"
            >
                <div id="koeloop-widget-10300196-bddc-4e37-a315-ef77401e6f14"></div>
            </Skeleton>
            <Script
                src="https://koeloop.dev/widget.js"
                strategy="afterInteractive"
                onReady={() => {
                    // スクリプトが読み込まれたことを通知
                    setScriptLoaded(true);
                }}
            />
        </>
    );
}
