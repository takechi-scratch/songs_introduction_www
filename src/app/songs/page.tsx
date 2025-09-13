"use client";

import MyAppShell from "@/components/appshell";
import CardsList from "@/components/songCards/cardsList";
import { useSongs } from "@/hooks/songs";
import { Title } from "@mantine/core";

export default function Page() {
    const { songs, loading, error } = useSongs();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <MyAppShell>
            <Title order={2} mb="md">
                曲一覧
            </Title>
            <CardsList songs={songs} />
        </MyAppShell>
    );
}
