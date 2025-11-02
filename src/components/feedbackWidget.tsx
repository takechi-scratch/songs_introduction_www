"use client";

import Script from "next/script";

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
            locale: string;
            apiBase: string;
        }) => void;
    }
}

export default function KoeLoopWidget() {
    return (
        <>
            <div
                id="koeloop-widget-10300196-bddc-4e37-a315-ef77401e6f14"
                style={{ paddingTop: "var(--mantine-spacing-xl)" }}
            ></div>
            <Script
                src="https://koeloop.dev/widget.js"
                strategy="afterInteractive"
                onReady={() => {
                    // ウィジェットスクリプトが読み込まれた後にKoeLoopWidgetを初期化
                    if (typeof window !== "undefined" && window.KoeLoopWidget) {
                        new window.KoeLoopWidget({
                            productId: "10300196-bddc-4e37-a315-ef77401e6f14",
                            containerId: "koeloop-widget-10300196-bddc-4e37-a315-ef77401e6f14",
                            theme: "light",
                            primaryColor: "#1864ab",
                            showVoting: true,
                            showFeedback: true,
                            showFAQ: false,
                            locale: "ja",
                            apiBase: "https://koeloop.dev",
                        });
                    }
                }}
            />
        </>
    );
}
