import MyAppShell from "@/components/appshell";
import SongsCarousel from "@/components/songCards/cardsCarousel";
import { formatDateTime } from "@/lib/date";
import { fetchNearestSongs } from "@/lib/songs/api";
import { hasScore, Song, SongWithScore } from "@/lib/songs/types";
import { Alert, Button, Text, Title } from "@mantine/core";
import { IconFlaskFilled } from "@tabler/icons-react";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import CreatePlaylistButton from "./createPlaylist";
import MantineMarkdown from "@/components/markdown";

interface Props {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getRecommendedSongs(
    preferenceRankingParam: string,
    powerForRankingWeight: number = 2,
    powerForEachScore: number = 1,
    maxResults: number = 15
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
    const weightSum = Array.from({ length: preferenceRanking.length })
        .keys()
        .map((index) => Math.pow(preferenceRanking.length - index, powerForRankingWeight))
        .reduce((a, b) => a + b, 0);

    await Promise.all(
        preferenceRanking.map(async (targetSongID, index) => {
            const weight = Math.pow(preferenceRanking.length - index, powerForRankingWeight);
            const nearestSongs = await fetchNearestSongs(targetSongID, 1 << 28);
            nearestSongs.forEach((song) => {
                if (!(song.id in preferenceScores)) {
                    preferenceScores[song.id] = 0;
                }
                preferenceScores[song.id] +=
                    Math.pow(song.score, powerForEachScore) * (weight / weightSum);
                preferenceSongs[song.id] = song.song;
            });
        })
    );

    const recommendedSongs = Object.keys(preferenceSongs).map((key) => ({
        id: key,
        song: preferenceSongs[key],
        score: Math.pow(preferenceScores[key], 1 / (powerForEachScore + powerForRankingWeight)),
    }));
    recommendedSongs.sort((a, b) => b.score - a.score);
    return recommendedSongs.slice(0, maxResults);
}

export const generateMetadata = async ({ searchParams }: Props): Promise<Metadata> => {
    const params = await searchParams;
    const name = params.name;
    const preferenceRankingParam = params.preferenceRanking;

    const title = `${name} さんのおすすめ曲診断結果 | MIMIさん全曲紹介`;
    let description = "おすすめ曲診断の結果ページ。";
    const imageURL = "https://mimi.takechi.f5.si/assets/card.png";

    if (typeof preferenceRankingParam === "string") {
        const recommendedSongs = await getRecommendedSongs(preferenceRankingParam);
        if (recommendedSongs && recommendedSongs.length > 0 && hasScore(recommendedSongs[0])) {
            description = `最もおすすめの曲は「${recommendedSongs[0].song.title}」でした。`;
        }
    }

    return {
        title: `${name} さんのおすすめ曲診断結果 | MIMIさん全曲紹介`,
        description: description,
        openGraph: {
            title: title,
            description: description,
            url: imageURL,
            siteName: "MIMIさん全曲紹介",
            images: {
                url: imageURL,
                width: 1280,
                height: 720,
                alt: `${name} さんのおすすめ曲診断結果`,
            },
            locale: "ja_JP",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: title,
            description: description,
            images: imageURL,
        },
    };
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

    const recommendedSongs = await getRecommendedSongs(preferenceRankingParam, 2, 1);
    const recommendedSongs2 = await getRecommendedSongs(preferenceRankingParam, 2, 5);
    const recommendedSongs3 = await getRecommendedSongs(preferenceRankingParam, 5, 1);
    if (recommendedSongs === null) {
        return (
            <>
                <Text mb="md">データが不正なため、診断できません。</Text>
                <Link href="/recommend">診断ページへ</Link>
            </>
        );
    }

    const baseURL = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/recommend/result`;
    const paramsInURL = new URLSearchParams(
        Object.entries(params) as [string, string][]
    ).toString();

    return (
        <>
            <Text mb="md">{name} さんへおすすめの曲はこちら！</Text>

            <Title order={2} mb="sm">
                パターン1
            </Title>
            <SongsCarousel songs={recommendedSongs} />

            <Title order={2} mb="sm">
                パターン2
            </Title>
            <SongsCarousel songs={recommendedSongs2 ?? []} displayNotice={false} />

            <Title order={2} mb="sm">
                パターン3
            </Title>
            <SongsCarousel songs={recommendedSongs3 ?? []} displayNotice={false} />

            <Text mb="md">診断日時: {formatDateTime(Number(timestamp) / 1000)}</Text>
            <CreatePlaylistButton songs={recommendedSongs} name={name} />
            <Button
                component="a"
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${name} さんへのおすすめ曲はこちら！\n#MIMIさん全曲紹介\n${baseURL}?${paramsInURL}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                color="gray"
                mr="md"
            >
                Xでシェア
            </Button>
            <Link href="/recommend">もう一度診断</Link>
        </>
    );
}

const explanation = `
## 診断のしくみ（詳しい情報）

おすすめ曲診断は以下の手順で行われます。
1. 公開日時・提供曲かどうかの条件で絞り込み、ランダムにいくつかの曲（5曲～20曲）を選出。これをサンプル曲と呼びます。
2. 「どちらの曲が好きですか？」で2択を選んでもらい、サンプル曲における、選んだ人の好みのランキングを作成。
3. サンプル曲に「似ている曲」を分析データから取得して、おすすめ曲として表示。

曲ごとに「好みスコア」（類似度の重み付き平均）を計算して、高い順におすすめ曲としています。
具体的には、
1. サンプル曲内のランキングが高いほど、好みスコアへの影響度が大きいようにする
2. サンプル曲との「類似度」が高いほど、好みスコアへ大きく反映させる

ようにスコアを決めています。

この強め具合をどのくらいにしたら最適かはよく分かっていないため、現在いろいろ試しているところです。
ちなみに、上の「パターン2」が、1の影響を強めたもので、「パターン3」が、2の影響を強めたものです。

みなさんの診断の感想があると、おすすめの精度をよりよくする助けになります。
どのパターンが良かったか教えてくれると嬉しいです！

診断アルゴリズムのコードは、[GitHub](https://github.com/takechi-scratch/songs_introduction_www/blob/main/src/app/recommend/result/page.tsx)で公開しています。興味のある方はぜひ見てみてください。
`;

export default async function RecommendPage(props: Props) {
    return (
        <MyAppShell>
            <Title mb="md">診断結果</Title>
            <Alert mb="lg" radius="md" color="green" icon={<IconFlaskFilled />}>
                <Text size="sm">この機能は現在テスト中です。</Text>
                <Text size="sm">
                    診断アルゴリズムを比較するため、おすすめ曲の候補を複数表示しています。
                    どのおすすめが最もあなたに合っているか、
                    <Link href="/contact">お問い合わせ</Link>でぜひ教えてください！
                </Text>
            </Alert>
            <Suspense fallback={<Text>結果を読み込み中...</Text>}>
                <RecommendResultPage searchParams={props.searchParams} />
            </Suspense>
            <MantineMarkdown text={explanation} />
        </MyAppShell>
    );
}
