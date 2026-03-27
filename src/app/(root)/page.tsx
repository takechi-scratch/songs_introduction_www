import MyAppShell from "@/components/appshell/myAppshell";
import {
    Alert,
    Anchor,
    Divider,
    Flex,
    Grid,
    GridCol,
    Group,
    Image,
    Paper,
    Text,
    Title,
} from "@mantine/core";
import { FadeInUp } from "@/components/animatedContents";
import { PinnedAnnouncements } from "@/components/announcements/manager";
import { Song, SongWithScore } from "@/lib/songs/types";
import { SongsNearestSection, SongsSearchSection } from "./songsSection";
import Link from "next/link";
import {
    IconCurrencyYenOff,
    IconFlaskFilled,
    IconHeart,
    IconMusicHeart,
    IconPlaylist,
    IconRobotOff,
} from "@tabler/icons-react";
import { advancedSearchForSongs, fetchAllSongs, fetchNearestSongs } from "@/lib/songs/api";
import NextImage from "next/image";

export default async function HomePage() {
    let latestSongsData: Song[] | undefined;
    let colaborationSongsData: SongWithScore[] | undefined;

    try {
        // 並列実行で待機時間を短縮
        [latestSongsData, colaborationSongsData] = await Promise.all([
            fetchAllSongs(),
            advancedSearchForSongs({ filter: { publishedType: 0 } }),
        ]);
    } catch (error) {
        console.error("Error fetching songs data:", error);
    }

    const targetSongID = "7xht3kQO_TM";
    const targetSongTitle = "ハナタバ";
    let nearestSongsData: SongWithScore[] | undefined;

    try {
        nearestSongsData = await fetchNearestSongs(targetSongID, 10);
    } catch (error) {
        console.error("Error fetching nearest songs data:", error);
    }

    return (
        <MyAppShell>
            <PinnedAnnouncements />
            <Grid mb="md">
                <GridCol span={{ base: 12, sm: 6 }} p="md">
                    <Text
                        fw={700}
                        style={{ fontSize: "clamp(20px, 3vw, 45px)" }}
                        ta="left"
                        visibleFrom="sm"
                    >
                        MIMIさんのすべての曲から、
                        <br />
                        次のお気に入りを見つけよう。
                    </Text>
                    <Text
                        size="xl"
                        fw={700}
                        style={{ fontSize: "clamp(20px, 5vw, 45px)" }}
                        ta="center"
                        hiddenFrom="sm"
                    >
                        MIMIさんのすべての曲から、
                        <br />
                        次のお気に入りを見つけよう。
                    </Text>
                    <Text mt="xl">
                        ボカロP「MIMI」さんが公開しているすべての曲を見られるサイトです。
                        <br />
                        曲の分析データをもとにしたおすすめ機能も充実。あなたにぴったりの曲が、きっと見つかる。
                    </Text>
                </GridCol>

                <GridCol span={{ base: 12, sm: 6 }}>
                    <Paper radius="md" p="xs" mt="md" mb="xl">
                        {/* TODO: 画像は差し替え予定 */}
                        <Image
                            src="/assets/detail-screenshot.png"
                            radius="md"
                            width={0}
                            height={0}
                            sizes="100%"
                            style={{ width: "100%", height: "auto" }}
                            component={NextImage}
                            alt="MIMIさん全曲紹介のスクリーンショット。「ハナタバ」の詳細情報が表示されている。"
                        />
                    </Paper>
                </GridCol>
            </Grid>
            <Grid mb="md">
                <GridCol span={{ base: 12, sm: 4 }} p="md">
                    <Title order={2} mb="md">
                        MIMIさんの「全曲」を紹介。
                    </Title>
                    <Text>
                        YouTubeで視聴できる150曲以上の曲を、すべて掲載しています。提供曲を探し回る必要はありません。
                    </Text>
                    <Text>
                        また、曲のタイトルはもちろん、ボーカルや曲のキーなど、さまざまな条件から検索できます。
                    </Text>
                </GridCol>
                <GridCol span={{ base: 12, sm: 8 }} p="md">
                    <SongsSearchSection
                        latestSongsData={latestSongsData}
                        colaborationSongsData={colaborationSongsData}
                    />
                </GridCol>
            </Grid>
            <Grid mb="md">
                <GridCol span={{ base: 12, sm: 4 }} p="md">
                    <Title order={2} mb="md">
                        「似ている曲」から好きな曲を発見。
                    </Title>
                    <Text>
                        掲載しているすべての曲には、手作業で作成した分析データがついています。
                        このデータをもとに、その曲と「似ている曲」を確認できます。
                    </Text>
                    <Text>似ている曲をたどっていけば、新しいお気に入りの曲に出会えるかも。</Text>
                </GridCol>
                <GridCol span={{ base: 12, sm: 8 }} p="md">
                    <SongsNearestSection
                        targetSongID={targetSongID}
                        targetSongTitle={targetSongTitle}
                        nearestSongsData={nearestSongsData}
                    />
                </GridCol>
            </Grid>
            <Title order={2} mb="md" mt="md">
                「MIMIさん全曲紹介」の機能
            </Title>
            <Flex gap="md" direction={{ base: "column", sm: "row" }} mb="xl">
                <FadeInUp
                    title="曲一覧"
                    description={
                        "すべての曲を確認・検索できます。\nまた、検索した曲でルーレットを回したり、YouTubeの再生リストを作ったりもできます！"
                    }
                    icon={<IconPlaylist size={40} color="#fd7e14" />}
                    backgroundColor="#fd7e14"
                    href="/songs"
                />
                <FadeInUp
                    title="おすすめ曲診断"
                    description="約20問の質問で、あなたにおすすめのMIMIさんの曲が見つかります！"
                    icon={<IconMusicHeart size={40} color="#40c057" />}
                    backgroundColor="#40c057"
                    href="/recommend"
                />
            </Flex>
            <Title order={2} mb="md">
                知っておいてほしいこと
            </Title>
            <Flex gap="md" direction={{ base: "column", sm: "row" }} mb="xl">
                <FadeInUp
                    title="サイトの目的"
                    description="このサイトは、MIMIさんのさまざまな曲を知ってもらうために製作しました。それぞれの曲に優劣をつけたり、MIMIさんの曲のスタイルを批判したりするといった意図はありません。"
                    icon={<IconHeart size={40} color="#1c7ed6" />}
                />

                <FadeInUp
                    title="収益化はしていません"
                    description="このサイトは個人が趣味で運営しているものです。広告やアフィリエイトなどの収益化は一切行っていません。"
                    icon={<IconCurrencyYenOff size={40} color="#1c7ed6" />}
                />

                <FadeInUp
                    title="分析に生成AIは使用しません"
                    description={
                        "分析データは全て製作者が手作業で作成したものです。また、楽曲の分析データをAIの入力として与えることもないよう注意しています。\nただし、サイトのコーディングでは一部生成AIを使用することがあります。"
                    }
                    icon={<IconRobotOff size={40} color="#1c7ed6" />}
                />
            </Flex>
            <Divider mb="xl" />
            <Group gap="xl">
                <Anchor component={Link} href="/contact">
                    お問い合わせ・ご意見
                </Anchor>
                <Anchor component={Link} href="/home">
                    旧トップページへ
                </Anchor>
            </Group>
        </MyAppShell>
    );
}
