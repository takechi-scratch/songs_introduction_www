"use client";

import { hasScore, Song, SongWithScore } from "@/lib/songs/types";
import Card from "@/components/songCards/card";
import { Center, Pagination, SimpleGrid, Text } from "@mantine/core";
import { useState } from "react";

export default function CardsList({ songs }: { songs: (Song | SongWithScore | null)[] }) {
    const [pageIndex, setPageIndex] = useState<number>(1);
    const songsPerPage = 10;
    const pages = Math.ceil(songs.length / songsPerPage);

    return (
        <>
            <SimpleGrid
                cols={{ base: 1, sm: 3, lg: 5 }}
                spacing={{ base: 10, sm: "xl" }}
                verticalSpacing={{ base: "md", sm: "xl" }}
                m="md"
            >
                {songs
                    .slice((pageIndex - 1) * songsPerPage, pageIndex * songsPerPage)
                    .map((song) => {
                        return <Card key={song ? song.id : Math.random()} song={song} />;
                    })}
            </SimpleGrid>
            <Center m="lg">
                <Pagination total={pages} onChange={setPageIndex} />
            </Center>
            {songs.every((song) => song && hasScore(song) && song.score !== null) && (
                <Text size="sm" c="gray.8" mb="md">
                    ※表示されている「類似度」は、独自の分析データを用いて算出したものです。YouTubeでの人気度や評価を反映したものではありません。
                </Text>
            )}
        </>
    );
}
