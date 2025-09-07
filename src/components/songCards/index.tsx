import { Card, Group, HoverCard, Image, Text } from "@mantine/core";

export default function Demo() {
    return (
        <Card
            shadow="sm"
            padding="xl"
            component="a"
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            target="_blank"
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
                        <Text size="sm">2025/09/07 12:00に公開</Text>
                    </HoverCard.Dropdown>
                </HoverCard>
            </Group>

            <Text fw={500} size="lg" mt="md">
                テスト曲あああああ
            </Text>
        </Card>
    );
}
