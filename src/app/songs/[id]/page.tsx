import MyAppShell from "@/components/appshell/myAppshell";
import { Alert, Anchor, Box, Button, Divider, Flex, Paper, Text, Title } from "@mantine/core";
import Link from "next/link";
import ReactPlayer from "react-player";
import NearestSongsCarousel from "@/components/songCards/cardsCarousel";
import { IconAlertTriangle, IconExclamationCircle, IconFlaskFilled } from "@tabler/icons-react";
import {
    fetchAllSongs,
    fetchNearestSongs,
    fetchSongById,
    scoreCanBeCalculated,
} from "@/lib/songs/api";
import { Metadata } from "next";

import "@mantine/charts/styles.css";
import InfoTabs from "./infoTabs";
import { Suspense } from "react";
import { CommentCard, NewCommentCard } from "@/components/commentCard";
import { fetchCommentsBySongID } from "@/lib/interaction/api";
import rison from "rison";

export const generateMetadata = async ({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> => {
    // ブログの詳細データを取得する関数
    let song;
    try {
        song = await fetchSongById((await params).id);
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
        song = await fetchSongById(id);
        if (scoreCanBeCalculated(song)) {
            nearestSongs = await fetchNearestSongs(id);
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
                                src={`https://www.youtube.com/watch?v=${song.id}`}
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
                        <Anchor href="/" component={Link}>
                            ホームに戻る
                        </Anchor>
                    </Flex>
                </div>
                <Paper p="md" radius="md" shadow="sm" withBorder style={{ flex: 1 }}>
                    <InfoTabs song={song} />
                </Paper>
            </Flex>

            <Flex mb="md" mt="xl" gap="xl" align="end">
                <Title order={2}>似ている曲</Title>
                {nearestSongs && (
                    <Anchor
                        href={`/songs/?params=${rison.encode_object({ nearest: { targetSongID: song.id } })}`}
                        component={Link}
                    >
                        高度な条件で探す
                    </Anchor>
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
            <Paper p="md" radius="md" shadow="xs">
                <Alert color="green" icon={<IconFlaskFilled />} mb="md">
                    <Text size="sm">コメント機能は現在ベータ版として公開しています。</Text>
                    <Text size="sm">
                        不適切なコメントを見つけたら、
                        <Anchor href="/contact" component={Link}>
                            お問い合わせ
                        </Anchor>
                        からご報告をお願いいたします。
                    </Text>
                </Alert>
                <NewCommentCard songID={song.id} />

                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <Box key={comment.id}>
                            <Divider my="sm" />
                            <CommentCard comment={comment} />
                        </Box>
                    ))
                ) : (
                    <>
                        <Text mb="lg">
                            この曲にはまだコメントがありません。最初のコメントを投稿しましょう！
                        </Text>
                    </>
                )}
            </Paper>
        </MyAppShell>
    );
}

export async function generateStaticParams() {
    const songs = await fetchAllSongs();
    return songs.map((song) => ({ id: song.id }));
}

// バックエンドで曲を直接追加したら、管理者ページからRevalidteを行う
export const dynamicParams = false;
