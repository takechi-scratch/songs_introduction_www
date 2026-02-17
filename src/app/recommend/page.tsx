"use client";

import MyAppShell from "@/components/appshell";
import ReactPlayer from "react-player";
import { useAdvancedSearch } from "@/hooks/songs";
import { SearchQuery } from "@/lib/search/filter";
import { hasScore, Song } from "@/lib/songs/types";
import {
    Alert,
    Button,
    Checkbox,
    Divider,
    Flex,
    Paper,
    Progress,
    Radio,
    SegmentedControl,
    Stack,
    Text,
    TextInput,
    Title,
    Tooltip,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { IconFlaskFilled } from "@tabler/icons-react";
import Link from "next/link";
import { estimateComparisons } from "@/lib/utils";
import { SongSearchParams } from "@/lib/search/search";

type status = "start" | "prepare" | "choice";
const songsPeriod = {
    "2016年～（ラピスラズリ・マシュマリーなど）": 1468774540,
    "2021年～（よるつむぎ・もでらーとなど）": 1627722009,
    "2022年～（ハナタバ・ポシェットなど）": 1668852009,
    "2023年～（妄想哀歌・はぐなど）": 1686481225,
    "2025年～（サイエンス・恋しくなったら手を叩こうなど）": 1734168615,
};

interface TestSettings {
    name: string;
    limit: number;
}

function Start({ startCallback }: { startCallback?: () => void }) {
    return (
        <Flex direction="column" gap="lg" align="center">
            <Text>質問の結果をもとに、あなたへおすすめの曲を紹介します！</Text>
            <Button size="lg" radius="md" onClick={startCallback}>
                診断を始める
            </Button>
        </Flex>
    );
}

function Prepare({
    searchQuery,
    setSearchQuery,
    proceedCallback,
    settings,
    setSettings,
}: {
    searchQuery: SearchQuery;
    setSearchQuery: (query: SearchQuery) => void;
    proceedCallback?: () => void;
    settings: TestSettings;
    setSettings: (settings: TestSettings) => void;
}) {
    return (
        <Flex direction="column" gap="lg" align="center">
            <Text>まず、いくつかの質問に答えてください。</Text>
            <Stack gap="lg">
                <TextInput
                    label="ニックネーム（結果を共有するときに公開されます）"
                    placeholder="ゲスト"
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.currentTarget.value })}
                />

                <Stack gap={0}>
                    <Text size="sm">診断の質問数</Text>
                    <Text size="xs" c="dimmed" mb="xs">
                        右に行くほど正確に診断できますが、時間がかかります。
                    </Text>
                    <SegmentedControl
                        data={[
                            { label: "少なめ", value: "5" },
                            { label: "普通", value: "8" },
                            { label: "多め", value: "15" },
                            { label: "さらに多め", value: "20" },
                        ]}
                        defaultValue="8"
                        value={String(settings.limit)}
                        onChange={(value) => setSettings({ ...settings, limit: Number(value) })}
                    />
                </Stack>

                <Radio.Group
                    name="startFrom"
                    label="MIMIさんの楽曲で、知っているのはいつ頃からですか？"
                    value={String(searchQuery.publishedAfter || "")}
                    onChange={(value) =>
                        setSearchQuery({
                            ...searchQuery,
                            publishedAfter: Number(value),
                        })
                    }
                >
                    <Stack gap="xs" mt="xs">
                        {Object.entries(songsPeriod).map(([label, timestamp]) => (
                            <Radio key={timestamp} value={String(timestamp)} label={label} />
                        ))}
                    </Stack>
                </Radio.Group>
                <Divider />
                <Checkbox
                    label="提供曲も質問に含める"
                    checked={searchQuery.publishedType !== 1}
                    onChange={(e) =>
                        setSearchQuery({
                            ...searchQuery,
                            publishedType: e.currentTarget.checked ? undefined : 1,
                        })
                    }
                />
            </Stack>
            <Button size="lg" radius="md" onClick={proceedCallback}>
                質問へ進む
            </Button>
        </Flex>
    );
}

type SongsBetter = Map<string, Set<string>>;

