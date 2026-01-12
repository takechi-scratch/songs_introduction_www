import MyAppShell from "@/components/appshell";
import { Button, Center, Divider, Text, Title } from "@mantine/core";
import KoeLoopWidget from "@/components/feedbackWidget";
import { FadeInUp } from "@/components/animatedContents";
import { PinnedAnnouncements } from "@/components/announcements/manager";
import { fetchSongs } from "@/lib/songs/api";
import { Song } from "@/lib/songs/types";
import SongsSection from "./songsSection";
import Link from "next/link";
import { IconPlaylist } from "@tabler/icons-react";

export default async function HomePage() {
    let latestSongsData: Song[] | undefined;
    let colaborationSongsData: Song[] | undefined;

    try {
        // 並列実行で待機時間を短縮
        [latestSongsData, colaborationSongsData] = await Promise.all([
            fetchSongs({ order: "publishedTimestamp" }),
            fetchSongs({ publishedType: 0 }),
        ]);
    } catch (error) {
        console.error("Error fetching songs data:", error);
    }

    return (
        <MyAppShell>
            <PinnedAnnouncements />
            <SongsSection
                latestSongsData={latestSongsData}
                colaborationSongsData={colaborationSongsData}
            />

            <Center>
                <Button
                    mt="md"
                    mb="xl"
                    href="/songs/"
                    color="orange.7"
                    size="xl"
                    radius="lg"
                    component={Link}
                >
                    <IconPlaylist size={20} style={{ marginRight: 8 }} />
                    すべての曲を見る
                </Button>
            </Center>

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
