import MyAppShell from "@/components/appshell/myAppshell";
import { scoreCanBeCalculated } from "@/lib/songs/api";
import { Alert, Text } from "@mantine/core";
import { IconExclamationCircle } from "@tabler/icons-react";
import { Metadata } from "next";
import Link from "next/link";

import { fetchCommentsBySongIDAndCache } from "@/lib/interaction/cachedapi";
import {
    fetchAllSongsAndCache,
    fetchNearestSongsAndCache,
    fetchSongByIdAndCache,
} from "@/lib/songs/cachedapi";
import "@mantine/charts/styles.css";
import { Suspense } from "react";
import { SongDetails } from "./songDetails";

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

function SongPageFallback() {
    return (
        <Text mb="lg" visibleFrom="sm">
            曲を読み込んでいます...
        </Text>
    );
}

async function SongLoadingPage({ params }: { params: Promise<{ id: string }> }) {
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
            <>
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
            </>
        );
    }

    const comments = await fetchCommentsBySongIDAndCache(id);

    return <SongDetails song={song} nearestSongs={nearestSongs || []} comments={comments} />;
}

export default async function SongPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <MyAppShell>
            <Suspense fallback={<SongPageFallback />}>
                <SongLoadingPage params={params} />
            </Suspense>
        </MyAppShell>
    );
}

export async function generateStaticParams() {
    const songs = await fetchAllSongsAndCache();
    return songs.map((song) => ({ id: song.id }));
}
