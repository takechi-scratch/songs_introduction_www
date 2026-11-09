"use client";

import { NextAnchor } from "@/components/nextLink";
import {
    Alert,
    Box,
    Card,
    Flex,
    Grid,
    GridCol,
    SegmentedControl,
    Text,
    Tooltip,
} from "@mantine/core";
import {
    IconClefStaff,
    IconMessageChatbot,
    IconMusic,
    IconUserCircle,
    IconUserHeart,
} from "@tabler/icons-react";
import { useState } from "react";
import { CollectionCategory, CollectionsData } from "./collections";

function CollectionIcon({ category, size }: { category?: CollectionCategory; size: number }) {
    switch (category) {
        case "profile":
            return (
                <Tooltip label="曲の基本情報" events={{ hover: true, focus: true, touch: true }}>
                    <IconUserCircle size={size} color="#fa5252" />
                </Tooltip>
            );
        case "analysis":
            return (
                <Tooltip
                    label="分析データのまとめ"
                    events={{ hover: true, focus: true, touch: true }}
                >
                    <IconClefStaff size={size} color="#228be6" />
                </Tooltip>
            );
        case "recommendation":
            return (
                <Tooltip label="おすすめ" events={{ hover: true, focus: true, touch: true }}>
                    <IconUserHeart size={size} color="#40c057" />
                </Tooltip>
            );
        default:
            return <IconMusic size={size} />;
    }
}

export default function CollectionsList() {
    const [selectedCategory, setSelectedCategory] = useState<CollectionCategory | "all">("all");

    return (
        <>
            <Flex gap="xs" direction={{ base: "column", sm: "row" }} mb="xl" align="center">
                <Text>絞り込み：</Text>
                <SegmentedControl
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    data={[
                        { label: "すべて", value: "all" },
                        { label: "基本情報", value: "profile" },
                        { label: "分析データ", value: "analysis" },
                        { label: "おすすめ", value: "recommendation" },
                        { label: "その他", value: "other" },
                    ]}
                />
            </Flex>
            <Grid gap="md" mb="xl">
                {CollectionsData.filter((collection) => {
                    if (selectedCategory === "all") {
                        return true;
                    }
                    return collection.category === selectedCategory;
                }).map((collection) => (
                    <GridCol key={collection.slug} span={{ base: 12, sm: 6, lg: 4 }}>
                        <Card
                            shadow="sm"
                            p="lg"
                            radius="sm"
                            component={NextAnchor}
                            href={`/collections/${collection.slug}`}
                        >
                            <Flex mb="xs" align="flex-end">
                                <Text fw={500} size="lg">
                                    {collection.title}
                                </Text>
                                <Box ml="auto" />
                                <CollectionIcon category={collection.category} size={24} />
                            </Flex>
                            <Text lineClamp={1} size="sm" opacity={0.6}>
                                {collection.description}
                            </Text>
                        </Card>
                    </GridCol>
                ))}
            </Grid>
            <Alert color="green" icon={<IconMessageChatbot />}>
                <Text size="sm">
                    コレクションは今後も追加予定！新しいコレクションの提案があれば、ぜひ
                    <NextAnchor href="/contact" size="sm">
                        お問い合わせ
                    </NextAnchor>
                    から教えてください！
                </Text>
            </Alert>
        </>
    );
}
