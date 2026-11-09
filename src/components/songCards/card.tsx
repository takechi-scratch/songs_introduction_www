"use client";

import { formatDateTime, formatElapsedSeconds } from "@/lib/date";
import { Song, SongWithScore, hasScore } from "@/lib/songs/types";
import {
    AspectRatio,
    Flex,
    Group,
    HoverCard,
    Image,
    Paper,
    Skeleton,
    Text,
    Tooltip,
} from "@mantine/core";
import { IconCalendarClock } from "@tabler/icons-react";
import Link from "next/link";
import { Suspense } from "react";

export function SongCardSkeleton() {
    return <Skeleton height={350} />;
}

function HoverData({
    song,
    score,
    displayScore,
}: {
    song: Song;
    score: number | null;
    displayScore: boolean | null;
}) {
    if (displayScore === null && typeof score === "number") {
        displayScore = true;
    }

    if (displayScore) {
        if (typeof score === "number") {
            return <Text size="sm">類似度: {(score * 100).toFixed(2)}%</Text>;
        } else {
            return (
                <Text size="sm" c="dimmed">
                    類似度: 不明
                </Text>
            );
        }
    } else {
        const timeDiff = Number(Date.now() / 1000 - song.publishedTimestamp);
        return (
            <>
                {song.publishedType === -1 && (
                    <Tooltip
                        label="仮掲載中（不正確な可能性あり）"
                        events={{ hover: true, focus: true, touch: true }}
                    >
                        <IconCalendarClock color="#ffa94d" />
                    </Tooltip>
                )}
                <HoverCard width={200} shadow="md">
                    <HoverCard.Target>
                        <Text c="dimmed" size="sm">
                            {timeDiff < 0 ? "公開予定" : `${formatElapsedSeconds(timeDiff)}前`}
                        </Text>
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                        <Text size="sm">{formatDateTime(song.publishedTimestamp)}</Text>
                    </HoverCard.Dropdown>
                </HoverCard>
            </>
        );
    }
}

export default function SongCard({
    song,
    isHighLighted,
    displayScore = null,
    forceFullSize = false,
}: {
    song: Song | SongWithScore | null;
    isHighLighted?: boolean;
    displayScore?: boolean | null;
    forceFullSize?: boolean;
}) {
    if (!song) return <SongCardSkeleton />;

    let score = null;
    if (hasScore(song)) {
        score = song.score;
        song = song.song;
    }

    return (
        <>
            <Paper
                className={`${!forceFullSize && "hidden md:block"}`}
                shadow="sm"
                component={Link}
                style={{
                    height: 350,
                    border: isHighLighted ? "4px solid #fd7e14" : undefined,
                    color: "black",
                }}
                href={`/songs/${song.id}/`}
            >
                <AspectRatio ratio={16 / 9}>
                    <Image
                        src={song.thumbnailURL || null}
                        alt={`${song.title}のサムネイル`}
                        fit="cover"
                        h="100%"
                        w="100%"
                        style={{ objectPosition: "center" }}
                    />
                </AspectRatio>

                <Flex direction="column" h="auto" px="xl">
                    <Group justify="flex-end" mt="md">
                        <Suspense fallback={<Skeleton width={80} height={20} />}>
                            <HoverData song={song} score={score} displayScore={displayScore} />
                        </Suspense>
                    </Group>

                    <Text size="md" mt="md">
                        {song.title}
                    </Text>
                </Flex>
            </Paper>
            {!forceFullSize && (
                <Paper
                    className="block md:hidden"
                    shadow="sm"
                    component={Link}
                    style={{
                        border: isHighLighted ? "4px solid #fd7e14" : undefined,
                        color: "black",
                    }}
                    href={`/songs/${song.id}/`}
                >
                    <Flex align="stretch" wrap="nowrap">
                        <AspectRatio ratio={16 / 9} w="40%">
                            <Image
                                src={song.thumbnailURL || null}
                                alt={`${song.title}のサムネイル`}
                                fit="cover"
                                h="100%"
                                w="100%"
                                style={{ objectPosition: "center" }}
                            />
                        </AspectRatio>

                        <Flex direction="column" h="100%" flex={1} miw={0} px="md" py="sm">
                            <Group justify="flex-end">
                                <Suspense fallback={<Skeleton width={80} height={20} />}>
                                    <HoverData
                                        song={song}
                                        score={score}
                                        displayScore={displayScore}
                                    />
                                </Suspense>
                            </Group>

                            <Text size="sm" mt="xs" h="2.9em" lineClamp={2}>
                                {song.title}
                            </Text>
                        </Flex>
                    </Flex>
                </Paper>
            )}
        </>
    );
}
