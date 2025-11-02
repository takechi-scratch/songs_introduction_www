"use client";

import {
    Alert,
    Badge,
    Blockquote,
    Button,
    Flex,
    Rating,
    Table,
    Tabs,
    Text,
    Title,
    Tooltip,
} from "@mantine/core";
import { formatDate, formatDuration } from "@/lib/date";
import { formatOriginalKey } from "@/lib/musicValues";
import { IconInfoCircle, ReactNode } from "@tabler/icons-react";
import { Song } from "@/lib/songs/types";
import { DonutChart } from "@mantine/charts";
import Image from "next/image";
import { useUserRole } from "@/hooks/auth";
import Link from "next/link";
import CreatorBadges from "@/components/creatorBadges";

function ContentName({ name, isFromYoutube }: { name: string; isFromYoutube: boolean }) {
    return (
        <Flex align="center">
            <Text size="sm" style={{ width: 100 }}>
                {name}
            </Text>
            {isFromYoutube && (
                <Tooltip label="YouTube Data APIを用いて取得">
                    <Badge color="red" size="sm">
                        Y
                    </Badge>
                </Tooltip>
            )}
        </Flex>
    );
}

function valueFormatter(value: number) {
    return `${(value * 100).toFixed(0)}%`;
}

function Comment({ text, author, icon }: { text: string; author: string; icon: ReactNode }) {
    return (
        <Blockquote color="blue" m="md" icon={icon} style={{ maxWidth: 500 }}>
            <Text mb="sm">{text}</Text>
            <Text size="sm" c="gray.8">
                — {author}
            </Text>
        </Blockquote>
    );
}

export default function InfoTabs({ song }: { song: Song }) {
    let publishedType = "";
    if (song.publishedType === 1) {
        publishedType = "オリジナル曲";
    } else if (song.publishedType === 0) {
        publishedType = "提供曲（他チャンネル）";
    } else if (song.publishedType === -1) {
        publishedType = "仮掲載（先行公開・予想など）";
    } else {
        publishedType = "不明";
    }

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

    const takechiIcon = (
        <Image src="/assets/takechi.svg" alt="製作者takechiのアイコン" width={32} height={32} />
    );

    const userRole = useUserRole();

    return (
        <Tabs defaultValue="basicInfo" style={{ flex: 1 }}>
            <Tabs.List mb="md">
                <Tabs.Tab value="basicInfo" color="red">
                    概要
                </Tabs.Tab>
                <Tabs.Tab value="analysis" color="blue">
                    分析情報
                </Tabs.Tab>
                <Tabs.Tab value="others" color="teal">
                    その他
                </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="basicInfo">
                <Title order={4} mb="sm">
                    一覧
                </Title>
                <Table variant="vertical" layout="fixed" withTableBorder>
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Th w={160}>
                                <ContentName name="タイトル" isFromYoutube={true} />
                            </Table.Th>
                            <Table.Td>{song.title}</Table.Td>
                        </Table.Tr>

                        <Table.Tr>
                            <Table.Th>
                                <ContentName name="公開時刻" isFromYoutube={true} />
                            </Table.Th>
                            <Table.Td>{formatDate(song.publishedTimestamp)}</Table.Td>
                        </Table.Tr>

                        <Table.Tr>
                            <Table.Th>
                                <ContentName name="長さ" isFromYoutube={true} />
                            </Table.Th>
                            <Table.Td>{formatDuration(song.durationSeconds)}</Table.Td>
                        </Table.Tr>

                        <Table.Tr>
                            <Table.Th>公開形式</Table.Th>
                            <Table.Td>{publishedType}</Table.Td>
                        </Table.Tr>

                        <Table.Tr>
                            <Table.Th>ボーカル</Table.Th>
                            <Table.Td>
                                {song.vocal ? (
                                    <CreatorBadges
                                        color="orange"
                                        searchQueryName="vocal"
                                        creators={song.vocal
                                            .split("/")
                                            .map((creator) => creator.trim())}
                                    />
                                ) : (
                                    "-"
                                )}
                            </Table.Td>
                        </Table.Tr>

                        <Table.Tr>
                            <Table.Th>イラスト等</Table.Th>
                            <Table.Td>
                                {song.illustrations ? (
                                    <CreatorBadges
                                        color="blue"
                                        searchQueryName="illustrations"
                                        creators={song.illustrations
                                            .split("/")
                                            .map((creator) => creator.trim())}
                                    />
                                ) : (
                                    "-"
                                )}
                            </Table.Td>
                        </Table.Tr>

                        <Table.Tr>
                            <Table.Th>動画</Table.Th>
                            <Table.Td>
                                {song.movie ? (
                                    <CreatorBadges
                                        color="teal"
                                        searchQueryName="movie"
                                        creators={song.movie
                                            .split("/")
                                            .map((creator) => creator.trim())}
                                    />
                                ) : (
                                    "-"
                                )}
                            </Table.Td>
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
                                {song.modulationTimes !== 0 ? `${song.modulationTimes}回` : "なし"}
                            </Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>

                <Flex direction="row" gap="lg" style={{ alignItems: "flex-start" }}>
                    <div>
                        <Title order={4} mb="sm">
                            コード進行
                        </Title>
                        <DonutChart
                            data={chordData}
                            startAngle={180}
                            endAngle={0}
                            valueFormatter={valueFormatter}
                            style={{ height: 80 }}
                        />
                        <Text>主なコード: {song.mainChord}</Text>
                    </div>
                    <div>
                        <Title order={4} mb="sm">
                            ピアノの使用度
                        </Title>
                        <Rating value={song.pianoRate} size={30} mb="md" readOnly />
                    </div>
                </Flex>
                <Alert variant="light" color="blue" radius="md" icon={<IconInfoCircle />}>
                    データは手動で作成しているため、間違いがあるかもしれません。修正・変更提案があれば、XのDMなどでお問い合わせください。
                </Alert>
            </Tabs.Panel>

            <Tabs.Panel value="others">
                <Title order={4} mb="xl">
                    コメント
                </Title>
                {song.comment ? (
                    <Comment text={song.comment} author="takechi" icon={takechiIcon} />
                ) : (
                    <Text m="sm">なし</Text>
                )}
                {userRole === "admin" && (
                    <Button component={Link} href={`/songs/edit?id=${song.id}`} color="blue">
                        データの編集
                    </Button>
                )}
            </Tabs.Panel>
        </Tabs>
    );
}
