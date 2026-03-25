import MyAppShell from "@/components/appshell/myAppshell";
import {
    Alert,
    Button,
    Flex,
    Grid,
    GridCol,
    Group,
    Image,
    Paper,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { FadeInUp } from "@/components/animatedContents";
import { PinnedAnnouncements } from "@/components/announcements/manager";
import { Song, SongWithScore } from "@/lib/songs/types";
import SongsSection from "./songsSection";
import Link from "next/link";
import {
    IconCurrencyYenOff,
    IconFlaskFilled,
    IconHeart,
    IconInfoCircle,
    IconMusicHeart,
    IconPlaylist,
    IconRobotOff,
} from "@tabler/icons-react";
import { advancedSearchForSongs, fetchAllSongs } from "@/lib/songs/api";
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

    return (
        <MyAppShell>
            <PinnedAnnouncements />
            <Alert
                icon={<IconFlaskFilled />}
                title="このサイトはベータ版です"
                color="green"
                mb="lg"
            >
                <Text>
                    サイトデザインの変更・おすすめ曲診断などの新機能を予定しています。ご意見があれば「お問い合わせ」でお気軽にご連絡ください。
                </Text>
                <Text>アップデートは3月下旬～4月上旬ごろの予定です！</Text>
            </Alert>

            <Grid mb="md">
                <GridCol span={{ base: 12, sm: 6 }} p="md">
                    <Text
                        // size={{ base: "xl", sm: "2xl" }}
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
                        ボカロP「MIMI」さんが公開しているすべての曲を検索できるサイトです。
                        <br />
                        曲の分析データをもとにしたおすすめ機能も充実。あなたにぴったりの曲がきっと見つかります！
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

            <SongsSection
                latestSongsData={latestSongsData}
                colaborationSongsData={colaborationSongsData}
            />

            <Title order={2} mb="md" mt="md">
                「MIMIさん全曲紹介」の機能
            </Title>
            <Flex gap="md" direction={{ base: "column", sm: "row" }} mb="xl">
                <FadeInUp
                    title="すべての曲を検索"
                    description={
                        "提供曲を含めた、150以上の曲を掲載。提供曲を探す手間はかかりません。\nまた、検索した曲でルーレットを回したり、YouTubeの再生リストを作ることもできます！"
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
        </MyAppShell>
    );
}
