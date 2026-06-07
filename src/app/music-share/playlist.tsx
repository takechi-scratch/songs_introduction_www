"use client";

import MyAppShell from "@/components/appshell/myAppshell";
import MantineMarkdown from "@/components/markdown";
import { formatDateTime, formatTime } from "@/lib/date";
import { Song } from "@/lib/songs/types";
import {
    alpha,
    Anchor,
    Box,
    Button,
    Card,
    Divider,
    Table,
    TableTbody,
    TableTd,
    TableTh,
    TableThead,
    TableTr,
    Text,
    Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import YouTube, { type YouTubeEvent, type YouTubePlayer } from "react-youtube";
// import Chat from "./chat";
import { createScheduleInSpecialEvent, SharingSchedule } from "./scheduling";

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

    useEffect(() => {
        const interval = setInterval(() => {
            if (schedule.endDate < Math.floor(Date.now() / 1000)) {
                setSongIndex(-1);
                reRender();
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    function adjustAndPlay(auto: boolean = false) {
        const player = playerRef.current;
        const now = Math.floor(Date.now() / 1000);
        if (!player) return;
        for (let i = 0; i < songs.length; i++) {
            const song = songs[i];
            if (song.startDate < now && now < (songs[i + 1]?.startDate || Infinity)) {
                if (
                    auto &&
                    player.getPlaylistIndex() === i &&
                    Math.abs(now - song.startDate - player.getCurrentTime()) < 10
                )
                    break;

                if (player.getPlaylistIndex() !== i) {
                    player.playVideoAt(i);
                    setTimeout(() => {
                        player.seekTo(now - song.startDate, true);
                    }, 200);
                } else {
                    player.seekTo(now - song.startDate, true);
                }
                break;
            }
        }
    }

    function onReady(event: YouTubeEvent) {
        playerRef.current = event.target;
        event.target.cuePlaylist({
            playlist: songs.map((s) => s.id),
        });
    }

    function onStateChange(event: YouTubeEvent) {
        const player = playerRef.current;
        if (!player) return;
        const idx = player.getPlaylistIndex?.();
        if (typeof idx === "number") setSongIndex(idx);
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
        );
    }

    return (
        <>
            <YouTube
                videoId={songs[0].id}
                opts={{
                    width: "640",
                    height: "360",
                    playerVars: {
                        autoplay: 1,
                        // controls: 0,
                        disablekb: 1,
                    },
                }}
                onReady={onReady}
                onPlay={() => adjustAndPlay(true)}
                onStateChange={onStateChange}
            />
            <Button mt="md" onClick={() => adjustAndPlay(false)}>
                再生位置を合わせる
            </Button>
        </>
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

    const schedule = createScheduleInSpecialEvent(allSongs);
    const songs = schedule.songs;

    return (
        <MyAppShell>
            <Title order={2} mb="md">
                {schedule.title}
            </Title>
            <Player
                schedule={schedule}
                songIndex={songIndex}
                setSongIndex={setSongIndex}
                key={String(k)}
                reRender={reRender}
            />
            {/* <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <Chat />
            </SimpleGrid> */}
            <Divider mt="xl" mb="lg" />
            <MantineMarkdown text={schedule.description} />
            <Title order={2} mt="md" mb="md">
                曲一覧
            </Title>
            <Table mb="md">
                <TableThead>
                    <TableTr>
                        <TableTh>時刻</TableTh>
                        <TableTh>動画ID</TableTh>
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
                            <TableTd>{s.id}</TableTd>
                            <TableTd>{s.title}</TableTd>
                        </TableTr>
                    ))}
                </TableTbody>
            </Table>
            <Anchor href="/" component={Link}>
                ホームに戻る
            </Anchor>
        </MyAppShell>
    );
}
