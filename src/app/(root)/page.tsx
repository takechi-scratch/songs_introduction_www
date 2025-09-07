"use client";

import MyAppShell from "@/components/appshell";
import SongCards from "@/components/songCards";
import { Grid, Title } from "@mantine/core";

export default function HomePage() {
    return (
        <>
            <MyAppShell>
                <Title mb="lg">MIMIさん全曲紹介</Title>
                <Title order={2} mb="md">
                    最新の曲
                </Title>
                <Grid>
                    <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
                        <SongCards />
                    </Grid.Col>
                </Grid>
            </MyAppShell>
        </>
    );
}
