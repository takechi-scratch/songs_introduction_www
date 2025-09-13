"use client";

import { Song, SongWithScore } from "@/lib/songs/types";
import Card from "@/components/songCards/card";
import { Center, Pagination, SimpleGrid } from "@mantine/core";
import { useState } from "react";

export default function CardsList({ songs }: { songs: (Song | SongWithScore)[] }) {
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
                    .map((song) => (
                        <Card key={song.id} song={song} />
                    ))}
            </SimpleGrid>
            <Center m="lg">
                <Pagination total={pages} onChange={setPageIndex} />
            </Center>
        </>
    );
}
