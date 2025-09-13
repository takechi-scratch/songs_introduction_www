import { Card, Group, HoverCard, Image, Text } from "@mantine/core";
import { Song, SongWithScore, hasScore } from "@/lib/songs/types";
import { formatDate } from "@/lib/date";
import Link from "next/link";

export default function SongCard({ song }: { song: Song | SongWithScore }) {
    let hoverData;
    if (hasScore(song)) {
        hoverData = <Text size="sm">類似度: {(song.score * 100).toFixed(2)}%</Text>;
        song = song.song as Song;
    } else {
        hoverData = (
            <HoverCard width={200} shadow="md">
                <HoverCard.Target>
                    <Text mt="xs" c="dimmed" size="sm">
                        1日前
                    </Text>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                    <Text size="sm">{formatDate(song.publishedTimestamp)}</Text>
                </HoverCard.Dropdown>
            </HoverCard>
        );
    }

    return (
        <Card
            shadow="sm"
            padding="xl"
            component={Link}
            style={{ height: 300 }}
            href={`/songs/${song.id}/`}
        >
            <Card.Section>
                <Image
                    src={song.thumbnailURL}
                    h={150}
                    alt={`${song.title}のサムネイル`}
                    // fit="contain"
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
