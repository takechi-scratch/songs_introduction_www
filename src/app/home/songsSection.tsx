"use client";

import { useEffect } from "react";
import SongsCarousel from "@/components/songCards/cardsCarousel";
import { Song, SongWithScore } from "@/lib/songs/types";
import { Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";

export default function SongsSection({
    latestSongsData,
    colaborationSongsData,
}: {
    latestSongsData?: Song[] | SongWithScore[] | undefined;
    colaborationSongsData?: Song[] | SongWithScore[] | undefined;
}) {
    useEffect(() => {
        if (!latestSongsData || !colaborationSongsData) {
            notifications.show({
                title: "データ取得失敗",
                message: "最新の曲や提供曲を取得できませんでした。時間をおいて再度お試しください。",
                color: "red",
            });
        }
    }, [latestSongsData, colaborationSongsData]);

    return (
        <>
            {latestSongsData && (
                <>
                    <Title order={2} mb="md">
                        最新の曲
                    </Title>
                    <SongsCarousel songs={latestSongsData} />
                </>
            )}
            {colaborationSongsData && (
                <>
                    <Title order={2} mb="md">
                        他チャンネルへの提供曲
                    </Title>
                    <SongsCarousel songs={colaborationSongsData} />
                </>
            )}
        </>
    );
}
