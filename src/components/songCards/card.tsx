import { Card, Group, HoverCard, Image, Skeleton, Text, Tooltip } from "@mantine/core";
import { Song, SongWithScore, hasScore } from "@/lib/songs/types";
import { formatDate, formatElapsedSeconds } from "@/lib/date";
import Link from "next/link";
import { IconCalendarClock } from "@tabler/icons-react";

export default function SongCard({ song }: { song: Song | SongWithScore | null }) {
    if (!song) return <Skeleton height={350} />;

    let hoverData;
    if (hasScore(song)) {
        hoverData = <Text size="sm">類似度: {(song.score * 100).toFixed(2)}%</Text>;
        song = song.song as Song;
    } else {
        const timeDiff = Number(Date.now() / 1000 - song.publishedTimestamp);
        hoverData = (
            <>
                {song.publishedType === -1 && (
                    <Tooltip label="仮掲載中（不正確な可能性あり）">
                        <IconCalendarClock color="#ffa94d" />
                    </Tooltip>
                )}
                <HoverCard width={200} shadow="md">
                    <HoverCard.Target>
                        <Text mt="xs" c="dimmed" size="sm">
                            {timeDiff < 0 ? "公開予定" : `${formatElapsedSeconds(timeDiff)}前`}
                        </Text>
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                        <Text size="sm">{formatDate(song.publishedTimestamp)}</Text>
                    </HoverCard.Dropdown>
                </HoverCard>
            </>
        );
    }

    return (
        <Card
            shadow="sm"
            padding="xl"
            component={Link}
            style={{ height: 350 }}
            href={`/songs/${song.id}/`}
        >
            <Card.Section>
                <Image
                    src={song.thumbnailURL}
                    h={200}
                    alt={`${song.title}のサムネイル`}
                    fit="contain"
                />
            </Card.Section>

            <Group justify="flex-end" mt="xs">
                {hoverData}
            </Group>

            <Text size="md" mt="md">
                {song.title}
            </Text>
        </Card>
    );
}
