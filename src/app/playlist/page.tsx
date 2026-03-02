"use client";

import MyAppShell from "@/components/appshell";
import { Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Title } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import YouTube, { type YouTubeEvent } from "react-youtube";

// const Songs = [
//     { title: "声の欠片", videoId: "8gcrKkXTx64", start: 52, end: 83 },
//     { title: "ハナタバ", videoId: "7xht3kQO_TM", start: 39, end: 56 },
//     { title: "トリックハート", videoId: "uoYegcqyfxE", start: 19, end: 46 },
// ];
const Songs = [
    { title: "声の欠片", videoId: "8gcrKkXTx64", start: 52, end: 57 },
    { title: "ハナタバ", videoId: "7xht3kQO_TM", start: 39, end: 44 },
    { title: "トリックハート", videoId: "uoYegcqyfxE", start: 19, end: 24 },
];

export default function Playlist() {
    const [songIndex, setSongIndex] = useState(0);
    const stopTimerId = useRef<ReturnType<typeof setInterval> | null>(null);

    const song = Songs[songIndex];

    const clearStopTimer = () => {
        if (stopTimerId.current) {
            clearInterval(stopTimerId.current);
            stopTimerId.current = null;
        }
    };

    useEffect(() => {
        return () => {
            clearStopTimer();
        };
    }, []);

    const onReady = (event: YouTubeEvent) => {
        clearStopTimer();
        void event.target.loadVideoById({
            videoId: song.videoId,
            startSeconds: song.start,
            endSeconds: song.end,
        });
    };

    const onStateChange = (event: YouTubeEvent<number>) => {
        if (event.data === YouTube.PlayerState.PLAYING) {
            clearStopTimer();
            stopTimerId.current = setInterval(() => {
                void Promise.resolve(event.target.getCurrentTime() as unknown).then((t) => {
                    const currentTime = typeof t === "number" ? t : Number(t);
                    if (Number.isFinite(currentTime) && currentTime >= song.end - 0.05) {
                        clearStopTimer();
                        void event.target.pauseVideo();
                        setSongIndex((prevIndex) => (prevIndex + 1) % Songs.length);
                        void event.target.playVideo();
                    }
                });
            }, 250);
            return;
        }

        if (event.data === YouTube.PlayerState.PAUSED || event.data === YouTube.PlayerState.ENDED) {
            clearStopTimer();
        }
    };

    return (
        <MyAppShell>
            <Title order={2}>再生リストのテスト</Title>
            <YouTube
                videoId={song.videoId}
                opts={{
                    width: "640",
                    height: "360",
                    playerVars: {
                        autoplay: 1,
                        start: song.start,
                        end: song.end,
                        controls: 0,
                    },
                }}
                onReady={onReady}
                onStateChange={onStateChange}
            />
            <Table>
                <TableThead>
                    <TableTr>
                        <TableTh>タイトル</TableTh>
                        <TableTh>動画ID</TableTh>
                        <TableTh>開始時間</TableTh>
                        <TableTh>終了時間</TableTh>
                    </TableTr>
                </TableThead>
                <TableTbody>
                    {Songs.map((s, index) => (
                        <TableTr
                            key={index}
                            style={{ fontWeight: index === songIndex ? "bold" : "normal" }}
                        >
                            <TableTd>{s.title}</TableTd>
                            <TableTd>{s.videoId}</TableTd>
                            <TableTd>{s.start}</TableTd>
                            <TableTd>{s.end}</TableTd>
                        </TableTr>
                    ))}
                </TableTbody>
            </Table>
        </MyAppShell>
    );
}
