"use client";

import MyAppShell from "@/components/appshell";
import CardsList from "@/components/songCards/cardsList";
import { useSongs } from "@/hooks/songs";
import { FilterableKeys, SortableKeys } from "@/lib/search/filter";
import { Title, Tabs, Accordion, Select, TextInput, Button } from "@mantine/core";

function SearchBar() {
    return (
        <>
            <Tabs defaultValue="filter">
                <Tabs.List grow justify="center" mb="md">
                    <Tabs.Tab value="filter">絞り込み</Tabs.Tab>
                    <Tabs.Tab value="nearest">似ている曲</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="filter">
                    {Object.keys(FilterableKeys).map((key) => (
                        <TextInput key={key} label={key} placeholder={`Enter ${key}`} />
                    ))}
                    <Select
                        data={Object.keys(SortableKeys)}
                        label="並び替え"
                        placeholder="1つ選択"
                        mt="md"
                    />
                </Tabs.Panel>
                <Tabs.Panel value="nearest">現在準備中！</Tabs.Panel>
            </Tabs>
            <Button fullWidth mt="md">
                検索
            </Button>
        </>
    );
}

export default function Page() {
    const { songs, loading, error } = useSongs();

    if (loading) return <div>Loading...</div>;
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
                        <SearchBar />
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>

            <CardsList songs={songs} />
        </MyAppShell>
    );
}
