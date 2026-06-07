"use client";

import MyAppShell from "@/components/appshell";
import { Song } from "@/lib/songs/types";
import { Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Title } from "@mantine/core";
import { useRef, useState } from "react";
import YouTube, { type YouTubeEvent, type YouTubePlayer } from "react-youtube";

export default function Playlist({ rawSongs }: { rawSongs: Song[] }) {
    const [songIndex, setSongIndex] = useState(0);
    const playerRef = useRef<YouTubePlayer | null>(null);

    const songs = rawSongs.filter((s) => s.publishedTimestamp < 1770714000).slice(0, 10);
    console.log(songs.map((s) => s.durationSeconds || 0).reduce((a, b) => a + b, 0));
    const song = songs[songIndex];

    const onReady = (event: YouTubeEvent) => {
        playerRef.current = event.target;
        event.target.cuePlaylist({
            playlist: songs.map((s) => s.id),
            index: 0,
            startSeconds: 120,
        });
    };

    const onStateChange = (event: YouTubeEvent) => {
        const player = playerRef.current;
        if (!player) return;
        const idx = (player as any).getPlaylistIndex?.();
        if (typeof idx === "number") setSongIndex(idx);
    };

    return (
        <MyAppShell>
            <Title order={2}>再生リストのテスト</Title>
            <YouTube
                videoId={songs[0].id}
                opts={{
                    width: "640",
                    height: "360",
                    playerVars: {
                        autoplay: 1,
                        controls: 0,
                        disablekb: 1,
                    },
                }}
                onReady={onReady}
                onError={(e) => {
                    console.log(e);
                }}
                onStateChange={onStateChange}
            />
            <Table>
                <TableThead>
                    <TableTr>
                        <TableTh>タイトル</TableTh>
                        <TableTh>動画ID</TableTh>
                        {/* <TableTh>開始時間</TableTh>
                        <TableTh>終了時間</TableTh> */}
                    </TableTr>
                </TableThead>
                <TableTbody>
                    {songs.map((s, index) => (
                        <TableTr
                            key={index}
                            style={{ fontWeight: index === songIndex ? "bold" : "normal" }}
                        >
                            <TableTd>{s.title}</TableTd>
                            <TableTd>{s.id}</TableTd>
                            {/* <TableTd>{s.start}</TableTd>
                            <TableTd>{s.end}</TableTd> */}
                        </TableTr>
                    ))}
                </TableTbody>
            </Table>
        </MyAppShell>
    );
}
