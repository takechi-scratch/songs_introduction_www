"use client";

import MyAppShell from "@/components/appshell";
import NewSongsCarousel from "@/components/songCards/newSongs";
import { Title } from "@mantine/core";

export default function HomePage() {
    return (
        <MyAppShell>
            <Title order={2} mb="md">
                最新の曲
            </Title>
            <NewSongsCarousel />
        </MyAppShell>
    );
}
