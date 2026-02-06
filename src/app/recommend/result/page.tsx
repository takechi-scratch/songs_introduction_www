import MyAppShell from "@/components/appshell";
import SongsCarousel from "@/components/songCards/cardsCarousel";
import { formatDateTime } from "@/lib/date";
import { fetchNearestSongs } from "@/lib/songs/api";
import { hasScore, Song, SongWithScore } from "@/lib/songs/types";
import { Alert, Text, Title } from "@mantine/core";
import { IconFlaskFilled } from "@tabler/icons-react";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

interface Props {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getRecommendedSongs(
    preferenceRankingParam: string
): Promise<Song[] | SongWithScore[] | null> {
    const preferenceRanking = preferenceRankingParam.split(",").map((item) => item.trim());
    if (
        preferenceRanking.length === 0 ||
        preferenceRanking.length > 20 ||
        preferenceRanking.some((item) => item === "")
    ) {
        return null;
    }

    const preferenceScores: { [key: string]: number } = {};
    const preferenceSongs: { [key: string]: Song } = {};
    const weightSum =
        (preferenceRanking.length *
            (preferenceRanking.length + 1) *
            (2 * preferenceRanking.length + 1)) /
        6;

    await Promise.all(
        preferenceRanking.map(async (targetSongID, index) => {
            const weight = Math.pow(preferenceRanking.length - index, 2);
            const nearestSongs = await fetchNearestSongs(targetSongID, 50);
            nearestSongs.forEach((song) => {
                if (!(song.id in preferenceScores)) {
                    preferenceScores[song.id] = 0;
                }
                preferenceScores[song.id] += (song.score * weight) / weightSum;
                preferenceSongs[song.id] = song.song;
            });
        })
    );

    const recommendedSongs = Object.keys(preferenceSongs).map((key) => ({
        id: key,
        song: preferenceSongs[key],
        score: preferenceScores[key],
    }));
    recommendedSongs.sort((a, b) => b.score - a.score);
    recommendedSongs.splice(0, preferenceRanking.length);
    return recommendedSongs;
}

export const generateMetadata = async ({ searchParams }: Props): Promise<Metadata> => {
    const params = await searchParams;
    const name = params.name;
    const preferenceRankingParam = params.preferenceRanking;
    const metadata: Metadata = {
        title: `${name} さんのおすすめ曲診断結果 | MIMIさん全曲紹介`,
        description: "おすすめ曲診断の結果ページ。",
    };

    if (typeof preferenceRankingParam === "string") {
        const recommendedSongs = await getRecommendedSongs(preferenceRankingParam);
        if (!recommendedSongs || recommendedSongs.length == 0) {
            return metadata;
        }
        if (hasScore(recommendedSongs[0])) {
            metadata.description = `最もおすすめの曲は「${recommendedSongs[0].song.title}」でした。`;
        }
    }
    return metadata;
};

async function RecommendResultPage(props: Props) {
    const params = await props.searchParams;
    const name = params.name;
    const timestamp = params.timestamp;
    const preferenceRankingParam = params.preferenceRanking;
    if (
        typeof name !== "string" ||
        typeof timestamp !== "string" ||
        typeof preferenceRankingParam !== "string"
    ) {
        return (
            <>
                <Text mb="md">データが不足しているため、診断できません。</Text>
                <Link href="/recommend">診断ページへ</Link>
            </>
        );
    }

    const recommendedSongs = await getRecommendedSongs(preferenceRankingParam);
    if (recommendedSongs === null) {
        return (
            <>
                <Text mb="md">データが不正なため、診断できません。</Text>
                <Link href="/recommend">診断ページへ</Link>
            </>
        );
    }

    return (
        <>
            <Text mb="md">{name} さんへおすすめの曲はこちら！</Text>
            <SongsCarousel songs={recommendedSongs} />
            <Text mb="md">診断日時: {formatDateTime(Number(timestamp) / 1000)}</Text>
            <Link href="/recommend">もう一度診断</Link>
        </>
    );
}

export default async function RecommendPage(props: Props) {
    return (
        <MyAppShell>
            <Title mb="xl">診断結果</Title>
            <Alert mb="lg" radius="md" color="green" icon={<IconFlaskFilled />}>
                この機能は現在テスト中です。気づいた点・改善してほしい点があれば、お気軽に
                <Link href="/contact">お問い合わせ</Link>から教えてください！
            </Alert>
            <Suspense fallback={<Text>結果を読み込み中...</Text>}>
                <RecommendResultPage searchParams={props.searchParams} />
            </Suspense>
        </MyAppShell>
    );
}
