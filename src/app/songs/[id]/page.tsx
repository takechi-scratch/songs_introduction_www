"use client";

import MyAppShell from "@/components/appshell";
import { useSong } from "@/hooks/songs";
import { Song } from "@/lib/songs/types";
import { Anchor, Flex, Table, Text, Title } from "@mantine/core";
import Link from "next/link";
import { use } from "react";
import ReactPlayer from "react-player";
import { Tabs } from "@mantine/core";
import { formatDate } from "@/lib/date";

export default function SongPage({ params }: { params: { id: string } }) {
    const resolvedParams: Song = use(params);
    const id = resolvedParams.id;
    const { song, loading, error } = useSong(id);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    if (!song) return <div>Song not found</div>;

    return (
        <MyAppShell>
            <Title mb="lg">曲ID: {song.id}</Title>
            <Flex direction="row" gap="md" style={{ height: 400 }}>
                <ReactPlayer
                    src={`https://www.youtube.com/watch?v=${song.id}`}
                    width={480}
                    height={270}
                    controls
                />

                <Tabs defaultValue="basicInfo" style={{ flex: 1 }}>
                    <Tabs.List mb="md">
                        <Tabs.Tab value="basicInfo">概要</Tabs.Tab>
                        <Tabs.Tab value="analysis">分析情報</Tabs.Tab>
                        <Tabs.Tab value="others">その他</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="basicInfo">
                        <Table variant="vertical" layout="fixed" withTableBorder>
                            <Table.Tbody>
                                <Table.Tr>
                                    <Table.Th w={160}>タイトル</Table.Th>
                                    <Table.Td>{song.title}</Table.Td>
                                </Table.Tr>

                                <Table.Tr>
                                    <Table.Th>公開時刻</Table.Th>
                                    <Table.Td>{formatDate(song.publishedTimestamp)}</Table.Td>
                                </Table.Tr>

                                <Table.Tr>
                                    <Table.Th>公開形式</Table.Th>
                                    <Table.Td>
                                        {song.isPublishedInOriginalChannel
                                            ? "オリジナル曲"
                                            : "提供曲（他チャンネル）"}
                                    </Table.Td>
                                </Table.Tr>

                                <Table.Tr>
                                    <Table.Th>秒数</Table.Th>
                                    <Table.Td>{song.durationSeconds}</Table.Td>
                                </Table.Tr>

                                <Table.Tr>
                                    <Table.Th>ボーカル</Table.Th>
                                    <Table.Td>{song.vocal || "-"}</Table.Td>
                                </Table.Tr>

                                <Table.Tr>
                                    <Table.Th>イラスト等</Table.Th>
                                    <Table.Td>{song.illustrations || "-"}</Table.Td>
                                </Table.Tr>

                                <Table.Tr>
                                    <Table.Th>動画</Table.Th>
                                    <Table.Td>{song.movie || "-"}</Table.Td>
                                </Table.Tr>
                            </Table.Tbody>
                        </Table>
                    </Tabs.Panel>

                    <Tabs.Panel value="analysis">分析情報 tab content</Tabs.Panel>

                    <Tabs.Panel value="others">その他 tab content</Tabs.Panel>
                </Tabs>
            </Flex>

            <Anchor href="/" component={Link}>
                ホームに戻る
            </Anchor>
        </MyAppShell>
    );
}
