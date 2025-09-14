"use client";

import MyAppShell from "@/components/appshell";
import { useNearestSongs, useSong } from "@/hooks/songs";
import { Anchor, Blockquote, Flex, Rating, Table, Text, Title } from "@mantine/core";
import Link from "next/link";
import { use } from "react";
import ReactPlayer from "react-player";
import { Tabs } from "@mantine/core";
import { DonutChart } from "@mantine/charts";
import { formatDate, formatDuration } from "@/lib/date";
import { formatOriginalKey } from "@/lib/musicValues";
import NearestSongsCarousel from "@/components/songCards/cardsCarousel";

import "@mantine/charts/styles.css";

export default function SongPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const { song, loading, error } = useSong(id);
    const nearestSongs = useNearestSongs(id);

    if (loading) return <MyAppShell>Loading...</MyAppShell>;
    if (error) return <MyAppShell>Error: {error}</MyAppShell>;

    if (!song) return <MyAppShell>曲が見つかりません</MyAppShell>;

    const chordData = [
        { name: "6451進行", value: song.chordRate6451, color: "#96c3ffff" },
        { name: "4561進行", value: song.chordRate4561, color: "#fcab7fff" },
    ];

    if (chordData[0].value + chordData[1].value < 1) {
        chordData.push({
            name: "その他",
            value: 1 - (song.chordRate4561 + song.chordRate6451),
            color: "gray.6",
        });
    }

    return (
        <MyAppShell>
            <Title mb="lg">曲ID: {song.id}</Title>
            <Flex direction="row" gap="md" style={{ height: 300 }}>
                <ReactPlayer
                    src={`https://www.youtube.com/watch?v=${song.id}`}
                    width={480}
                    height={270}
                    controls
                    fallback={<div style={{ width: 480, height: 270 }}>Loading...</div>}
                />

                <Tabs defaultValue="basicInfo" style={{ flex: 1 }}>
                    <Tabs.List mb="md">
                        <Tabs.Tab value="basicInfo">概要</Tabs.Tab>
                        <Tabs.Tab value="analysis">分析情報</Tabs.Tab>
                        <Tabs.Tab value="others">その他</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="basicInfo">
                        <Title order={4} mb="sm">
                            一覧
                        </Title>
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
                                    <Table.Th>長さ</Table.Th>
                                    <Table.Td>{formatDuration(song.durationSeconds)}</Table.Td>
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

                    <Tabs.Panel value="analysis">
                        <Title order={4} mb="sm">
                            基本データ
                        </Title>
                        <Table variant="vertical" layout="fixed" withTableBorder mb="md">
                            <Table.Tbody>
                                <Table.Tr>
                                    <Table.Th w={160}>BPM</Table.Th>
                                    <Table.Td>{song.bpm}</Table.Td>
                                </Table.Tr>

                                <Table.Tr>
                                    <Table.Th>主なキー</Table.Th>
                                    <Table.Td>{formatOriginalKey(song.mainKey)}</Table.Td>
                                </Table.Tr>

                                <Table.Tr>
                                    <Table.Th>転調</Table.Th>
                                    <Table.Td>
                                        {song.modulationTimes !== 0
                                            ? `${song.modulationTimes}回`
                                            : "なし"}
                                    </Table.Td>
                                </Table.Tr>
                            </Table.Tbody>
                        </Table>

                        <Title order={4} mb="sm">
                            コード進行
                        </Title>
                        <Flex direction="row" gap="lg" h={120}>
                            <DonutChart
                                data={chordData}
                                startAngle={180}
                                endAngle={0}
                                valueFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                            />
                            <Text style={{ flex: 1 }}>主なコード: {song.mainChord}</Text>
                        </Flex>

                        <Title order={4} mb="sm">
                            ピアノの使用度
                        </Title>
                        <Rating value={song.pianoRate} size={30} readOnly />
                    </Tabs.Panel>

                    <Tabs.Panel value="others">
                        <Title order={4}>コメント</Title>
                        {song.comment ? (
                            <Blockquote color="blue" m="md" w={500}>
                                {song.comment}
                            </Blockquote>
                        ) : (
                            <Text m="sm">なし</Text>
                        )}
                    </Tabs.Panel>
                </Tabs>
            </Flex>

            <Anchor href="/" component={Link}>
                ホームに戻る
            </Anchor>

            <Title order={2} m="md" mt={120}>
                似ている曲
            </Title>

            <NearestSongsCarousel
                songs={nearestSongs.songs}
                loading={nearestSongs.loading}
                error={nearestSongs.error}
            />
        </MyAppShell>
    );
}
