"use client";

import {
    Alert,
    Badge,
    Blockquote,
    Box,
    Button,
    Collapse,
    Flex,
    Grid,
    HoverCard,
    Rating,
    Table,
    Tabs,
    Text,
    Title,
} from "@mantine/core";
import { formatDateTime, formatDuration } from "@/lib/date";
import { formatOriginalKey, hasLyrics } from "@/lib/musicValues";
import {
    IconCopyright,
    IconHelpHexagon,
    IconInfoCircle,
    IconRosetteDiscountCheckFilled,
    ReactNode,
} from "@tabler/icons-react";
import { Song } from "@/lib/songs/types";
import { DonutChart } from "@mantine/charts";
import Image from "next/image";
import { useUserRole } from "@/hooks/auth";
import Link from "next/link";
import CreatorBadges from "@/components/creatorBadges";
import MantineMarkdown from "@/components/markdown";
import { useDisclosure } from "@mantine/hooks";

function valueFormatter(value: number) {
    return `${(value * 100).toFixed(0)}%`;
}

function Comment({ text, author, icon }: { text: string; author: string; icon: ReactNode }) {
    return (
        <Blockquote color="blue" m="md" icon={icon} style={{ maxWidth: 500 }}>
            <MantineMarkdown text={text} />
            <Text size="sm" c="gray.8" mt="sm">
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

    let chordData = null;
    if (song.chordRate6451 !== null && song.chordRate4561 !== null) {
        chordData = [
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
    }

    let mainChordColor = "gray";
    if (song.mainChord?.startsWith("6")) {
        mainChordColor = "blue";
    } else if (song.mainChord?.startsWith("4")) {
        mainChordColor = "orange";
    }

    let displayedModulationTimes;
    if (song.modulationTimes === null) {
        displayedModulationTimes = "不明";
    } else if (song.modulationTimes === 0) {
        displayedModulationTimes = "なし";
    } else {
        displayedModulationTimes = `${song.modulationTimes}回`;
    }

    const takechiIcon = (
        <Image src="/assets/takechi.svg" alt="製作者takechiのアイコン" width={32} height={32} />
    );

    const userRole = useUserRole();

    let lyricsStatus: "あり" | "なし" | "不明";
    if (song.lyricsVector === null) {
        lyricsStatus = "不明";
    } else if (hasLyrics(song)) {
        lyricsStatus = "あり";
    } else {
        lyricsStatus = "なし";
    }

    const [openLyricsDetail, { toggle: toggleOpenLyricsDetail }] = useDisclosure(false);

    return (
        <Tabs defaultValue="basicInfo" style={{ flex: 1 }}>
            <Tabs.List mb="md">
                <Tabs.Tab value="basicInfo" color="red">
                    概要
                </Tabs.Tab>
                <Tabs.Tab value="analysis" color="blue">
                    分析情報
                </Tabs.Tab>
                <Tabs.Tab value="lyrics" color="cyan">
                    歌詞
                </Tabs.Tab>
                <Tabs.Tab value="others" color="teal">
                    その他
                </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="basicInfo">
                <Flex mb="sm" gap="sm" align="center">
                    <Title order={4}>動画データ</Title>
                    <Text size="sm" c="gray.8">
                        （YouTube Data APIより取得）
                    </Text>
                </Flex>
                <Table variant="vertical" layout="fixed" withTableBorder mb="md">
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Th w={140}>タイトル</Table.Th>
                            <Table.Td>{song.title}</Table.Td>
                        </Table.Tr>

                        <Table.Tr>
                            <Table.Th>公開時刻</Table.Th>
                            <Table.Td>{formatDateTime(song.publishedTimestamp)}</Table.Td>
                        </Table.Tr>

                        <Table.Tr>
                            <Table.Th>長さ</Table.Th>
                            <Table.Td>
                                {song.durationSeconds
                                    ? formatDuration(song.durationSeconds)
                                    : "不明"}
                            </Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
                <Title order={4} mb="sm">
                    曲に関するデータ
                </Title>
                <Table variant="vertical" layout="fixed" withTableBorder mb="md">
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Th w={140}>公開形式</Table.Th>
                            <Table.Td>{publishedType}</Table.Td>
                        </Table.Tr>

                        <Table.Tr>
                            <Table.Th>ボーカル</Table.Th>
                            <Table.Td>
                                {song.vocal !== null ? (
                                    <CreatorBadges
                                        color="orange"
                                        searchQueryName="vocal"
                                        creators={song.vocal}
                                    />
                                ) : (
                                    "不明"
                                )}
                            </Table.Td>
                        </Table.Tr>

                        <Table.Tr>
                            <Table.Th>イラスト等</Table.Th>
                            <Table.Td>
                                {song.illustrations !== null ? (
                                    <CreatorBadges
                                        color="blue"
                                        searchQueryName="illustrations"
                                        creators={song.illustrations}
                                    />
                                ) : (
                                    "不明"
                                )}
                            </Table.Td>
                        </Table.Tr>

                        <Table.Tr>
                            <Table.Th>動画</Table.Th>
                            <Table.Td>
                                {song.movie !== null ? (
                                    <CreatorBadges
                                        color="teal"
                                        searchQueryName="movie"
                                        creators={song.movie}
                                    />
                                ) : (
                                    "不明"
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
                            <Table.Th w={140}>BPM</Table.Th>
                            <Table.Td>{song.bpm !== null ? song.bpm : "不明"}</Table.Td>
                        </Table.Tr>

                        <Table.Tr>
                            <Table.Th>主なキー</Table.Th>
                            <Table.Td>
                                {song.mainKey !== null ? formatOriginalKey(song.mainKey) : "不明"}
                            </Table.Td>
                        </Table.Tr>

                        <Table.Tr>
                            <Table.Th>主なコード</Table.Th>
                            <Table.Td>
                                {song.mainChord ? (
                                    <Badge
                                        variant="light"
                                        color={mainChordColor}
                                        component={Link}
                                        href={`/songs/?params=filter:(mainChord:'${encodeURIComponent(song.mainChord)}')`}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {song.mainChord}
                                    </Badge>
                                ) : (
                                    "不明"
                                )}
                            </Table.Td>
                        </Table.Tr>

                        <Table.Tr>
                            <Table.Th>転調</Table.Th>
                            <Table.Td>{displayedModulationTimes}</Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>

                <Flex direction="row" gap="xl" style={{ alignItems: "flex-start" }} mb="md">
                    {/* Divで囲んだところは縦方向の並びになる */}
                    <div>
                        {chordData !== null ? (
                            <>
                                <Title order={4} mb="sm">
                                    コード進行
                                </Title>
                                <div style={{ height: 80 }}>
                                    <DonutChart
                                        data={chordData}
                                        startAngle={180}
                                        endAngle={0}
                                        valueFormatter={valueFormatter}
                                        tooltipProps={{
                                            allowEscapeViewBox: { x: true, y: true },
                                            wrapperStyle: { zIndex: 1000 },
                                        }}
                                    />
                                </div>
                            </>
                        ) : (
                            <Text>コード進行: 不明</Text>
                        )}
                    </div>
                    <div>
                        <Title order={4} mb="sm">
                            ピアノの使用度
                        </Title>
                        {song.pianoRate !== null ? (
                            <Rating value={song.pianoRate} size={30} mb="md" readOnly />
                        ) : (
                            <Text>不明</Text>
                        )}
                    </div>
                </Flex>
                <Alert variant="light" color="blue" radius="md" icon={<IconInfoCircle />}>
                    データは手動で作成しているため、間違いがあるかもしれません。修正・変更提案があれば、
                    <Link href="/contact">お問い合わせ</Link>ください。
                </Alert>
            </Tabs.Panel>

            <Tabs.Panel value="lyrics">
                <Flex mb="md" gap="sm" align="center">
                    <Title order={4}>{"歌詞"}</Title>
                    <Text>{lyricsStatus}</Text>
                    {lyricsStatus === "あり" &&
                        (song.lyricsOfficiallyReleased ? (
                            <HoverCard width={280} shadow="md">
                                <HoverCard.Target>
                                    <IconRosetteDiscountCheckFilled size={24} color="teal" />
                                </HoverCard.Target>
                                <HoverCard.Dropdown>
                                    <Text size="sm">
                                        公式（概要欄、MV内の歌詞の正確な文字起こしなど）のソースから収集した歌詞データを使用しています。
                                    </Text>
                                </HoverCard.Dropdown>
                            </HoverCard>
                        ) : (
                            <HoverCard width={280} shadow="md">
                                <HoverCard.Target>
                                    <IconHelpHexagon size={24} color="orange" />
                                </HoverCard.Target>
                                <HoverCard.Dropdown>
                                    <Text size="sm">
                                        非公式（コメントなど）のソースから収集した歌詞データを使用しています。
                                    </Text>
                                </HoverCard.Dropdown>
                            </HoverCard>
                        ))}
                </Flex>

                {lyricsStatus !== "なし" && (
                    <Button
                        component={Link}
                        href={`https://www.google.com/search?q=${encodeURIComponent(
                            `${song.title} 歌詞`
                        )}`}
                        target="_blank"
                        mb="md"
                    >
                        Googleで歌詞を検索
                    </Button>
                )}

                {lyricsStatus === "あり" && (
                    <Box maw="100%">
                        <Button
                            variant="outline"
                            color="gray"
                            onClick={toggleOpenLyricsDetail}
                            mb="md"
                        >
                            {openLyricsDetail ? "歌詞ベクトル情報を隠す" : "歌詞ベクトル情報を表示"}
                        </Button>

                        {openLyricsDetail && (
                            <Collapse in={openLyricsDetail} transitionDuration={1000}>
                                <Grid mb="md" gutter="md">
                                    {song.lyricsVector?.map((value, index) => (
                                        <Grid.Col key={index} span={{ base: 4, sm: 3, lg: 1.5 }}>
                                            <Box pt="sm" pb="sm" bg="gray.0">
                                                <Text size="sm" c="gray.7" ta="center">
                                                    {index}
                                                </Text>
                                                <Text size="md" fw="bold" ta="center">
                                                    {value.toFixed(5)}
                                                </Text>
                                            </Box>
                                        </Grid.Col>
                                    ))}
                                </Grid>
                            </Collapse>
                        )}
                    </Box>
                )}

                <Alert color="cyan" radius="md" icon={<IconCopyright />}>
                    著作権保護のため、歌詞本文は掲載していません。
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
