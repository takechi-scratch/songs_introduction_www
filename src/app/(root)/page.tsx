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

import MyAppShell from "@/components/appshell";
import NewSongsCarousel from "@/components/songCards/cardsCarousel";
import { Divider, Flex, Text, Title } from "@mantine/core";
import { motion } from "framer-motion";
import { useIntersection } from "@mantine/hooks";
import { useRef } from "react";
import { useSongs } from "@/hooks/songs";
import { defaultCustomParams } from "@/lib/search/nearest";

const FadeInUp = ({ children, title }: { children: React.ReactNode; title: string }) => {
    // ChatGPTにより生成。内容を一部修正しています
    const containerRef = useRef<HTMLDivElement>(null);
    const { ref } = useIntersection({
        root: containerRef.current,
        threshold: 0.2,
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-16"
            style={{ height: 200 }}
        >
            <Flex align="center" direction="column" justify="center" style={{ height: "100%" }}>
                <Title order={2}>{title}</Title>
                {children}
            </Flex>
        </motion.div>
    );
};

export default function HomePage() {
    const latestSongsData = useSongs(
        "filter",
        { order: "publishedTimestamp" },
        defaultCustomParams
    );
    const colaborationSongsData = useSongs("filter", { publishedType: 0 }, defaultCustomParams);

    return (
        <MyAppShell>
            <Title order={2} mb="md">
                最新の曲
            </Title>
            <NewSongsCarousel
                songs={latestSongsData.songs}
                loading={latestSongsData.loading}
                error={latestSongsData.error}
            />
            <Title order={2} mb="md">
                他チャンネルへの提供曲
            </Title>
            <NewSongsCarousel
                songs={colaborationSongsData.songs}
                loading={colaborationSongsData.loading}
                error={colaborationSongsData.error}
            />

            <Title order={2} mb="md" mt="md">
                「MIMIさん全曲紹介」について
            </Title>
            <FadeInUp title="すべての曲を検索">
                <Text>提供曲を含めた、YouTubeで聴けるほぼすべての曲が検索できます。</Text>
            </FadeInUp>
            <Divider my="xl" />
            <FadeInUp title="お気に入りの曲を発見">
                <Text>
                    全曲の分析データをもとに、「似ている曲」を提案。新たなお気に入りの曲を発見できます。
                </Text>
            </FadeInUp>
            <Title order={2} mb="md">
                知っておいてほしいこと
            </Title>
            <FadeInUp title="さまざまな曲を発見するのが目的です">
                <Text>
                    このサイトは、MIMIさんのさまざまな曲を知ってもらうために作成しました。
                    それぞれの曲に優劣をつけたり、MIMIさんの曲のスタイルを批判したりするといった意図はありません。
                </Text>
            </FadeInUp>
            <Divider my="xl" />
            <FadeInUp title="収益化はしていません">
                <Text>
                    このサイトは個人が趣味で運営しているものです。
                    広告やアフィリエイトなどの収益化は一切行っていません。
                </Text>
            </FadeInUp>
            <Divider my="xl" />
            <FadeInUp title="生成AIを分析に使用することはありません">
                <Text>
                    生成AIはサイトのコーディングにのみ使用しています。
                    分析データは全て製作者が手作業で作成したものです。
                </Text>
                <Text>
                    また、楽曲の分析データをAIの入力として与えることもないよう注意しています。
                </Text>
            </FadeInUp>

            {/* KoeLoop Widget */}
            <div
                id="koeloop-widget-10300196-bddc-4e37-a315-ef77401e6f14"
                style={{ paddingTop: "var(--mantine-spacing-xl)" }}
            ></div>
            <Script
                src="https://koeloop.dev/widget.js"
                strategy="afterInteractive"
                onLoad={() => {
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
        </MyAppShell>
    );
}
