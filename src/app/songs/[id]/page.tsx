import MyAppShell from "@/components/appshell";
import { Alert, Anchor, Button, Flex, Text, Title } from "@mantine/core";
import Link from "next/link";
import ReactPlayer from "react-player";
import NearestSongsCarousel from "@/components/songCards/cardsCarousel";
import { IconAlertTriangle } from "@tabler/icons-react";
import { fetchNearestSongs, fetchSongById } from "@/lib/songs/api";
import { Metadata } from "next";

import "@mantine/charts/styles.css";
import InfoTabs from "./infoTabs";

export const generateMetadata = async ({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> => {
    // ブログの詳細データを取得する関数
    const song = await fetchSongById((await params).id);

    const title = `${song.title} | MIMIさん全曲分析`;
    const description = `「${song.title}」の詳細分析ページ。似ている曲も探せます。`;

    return {
        title: title,
        description: description,
        openGraph: {
            title: song.title,
            description: description,
            url: song.thumbnailURL,
            siteName: "MIMIさん全曲分析",
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
        },
        twitter: {
            card: "summary_large_image",
            title: title,
            description: description,
            images: [song.thumbnailURL],
        },
    };
};

export default async function SongPage({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    const song = await fetchSongById(id);
    const nearestSongs = await fetchNearestSongs(id);

    if (!song) return <MyAppShell>Loading...</MyAppShell>;

    if (!song) return <MyAppShell>曲が見つかりません</MyAppShell>;

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
                <div>
                    <ReactPlayer
                        src={`https://www.youtube.com/watch?v=${song.id}`}
                        width={480}
                        height={270}
                        controls
                        fallback={<div style={{ width: 480, height: 270 }}>Loading...</div>}
                    />
                    <Flex m="md" gap="md" align="center">
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
                <Anchor href={`/songs/?type=nearest&targetSongID=${song.id}`} component={Link}>
                    高度な条件で探す
                </Anchor>
            </Flex>

            <NearestSongsCarousel songs={nearestSongs} loading={false} error={null} />
        </MyAppShell>
    );
}
