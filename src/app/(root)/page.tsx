"use client";

import MyAppShell from "@/components/appshell";
import NewSongsCarousel from "@/components/songCards/cardsCarousel";
import { Alert, Divider, Text, Title } from "@mantine/core";
import { useSongs } from "@/hooks/songs";
import { defaultCustomParams } from "@/lib/search/nearest";
import KoeLoopWidget from "@/components/feedbackWidget";
import { IconMessagePlus } from "@tabler/icons-react";
import { FadeInUp } from "@/components/animatedContents";

export default function HomePage() {
    const latestSongsData = useSongs(
        "filter",
        { order: "publishedTimestamp" },
        defaultCustomParams
    );
    const colaborationSongsData = useSongs("filter", { publishedType: 0 }, defaultCustomParams);

    return (
        <MyAppShell>
            <Alert title="お知らせ" color="blue" mb="lg" icon={<IconMessagePlus />}>
                <Text size="sm">
                    現在、「機械的に分析データを作成することについてのアンケート」を実施しています。
                </Text>
                <Text size="sm">
                    <a
                        href="https://x.com/takechi_scratch/status/1986981649213759768"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        投票する(X)
                    </a>
                </Text>
            </Alert>
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

            <Title order={2} mt="lg">
                フィードバック・機能投票
            </Title>
            <KoeLoopWidget />

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
        </MyAppShell>
    );
}
