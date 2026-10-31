"use client";

import { NextAnchor } from "@/components/nextLink";
import SongsCarousel from "@/components/songCards/cardsCarousel";
import { Comment } from "@/lib/interaction/types";
import { Song, SongWithScore } from "@/lib/songs/types";
import { Alert, Flex, Paper, Text, Title } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import { Suspense } from "react";
import ReactPlayer from "react-player";
import rison from "rison";
import CommentSection from "./commentSection";
import InfoTabs from "./infoTabs";

export function SongDetails({
    song,
    nearestSongs,
    comments,
}: {
    song: Song;
    nearestSongs: SongWithScore[];
    comments: Comment[];
}) {
    return (
        <>
            <Title order={1} size="h2" mb="lg" visibleFrom="sm">
                {song.title}
            </Title>
            <Title order={1} size="h3" mb="lg" hiddenFrom="sm">
                {song.title}
            </Title>
            {song.publishedType === -1 && (
                <Alert
                    variant="light"
                    color="orange"
                    radius="md"
                    mb="lg"
                    title="この曲はまだ公開されていません"
                    icon={<IconAlertTriangle />}
                >
                    <Text>
                        先行情報などに基づき、仮の分析データを公開しています。似ている曲は不正確になっているのでご注意ください。
                    </Text>
                    <Text>また、公開後に本ページのリンクが変更される場合があります。</Text>
                </Alert>
            )}
            <Flex direction={{ base: "column", md: "row" }} gap="md">
                <div style={{ width: "100%", maxWidth: "480px" }}>
                    <div
                        style={{
                            width: "100%",
                            aspectRatio: "16/9",
                        }}
                    >
                        <Suspense>
                            <ReactPlayer
                                src={`https://www.youtube.com/watch?v=${song.id}&cc_load_policy=0`}
                                width="100%"
                                height="100%"
                                controls
                                fallback={
                                    <div style={{ width: "100%", aspectRatio: "16/9" }}>
                                        Loading...
                                    </div>
                                }
                            />
                        </Suspense>
                    </div>
                    <Flex m="md" gap="md" align="center" direction={{ base: "column", sm: "row" }}>
                        <NextAnchor href="/">ホームに戻る</NextAnchor>
                    </Flex>
                </div>
                <Paper p="md" radius="md" shadow="sm" withBorder style={{ flex: 1 }}>
                    <InfoTabs song={song} />
                </Paper>
            </Flex>

            <Flex mb="md" mt="xl" gap="xl" align="end">
                <Title order={2}>似ている曲</Title>
                {nearestSongs && (
                    <NextAnchor
                        href={`/songs/?params=${rison.encode_object({ limit: 50, nearest: { targetSongID: song.id } })}`}
                    >
                        高度な条件で探す
                    </NextAnchor>
                )}
            </Flex>

            {nearestSongs ? (
                <SongsCarousel songs={nearestSongs} />
            ) : (
                <Text>分析データが不足しているため、似ている曲を算出できません。</Text>
            )}

            <Title mb="md" mt="xl" order={2}>
                コメント
            </Title>
            <CommentSection songID={song.id} initialComments={comments} />
        </>
    );
}