function Choice({
    songs,
    navigateToResults,
    backToPrepare,
}: {
    songs: Song[];
    navigateToResults: (sortedSongIDs: string[]) => void;
    backToPrepare: () => void;
}) {
    const [comparisons, setComparisons] = useState<SongsBetter>(new Map());
    const [currentPair, setCurrentPair] = useState<[Song, Song] | null>(null);

    const [sortedSongs, validAnswersCount] = useMemo(() => {
        console.log("Current comparisons:", comparisons);
        if (songs.length === 0) return [[], 0];
        let count = 0;

        try {
            return [
                songs.toSorted((a, b) => {
                    const aBetterThanB = comparisons.get(b.id)?.has(a.id) ?? false;
                    const bBetterThanA = comparisons.get(a.id)?.has(b.id) ?? false;

                    if (aBetterThanB) {
                        count += 1;
                        return -1; // Aの方が良い
                    } else if (bBetterThanA) {
                        count += 1;
                        return 1; // Bの方が良い
                    } else {
                        setCurrentPair([a, b]);
                        throw new Error("Comparison needed");
                    }
                }),
                count,
            ];
        } catch {
            return [null, count];
        }
    }, [songs, comparisons]);

    const progress = (validAnswersCount / estimateComparisons(songs.length)) * 100;
    // console.log(estimateComparisons(songs.length));
    // console.log(songs.length * Math.log2(songs.length));

    function handleChoice(better: Song, worse: Song) {
        setComparisons((prev) => {
            const newMap = new Map(prev);
            if (!newMap.has(worse.id)) {
                newMap.set(worse.id, new Set());
            }
            newMap.get(worse.id)?.add(better.id);
            return newMap;
        });
        setCurrentPair(null);
    }

    if (songs.length === 0) {
        return <Text>曲が読み込まれていません。前の画面に戻ってください。</Text>;
    }

    if (sortedSongs) {
        navigateToResults(sortedSongs.map((song) => song.id));
        return <Text>診断が完了しました。結果を読み込み中...</Text>;
    }

    if (!currentPair) {
        return <Text>次の曲を読み込み中...</Text>;
    }

    const [songA, songB] = currentPair;

    return (
        <Stack gap="lg" align="center">
            <Text size="lg" fw={500}>
                どちらの曲が好きですか？
            </Text>

            <Tooltip
                label={`${validAnswersCount} / ${estimateComparisons(songs.length)} （予測のため、質問回数は前後します）`}
            >
                <Progress radius="md" size="lg" value={Math.min(progress, 100)} w="100%" />
            </Tooltip>

            <Flex gap="md" direction={{ base: "column", sm: "row" }} w="100%">
                <Paper
                    withBorder
                    bg="red.0"
                    p="md"
                    onClick={() => handleChoice(songA, songB)}
                    style={{ flex: 1 }}
                >
                    <Flex direction="column" gap="md" align="center">
                        <Text>{songA.title}</Text>
                        <ReactPlayer
                            src={`https://www.youtube.com/watch?v=${songA.id}`}
                            controls
                            fallback={
                                <div style={{ width: "100%", aspectRatio: "16/9" }}>Loading...</div>
                            }
                        />
                    </Flex>
                </Paper>
                <Paper
                    withBorder
                    bg="blue.0"
                    p="md"
                    onClick={() => handleChoice(songB, songA)}
                    style={{ flex: 1 }}
                >
                    <Flex direction="column" gap="md" align="center">
                        <Text>{songB.title}</Text>
                        <ReactPlayer
                            src={`https://www.youtube.com/watch?v=${songB.id}`}
                            controls
                            fallback={
                                <div style={{ width: "100%", aspectRatio: "16/9" }}>Loading...</div>
                            }
                        />
                    </Flex>
                </Paper>
            </Flex>

            <Button variant="subtle" onClick={backToPrepare} color="orange">
                設定に戻る
            </Button>
        </Stack>
    );
}

export default function RecommendPage() {
    const [settings, setSettings] = useState<TestSettings>({ name: "ゲスト", limit: 8 });
    const [status, setStatus] = useState<status>("start");
    const [searchQuery, setSearchQuery] = useState<SongSearchParams>({
        filter: {
            publishedAfter: Math.min(...Object.values(songsPeriod)),
            publishedType: 1,
        },
    });

    const { songs: fetchedSongs, refetch: refetchSongs } = useAdvancedSearch(searchQuery, true);
    const sampleSongs = useMemo(() => {
        const filteredSongs = fetchedSongs.filter((song) => song !== null && !hasScore(song));
        return filteredSongs.slice(0, settings.limit) as Song[];
    }, [fetchedSongs, settings.limit]);

    const router = useRouter();

    console.log("Sample songs for recommendation:", sampleSongs);

    function navigateToResults(sortedSongIDs: string[]) {
        router.push(
            `/recommend/result?name=${encodeURIComponent(
                settings.name
            )}&timestamp=${Date.now()}&preferenceRanking=${sortedSongIDs.join(",")}`
        );
    }

    return (
        <MyAppShell>
            <Title mb="xl">おすすめ曲診断</Title>
            <Alert mb="lg" radius="md" color="green" icon={<IconFlaskFilled />}>
                この機能は現在テスト中です。気づいた点・改善してほしい点があれば、お気軽に
                <Link href="/contact">お問い合わせ</Link>から教えてください！
            </Alert>
            <Paper shadow="md" radius="md" p="lg">
                {status === "start" && <Start startCallback={() => setStatus("prepare")} />}
                {status === "prepare" && (
                    <Prepare
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        proceedCallback={() => {
                            refetchSongs();
                            setStatus("choice");
                        }}
                        settings={settings}
                        setSettings={setSettings}
                    />
                )}
                {status === "choice" && (
                    <Choice
                        songs={sampleSongs}
                        navigateToResults={navigateToResults}
                        backToPrepare={() => setStatus("prepare")}
                    />
                )}
            </Paper>
        </MyAppShell>
    );
}
