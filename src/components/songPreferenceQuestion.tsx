import { Song } from "@/lib/songs/types";
import { estimateComparisons } from "@/lib/utils";
import { Stack, Progress, Flex, Paper, alpha, Text, Tooltip } from "@mantine/core";
import { useState, useMemo } from "react";
import ReactPlayer from "react-player";

type SongsBetter = Map<string, Set<string>>;

export default function SongPreferenceQuestion({
    songs,
    completedCallback,
}: {
    songs: Song[];
    completedCallback: (sortedSongIDs: Song[]) => void;
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
        return <Text style={{ textAlign: "center" }}>曲データを読み込み中...</Text>;
    }

    if (sortedSongs) {
        completedCallback(sortedSongs);
    }

    if (!currentPair) {
        return <Text style={{ textAlign: "center" }}>次の曲を読み込み中...</Text>;
    }

    const [songA, songB] = currentPair;

    return (
        <Stack gap="lg" align="center">
            <Text size="lg" fw={500}>
                どちらの曲が好きですか？
            </Text>

            <Tooltip
                label={`${validAnswersCount} / ${estimateComparisons(songs.length)} （予測のため、質問回数は前後します）`}
                events={{ hover: true, focus: true, touch: true }}
            >
                <Progress radius="md" size="lg" value={Math.min(progress, 100)} w="100%" />
            </Tooltip>

            <Flex gap="md" direction={{ base: "column", sm: "row" }} w="100%">
                <Paper
                    withBorder
                    bg={alpha("var(--mantine-color-red-4)", 0.3)}
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
                    bg={alpha("var(--mantine-color-blue-4)", 0.3)}
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
        </Stack>
    );
}
