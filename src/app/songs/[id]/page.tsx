import MyAppShell from "@/components/appshell";
import { Alert, Anchor, Button, Flex, Text, Title } from "@mantine/core";
import Link from "next/link";
import ReactPlayer from "react-player";
import NearestSongsCarousel from "@/components/songCards/cardsCarousel";
import { IconAlertTriangle, IconExclamationCircle } from "@tabler/icons-react";
import { fetchNearestSongs, fetchSongById, scoreCanBeCalculated } from "@/lib/songs/api";
import { Metadata } from "next";

import "@mantine/charts/styles.css";
import InfoTabs from "./infoTabs";
import { Suspense } from "react";

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
                    {error instanceof Error ? error.message : String(error)}
                </Alert>
                <Link href="/">ホームに戻る</Link>
            </MyAppShell>
        );
    }

    return (
        <MyAppShell>
            <Title mb="lg">曲ID: {song.id}</Title>
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
                        <Button
                            component="a"
                            href={`https://www.youtube.com/watch?v=${song.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="filled"
                            color="red"
                        >
                            Youtubeで聴く
                        </Button>
                        <Button
                            component="a"
                            href={`https://open.spotify.com/search/${encodeURIComponent(
                                song.title
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="filled"
                            color="teal"
                        >
                            Spotifyで検索
                        </Button>
                        <Anchor href="/" component={Link}>
                            ホームに戻る
                        </Anchor>
                    </Flex>
                </div>
                <InfoTabs song={song} />
            </Flex>

            <Flex mb="md" mt="xl" gap="xl" align="end">
                <Title order={2}>似ている曲</Title>
                {nearestSongs && (
                    <Anchor href={`/songs/?type=nearest&targetSongID=${song.id}`} component={Link}>
                        高度な条件で探す
                    </Anchor>
                )}
            </Flex>

            {nearestSongs ? (
                <NearestSongsCarousel songs={nearestSongs} loading={false} error={null} />
            ) : (
                <Text>分析データが不足しているため、似ている曲を算出できません。</Text>
            )}
        </MyAppShell>
    );
}
