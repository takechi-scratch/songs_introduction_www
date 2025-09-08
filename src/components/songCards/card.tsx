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
                    src="https://images.unsplash.com/photo-1579227114347-15d08fc37cae?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
                    h={200}
                    // fit="contain"
                    alt="No way!"
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
