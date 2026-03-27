"use client";

import { useEffect } from "react";
import SongsCarousel from "@/components/songCards/cardsCarousel";
import { Song, SongWithScore } from "@/lib/songs/types";
import { Alert, Anchor, Box, Flex, Group, Switch, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import rison from "rison";

export function SongsSearchSection({
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

    const [showColaborationSongs, { toggle }] = useDisclosure(false);

    if (!latestSongsData || !colaborationSongsData) {
        return (
            <Alert color="red">
                <Text size="sm">最新の曲を読み込めませんでした。</Text>
                <Text size="sm">しばらくしてから再度お試しください。</Text>
            </Alert>
        );
    }

    latestSongsData = latestSongsData.slice(0, 20);
    colaborationSongsData = colaborationSongsData.slice(0, 20);

    let linkToAllSongs = "/songs";
    if (showColaborationSongs) {
        linkToAllSongs = `/songs?params=${rison.encode_object({ filter: { publishedType: 0 } })}`;
    }

    return (
        <>
            <Flex gap={{ base: "md", sm: "xl" }} wrap="wrap" mb="md" align="center">
                <Title order={2} style={{ alignItems: "center" }}>
                    最新の曲
                </Title>
                <Anchor component={Link} href={linkToAllSongs}>
                    もっと見る
                </Anchor>
                <Box style={{ flex: 1 }} />
                <Switch
                    label="提供曲のみに絞り込む"
                    checked={showColaborationSongs}
                    onChange={toggle}
                    style={{ alignItems: "center" }}
                />
            </Flex>
            <SongsCarousel
                songs={showColaborationSongs ? colaborationSongsData : latestSongsData}
                key={String(showColaborationSongs)}
                size="small"
            />
        </>
    );
}

export function SongsNearestSection({
    targetSongID,
    targetSongTitle,
    nearestSongsData,
}: {
    targetSongID: string;
    targetSongTitle: string;
    nearestSongsData: Song[] | SongWithScore[] | undefined;
}) {
    if (!nearestSongsData) {
        return (
            <Alert color="red">
                <Text size="sm">似ている曲のデータを読み込めませんでした。</Text>
                <Text size="sm">しばらくしてから再度お試しください。</Text>
            </Alert>
        );
    }

    return (
        <>
            <Flex gap={{ base: "sm", sm: "xl" }} wrap="wrap" mb="md" align="center">
                <Title order={2} style={{ alignItems: "center" }}>
                    「{targetSongTitle}」に似ている曲
                </Title>
                <Anchor component={Link} href={`/songs/${targetSongID}`}>
                    曲の詳細を見る
                </Anchor>
                <Anchor
                    component={Link}
                    href={`/songs/?params=${rison.encode_object({ nearest: { targetSongID } })}`}
                >
                    高度な条件で探す
                </Anchor>
            </Flex>
            <SongsCarousel songs={nearestSongsData} size="small" />
        </>
    );
}
