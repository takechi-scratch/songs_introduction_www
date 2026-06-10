"use client";

import MyAppShell from "@/components/appshell/myAppshell";
import MantineMarkdown from "@/components/markdown";
import { formatDateTime, formatTime } from "@/lib/date";
import { Song } from "@/lib/songs/types";
import {
    Accordion,
    alpha,
    Anchor,
    Box,
    Button,
    Card,
    Divider,
    Group,
    Image,
    List,
    ScrollArea,
    SimpleGrid,
    Table,
    TableTbody,
    TableTd,
    TableTh,
    TableThead,
    TableTr,
    Text,
    Title,
} from "@mantine/core";
import { useDisclosure, useInterval } from "@mantine/hooks";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import YouTube, { type YouTubeEvent, type YouTubePlayer } from "react-youtube";
import Chat from "./chat";
import { createDailySchedule, pastEvents, SharingSchedule } from "./scheduling";

const MAX_QUEUEING_SONGS = 150;

function Player({
    schedule,
    songIndex,
    setSongIndex,
    reRender,
}: {
    schedule: SharingSchedule;
    songIndex: number;
    setSongIndex: (index: number) => void;
    reRender: () => void;
}) {
    const songs = schedule.songs;
    const playerRef = useRef<YouTubePlayer | null>(null);
    // console.log(schedule);
    const [startIndex, setStartIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (schedule.endDate < Math.floor(Date.now() / 1000)) {
                setSongIndex(-1);
                reRender();
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const [remainingTimeToStart, setRemainingTimeToStart] = useState(0);
    useInterval(
        () => {
            setRemainingTimeToStart((prev) =>
                Math.max(0, schedule.startDate - Math.floor(Date.now() / 1000))
            );
        },
        1000,
        { autoInvoke: true }
    );

    function cueNextSongs(startIndex: number) {
        const player = playerRef.current;
        if (!player) return;
        setStartIndex(startIndex);
        player.cuePlaylist({
            playlist: songs.map((s) => s.id).slice(startIndex, startIndex + MAX_QUEUEING_SONGS),
        });
        player.playVideo();
    }

    function findCurrentSongIndex(): number {
        const now = Math.floor(Date.now() / 1000);

        for (let i = 0; i < songs.length; i++) {
            const song = songs[i];
            if (song.startDate < now && now < (songs[i + 1]?.startDate || Infinity)) {
                return i;
            }
        }

        return -1;
    }

    function getPlaylistIndex() {
        const player = playerRef.current;
        if (!player) return 0;
        return player.getPlaylistIndex() + startIndex;
    }

    function adjustAndPlay(auto: boolean = false) {
        const player = playerRef.current;
        const now = Math.floor(Date.now() / 1000);
        if (!player) return;

        const i = findCurrentSongIndex();
        const song = songs[i];
        if (
            auto &&
            getPlaylistIndex() === i &&
            Math.abs(now - song.startDate - player.getCurrentTime()) < 10
        )
            return;

        if (!auto && i != startIndex) {
            cueNextSongs(i);
        }

        if (getPlaylistIndex() !== i) {
            player.playVideoAt(i - startIndex);
        }
        setTimeout(() => {
            player.seekTo(now - song.startDate, true);
        }, 200);
        return;
    }

    function onReady(event: YouTubeEvent) {
        playerRef.current = event.target;
        cueNextSongs(findCurrentSongIndex());
    }

    function onStateChange(event: YouTubeEvent) {
        const player = playerRef.current;
        if (!player) return;
        const idx = getPlaylistIndex();
        if (typeof idx === "number") setSongIndex(idx);
        if (event.data === 0) {
            console.log("playlist index:", player.getPlaylistIndex());
            if (player.getPlaylistIndex() === -1) {
                adjustAndPlay(false);
            }
        }
    }

    if (Date.now() / 1000 < schedule.startDate) {
        return (
            <Box>
                <Card
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    bg={alpha("var(--mantine-color-blue-3)", 0.4)}
                    withBorder
                >
                    {remainingTimeToStart < 86400 && (
                        <Text size="xl" fw={700} ta="center">
                            {Math.floor(remainingTimeToStart / 3600)
                                .toFixed(0)
                                .padStart(2, "0")}
                            :
                            {Math.floor((remainingTimeToStart % 3600) / 60)
                                .toString()
                                .padStart(2, "0")}
                            :{(remainingTimeToStart % 60).toString().padStart(2, "0")}
                        </Text>
                    )}
                    <Text size="lg" ta="center" mb="md" onClick={reRender}>
                        イベントはまだ開始されていません。
                    </Text>
                    <Text ta="center">開始日時: {formatDateTime(schedule.startDate)}</Text>
                </Card>
                <Button color="gray" mt="md" onClick={reRender}>
                    再読み込み
                </Button>
            </Box>
        );
    }

    if (Date.now() / 1000 > schedule.endDate) {
        return (
            <Box>
                <Card
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    bg={alpha("var(--mantine-color-blue-3)", 0.4)}
                >
                    <Text size="lg" ta="center" mb="md">
                        イベントは終了しました。
                    </Text>
                    <Text ta="center">終了日時: {formatDateTime(schedule.endDate)}</Text>
                </Card>
                <Group mt="md">
                    <Text size="sm">感想をぜひ「#MIMIさん全曲紹介」でシェアしてね！</Text>
                    <Button
                        component="a"
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`\n#MIMIさん全曲紹介`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="gray"
                        mr="md"
                    >
                        <Image
                            src={"/assets/x-logo-white.png"}
                            alt="Twitterロゴ"
                            width={16}
                            height={16}
                            mr={6}
                        />
                        シェア
                    </Button>
                </Group>
            </Box>
        );
    }

    return (
        <Box>
            <div style={{ width: "100%", maxWidth: "640px", aspectRatio: "16/9" }}>
                <YouTube
                    videoId={songs[0].id}
                    opts={{
                        width: "100%",
                        height: "100%",
                        playerVars: {
                            autoplay: 1,
                            // controls: 0,
                            disablekb: 1,
                        },
                    }}
                    onReady={onReady}
                    onPlay={() => adjustAndPlay(true)}
                    onStateChange={onStateChange}
                    style={{ width: "100%", height: "100%" }}
                />
            </div>
            <Button
                mt="md"
                color="teal"
                component="a"
                href={songs[songIndex] ? `/songs/${songs[songIndex].id}` : undefined}
                target="_blank"
                rel="noopener noreferrer"
            >
                似ている曲・コメント
            </Button>
            <Button
                mt="md"
                ml="md"
                color="blue"
                variant="outline"
                onClick={() => adjustAndPlay(false)}
            >
                再生位置を合わせる
            </Button>
            <Group mt="md">
                <Text size="sm">感想をぜひ「#MIMIさん全曲紹介」でシェアしてね！</Text>
                <Button
                    component="a"
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`\n#MIMIさん全曲紹介`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="gray"
                    mr="md"
                >
                    <Image
                        src={"/assets/x-logo-white.png"}
                        alt="Twitterロゴ"
                        width={16}
                        height={16}
                        mr={6}
                    />
                    シェア
                </Button>
            </Group>
        </Box>
    );
}

export default function Page({ allSongs }: { allSongs: Song[] }) {
    const [songIndex, setSongIndex] = useState(-1);
    const [k, { toggle: reRender }] = useDisclosure(false);

    useEffect(() => {
        if (schedule.startDate < Math.floor(Date.now() / 1000)) return;
        const timeout = setTimeout(
            reRender,
            (schedule.startDate - Math.floor(Date.now() / 1000)) * 1000
        );
        return () => clearTimeout(timeout);
    }, []);

    const schedule = createDailySchedule(allSongs);
    const songs = schedule.songs;

    return (
        <MyAppShell>
            <Title order={1} mb="md">
                {schedule.title}
            </Title>
            {schedule.chatEnabled ? (
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <Player
                        schedule={schedule}
                        songIndex={songIndex}
                        setSongIndex={setSongIndex}
                        key={String(k)}
                        reRender={reRender}
                    />
                    <Chat />
                </SimpleGrid>
            ) : (
                <Player
                    schedule={schedule}
                    songIndex={songIndex}
                    setSongIndex={setSongIndex}
                    key={String(k)}
                    reRender={reRender}
                />
            )}
            <Divider mt="xl" mb="lg" />
            <MantineMarkdown text={schedule.description} />
            <Title order={2} mt="md" mb="md">
                曲一覧
            </Title>
            <ScrollArea h={500} type="always" mb="lg">
                <Table mb="md">
                    <TableThead>
                        <TableTr>
                            <TableTh>時刻</TableTh>
                            <TableTh>タイトル</TableTh>
                        </TableTr>
                    </TableThead>
                    <TableTbody>
                        {songs.map((s, index) => (
                            <TableTr
                                key={index}
                                style={{ fontWeight: index === songIndex ? "bold" : "normal" }}
                            >
                                <TableTd>{formatTime(s.startDate)}</TableTd>
                                <TableTd>{s.title}</TableTd>
                            </TableTr>
                        ))}
                    </TableTbody>
                </Table>
            </ScrollArea>
            <Divider my="lg" />
            <Title order={2} mb="md">
                お知らせ
            </Title>
            <List mb="md" withPadding>
                <List.Item>
                    途中参加・途中退出OKです！お好きなタイミングでご参加ください。
                </List.Item>
                <List.Item>
                    再生時間は自動で調整されます。時間がずれている場合は、「再生位置を合わせる」ボタンを押してください。
                </List.Item>
                <List.Item mb="md">
                    YouTubeの仕様上、数時間連続で再生するとリストが止まる場合があります。「再生位置を合わせる」ボタンを押すと、続きが再生されます。
                </List.Item>
                {schedule.chatEnabled && (
                    <>
                        <List.Item>
                            チャットでは、曲の感想・MIMIさんについての雑談など、自由に書き込んでください！
                        </List.Item>
                        <List.Item>
                            ただし、他の参加者が不快になるような内容や、個人情報、営業勧誘を送信することはお控えください。チャットを心地よい場所にするために、ご協力をお願いいたします。
                        </List.Item>
                    </>
                )}
            </List>
            <Title order={2} mb="md">
                過去のイベント
            </Title>
            <Accordion variant="separated" defaultValue="2024-06-01" radius="md" mb="md">
                {pastEvents.map((event) => (
                    <Accordion.Item value={event.title} key={event.title}>
                        <Accordion.Control>{event.title}</Accordion.Control>
                        <Accordion.Panel>
                            <Text size="sm" c="gray" mb="md">
                                日時: {formatDateTime(event.startDate)} -{" "}
                                {formatDateTime(event.endDate)}
                            </Text>
                            <MantineMarkdown text={event.description} />
                        </Accordion.Panel>
                    </Accordion.Item>
                ))}
            </Accordion>
            <Anchor href="/" component={Link}>
                ホームに戻る
            </Anchor>
        </MyAppShell>
    );
}
