import MyAppShell from "@/components/appshell/myAppshell";
import NearestSongsCarousel from "@/components/songCards/cardsCarousel";
import { scoreCanBeCalculated } from "@/lib/songs/api";
import { Alert, Flex, Paper, Text, Title } from "@mantine/core";
import { IconAlertTriangle, IconExclamationCircle } from "@tabler/icons-react";
import { Metadata } from "next";
import Link from "next/link";
import ReactPlayer from "react-player";

import { NextAnchor } from "@/components/nextLink";
import { fetchCommentsBySongID } from "@/lib/interaction/api";
import {
    fetchAllSongsAndCache,
    fetchNearestSongsAndCache,
    fetchSongByIdAndCache,
} from "@/lib/songs/cachedapi";
import "@mantine/charts/styles.css";
import { Suspense } from "react";
import rison from "rison";
import CommentSection from "./commentSection";
import InfoTabs from "./infoTabs";

export const generateMetadata = async ({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> => {
    // ブログの詳細データを取得する関数
    let song;
    try {
        song = await fetchSongByIdAndCache((await params).id);
    } catch (error) {
        console.error("Error fetching song data for metadata:", error);
        return {};
    }

    const title = `${song.title} | MIMIさん全曲紹介`;
    const description = `「${song.title}」の詳細分析ページ。似ている曲も探せます。`;

    const metadata: Metadata = {
        title: title,
        description: description,
    };

    if (song.thumbnailURL) {
        metadata.openGraph = {
            title: song.title,
            description: description,
            url: song.thumbnailURL,
            siteName: "MIMIさん全曲紹介",
            images: [
                {
                    url: song.thumbnailURL,
                    width: 1280,
                    height: 720,
                    alt: song.title,
                },
            ],
            locale: "ja_JP",
            type: "website",
        };
        metadata.twitter = {
            card: "summary_large_image",
            title: title,
            description: description,
            images: [song.thumbnailURL],
        };
    }

    return metadata;
};

export default async function SongPage({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;

    let song, nearestSongs;
    try {
        song = await fetchSongByIdAndCache(id);
        if (scoreCanBeCalculated(song)) {
            nearestSongs = await fetchNearestSongsAndCache(id);
        }
    } catch (error) {
        console.error("Error fetching song data:", error);
        return (
            <MyAppShell>
                <Alert
                    variant="light"
                    color="red"
                    radius="md"
                    mb="lg"
                    title="取得エラー"
                    icon={<IconExclamationCircle />}
                >
                    曲のデータを取得できませんでした。時間を置いて再度アクセスしてください。
                </Alert>
                <Link href="/">ホームに戻る</Link>
            </MyAppShell>
        );
    }

    const comments = await fetchCommentsBySongID(id);

    return (
        <MyAppShell>
            <Title order={1} size="h2" mb="lg" visibleFrom="sm">
                {song.title}
            </Title>
            <Title order={1} size="h3" mb="lg" hiddenFrom="sm">
                {song.title}
            </Title>
            {song.publishedType === -1 && (
                <Alert
                    variant="light"
                    color="orange"
                    radius="md"
                    mb="lg"
                    title="この曲はまだ公開されていません"
                    icon={<IconAlertTriangle />}
                >
                    <Text>
                        データは先行情報から予想したものであり、不正確である可能性があるので注意してください。
                    </Text>
                    <Text>また、公開後に本ページのリンクが変更される場合があります。</Text>
                </Alert>
            )}
            <Flex direction={{ base: "column", md: "row" }} gap="md">
                <div style={{ width: "100%", maxWidth: "480px" }}>
                    <div
                        style={{
                            width: "100%",
                            aspectRatio: "16/9",
                        }}
                    >
                        <Suspense>
                            <ReactPlayer
                                src={`https://www.youtube.com/watch?v=${song.id}&cc_load_policy=0`}
                                width="100%"
                                height="100%"
                                controls
                                fallback={
                                    <div style={{ width: "100%", aspectRatio: "16/9" }}>
                                        Loading...
                                    </div>
                                }
                            />
                        </Suspense>
                    </div>
                    <Flex m="md" gap="md" align="center" direction={{ base: "column", sm: "row" }}>
                        <NextAnchor href="/">ホームに戻る</NextAnchor>
                    </Flex>
                </div>
                <Paper p="md" radius="md" shadow="sm" withBorder style={{ flex: 1 }}>
                    <InfoTabs song={song} />
                </Paper>
            </Flex>

            <Flex mb="md" mt="xl" gap="xl" align="end">
                <Title order={2}>似ている曲</Title>
                {nearestSongs && (
                    <NextAnchor
                        href={`/songs/?params=${rison.encode_object({ nearest: { targetSongID: song.id } })}`}
                    >
                        高度な条件で探す
                    </NextAnchor>
                )}
            </Flex>

            {nearestSongs ? (
                <NearestSongsCarousel songs={nearestSongs} />
            ) : (
                <Text>分析データが不足しているため、似ている曲を算出できません。</Text>
            )}

            <Title mb="md" mt="xl" order={2}>
                コメント
            </Title>
            <CommentSection songID={song.id} initialComments={comments} />
        </MyAppShell>
    );
}

export async function generateStaticParams() {
    const songs = await fetchAllSongsAndCache();
    return songs.map((song) => ({ id: song.id }));
}
