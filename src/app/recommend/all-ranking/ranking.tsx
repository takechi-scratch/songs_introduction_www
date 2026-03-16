"use client";

import MyAppShell from "@/components/appshell/myAppshell";
import { Button, Center, Flex, Paper, Text, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SongPreferenceQuestion from "@/components/songPreferenceQuestion";
import { Song } from "@/lib/songs/types";
import SongsCarousel from "@/components/songCards/cardsCarousel";

type status = "start" | "choice" | "result";

function Start({ startCallback }: { startCallback?: () => void }) {
    return (
        <Flex direction="column" gap="lg" align="center">
            <Text>2択の質問に基づいた、全曲ランキングを作成します。</Text>
            <Text>※質問数が非常に多いのでご注意ください！</Text>
            <Button size="lg" radius="md" onClick={startCallback}>
                はじめる
            </Button>
        </Flex>
    );
}

function Choice({
    songs,
    setSortedSongs,
    nextCallback,
}: {
    songs: Song[];
    setSortedSongs: (songs: Song[]) => void;
    nextCallback: () => void;
}) {
    return (
        <SongPreferenceQuestion
            songs={songs}
            completedCallback={(sortedSongs) => {
                setSortedSongs(sortedSongs);
                nextCallback();
            }}
        />
    );
}

function Result({ songs }: { songs: Song[] }) {
    function downloadTitles(songs: Song[]) {
        const textContent = songs
            .map((song, index) => `${index + 1},${song.id},${song.title}`)
            .join("\n");
        const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "song_ranking.txt";
        a.click();

        URL.revokeObjectURL(url);
    }

    return (
        <>
            <Title order={2} mb="md">
                作成結果
            </Title>
            <SongsCarousel songs={songs} />
            <Button mt="lg" onClick={() => downloadTitles(songs)}>
                ランキングをテキストでダウンロード
            </Button>
        </>
    );
}

export default function AllRankingPage({ songs }: { songs: Song[] }) {
    const [status, setStatus] = useState<status>("start");
    const [sortedSongs, setSortedSongs] = useState<Song[] | null>(null);

    return (
        <MyAppShell>
            <Title mb="xl">あなたの全曲ランキング</Title>
            <Paper shadow="md" radius="md" p="lg">
                {status === "start" && <Start startCallback={() => setStatus("choice")} />}
                {status === "choice" && (
                    <Choice
                        songs={songs}
                        setSortedSongs={setSortedSongs}
                        nextCallback={() => setStatus("result")}
                    />
                )}
                {status === "result" && <Result songs={sortedSongs || songs} />}
            </Paper>
        </MyAppShell>
    );
}
