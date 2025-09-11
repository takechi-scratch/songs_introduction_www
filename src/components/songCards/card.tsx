import { Card, Group, HoverCard, Image, Text } from "@mantine/core";
import { Song } from "@/lib/songs/types";
import { formatDate } from "@/lib/date";
import Link from "next/link";

export default function Demo(song: Song) {
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
                    // fit="contain"
                />
            </Card.Section>

            <Group justify="flex-end" mt="xs">
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
            </Group>

            <Text fw={500} size="lg" mt="md">
                {song.title}
            </Text>
        </Card>
    );
}
