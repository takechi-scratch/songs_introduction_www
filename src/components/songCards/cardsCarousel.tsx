"use client";

import SongCard from "@/components/songCards/card";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import { hasScore, Song, SongWithScore } from "@/lib/songs/types";
import { Text } from "@mantine/core";

export default function SongsCarousel({
    songs,
    displayNotice = true,
}: {
    songs: (Song | SongWithScore | null)[];
    displayNotice?: boolean;
}) {
    return (
        <>
            <Carousel
                height={380}
                slideSize={{ base: "100%", sm: "33.33%", lg: "20%" }}
                slideGap={{ base: 0, sm: "md" }}
                emblaOptions={{ align: "start", skipSnaps: true }}
            >
                {songs.map((song) => (
                    <Carousel.Slide key={song ? song.id : Math.random()}>
                        <SongCard song={song} />
                    </Carousel.Slide>
                ))}
            </Carousel>
            {songs.filter((song) => song && hasScore(song)).length > 0 && displayNotice && (
                <Text size="sm" c="gray.8" mb="md">
                    ※表示されている「類似度」は、独自の分析データを用いて算出したものです。YouTubeでの人気度や評価を反映したものではありません。
                </Text>
            )}
        </>
    );
}
