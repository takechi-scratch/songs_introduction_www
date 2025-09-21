"use client";

import MyAppShell from "@/components/appshell";
import NewSongsCarousel from "@/components/songCards/cardsCarousel";
import { Divider, Flex, Text, Title } from "@mantine/core";
import { motion } from "framer-motion";
import { useIntersection } from "@mantine/hooks";
import { useRef } from "react";
import { useSongs } from "@/hooks/songs";

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
    const latestSongsData = useSongs();
    // なぜか提供曲の絞り込みを作っていなかったので後で
    // const colaborationSongsData = useSongs({ isPublishedInOriginalChannel: true });

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
                「MIMIさん全曲紹介」について
            </Title>
            <FadeInUp title="お気に入りの曲を発見">
                <Text>
                    知らない曲を発見するために、全曲の分析データを作成。これをもとに、「似ている曲」を提案します。
                </Text>
            </FadeInUp>
            <Title order={2} mb="md">
                知っておいてほしいこと
            </Title>
            <FadeInUp title="さまざまな曲を発見するのが目的です">
                <Text>
                    このサイトは、MIMIさんのさまざまな曲を知ってもらうために作成しました。
                    それぞれの曲に優劣をつけたり、曲の感じ方を強制したりするといった意図はありません。
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
                    分析データは全て製作者が手動で行ったものです。
                </Text>
                <Text>
                    また、楽曲の分析データをAIの入力として与えることもないよう注意しています。
                </Text>
            </FadeInUp>
        </MyAppShell>
    );
}
