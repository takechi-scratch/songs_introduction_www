"use client";

import MyAppShell from "@/components/appshell";
import CardsList from "@/components/songCards/cardsList";
import { useSongs } from "@/hooks/songs";
import { FilterableContents, SortableKeys } from "@/lib/search/filter";
import {
    Title,
    Tabs,
    Accordion,
    Select,
    TextInput,
    Button,
    Text,
    SegmentedControl,
} from "@mantine/core";
import { useState } from "react";

function FilterTab({
    searchQuery,
    setSearchType,
    setSearchQuery,
    refetch,
}: {
    searchQuery: Record<string, string | boolean>;
    setSearchType: (type: "filter" | "nearest") => void;
    setSearchQuery: (query: Record<string, string | boolean>) => void;
    refetch: () => void;
}) {
    return (
        <>
            {FilterableContents.map((content) => (
                <TextInput
                    key={content.key}
                    label={
                        <Text size="sm" style={{ width: 100 }}>
                            {content.displayName}
                        </Text>
                    }
                    placeholder={content.example}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 10,
                    }}
                    onChange={(e) =>
                        setSearchQuery({ ...searchQuery, [content.key]: e.target.value })
                    }
                />
            ))}
            <Select
                data={Object.keys(SortableKeys)}
                label="並び替え"
                defaultValue="公開日時"
                mt="md"
                onChange={(value) =>
                    setSearchQuery({
                        ...searchQuery,
                        order: value ? SortableKeys[value as keyof typeof SortableKeys] : "",
                    })
                }
            />
            <SegmentedControl
                data={["昇順", "降順"]}
                mt="sm"
                defaultValue="降順"
                onChange={(value) => setSearchQuery({ ...searchQuery, asc: value === "昇順" })}
            />
            <Button
                fullWidth
                mt="md"
                onClick={() => {
                    setSearchType("filter");
                    setSearchQuery(searchQuery);
                    refetch();
                }}
            >
                検索
            </Button>
        </>
    );
}

function NearestTab() {
    return "現在準備中！";
}

export default function Page() {
    const [searchType, setSearchType] = useState<"filter" | "nearest">("filter");
    const [customParams, setCustomParams] = useState<{ id?: string; limit?: number }>({});
    const [searchQuery, setSearchQuery] = useState<Record<string, string | boolean>>(
        Object.fromEntries(FilterableContents.map((content) => [content.key, ""]))
    );
    const { songs, loading, error, refetch } = useSongs(searchType, searchQuery, customParams);

    if (error) return <div>Error: {error}</div>;

    return (
        <MyAppShell>
            <Title order={2} mb="md">
                曲一覧
            </Title>

            <Accordion variant="separated" m="md">
                <Accordion.Item key="検索" value="検索">
                    <Accordion.Control icon="🔍">検索</Accordion.Control>
                    <Accordion.Panel>
                        <Tabs defaultValue="filter">
                            <Tabs.List grow justify="center" mb="md">
                                <Tabs.Tab value="filter">絞り込み</Tabs.Tab>
                                <Tabs.Tab value="nearest">似ている曲</Tabs.Tab>
                            </Tabs.List>
                            <Tabs.Panel value="filter">
                                <FilterTab
                                    searchQuery={searchQuery}
                                    setSearchType={setSearchType}
                                    setSearchQuery={setSearchQuery}
                                    refetch={refetch}
                                />
                            </Tabs.Panel>
                            <Tabs.Panel value="nearest">
                                <NearestTab />
                            </Tabs.Panel>
                        </Tabs>
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>

            {!loading && (
                <Text size="sm" ta="right" m="md">
                    検索結果: {songs.length}曲
                </Text>
            )}
            <CardsList songs={songs} />
        </MyAppShell>
    );
}
