"use client";

import MyAppShell from "@/components/appshell";
import SongCards from "@/components/songCards/card";
import { useSongs } from "@/hooks/useSongs";
import { Grid, Title } from "@mantine/core";

export default function HomePage() {
    const { songs, loading, error } = useSongs();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <MyAppShell>
                <Title mb="lg">MIMIさん全曲紹介</Title>
                <Title order={2} mb="md">
                    最新の曲
                </Title>
                <Grid>
                    <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
                        <SongCards {...songs[0]} />
                    </Grid.Col>
                </Grid>
            </MyAppShell>
        </>
    );
}
