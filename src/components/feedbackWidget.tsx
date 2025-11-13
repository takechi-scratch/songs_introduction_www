"use client";

import { Skeleton } from "@mantine/core";
import Script from "next/script";
import { useState } from "react";

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
                            showEmailField: true,
                            locale: "ja",
                            apiBase: "https://koeloop.dev",
                        });
                        setIsLoading(false);
                    }
                }}
            />
        </>
    );
}
