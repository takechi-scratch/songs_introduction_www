"use client";

import SongCards from "@/components/songCards/card";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import { Song, SongWithScore } from "@/lib/songs/types";
import { Text } from "@mantine/core";

export default function NewSongsCarousel({
    songs,
    loading,
    error,
}: {
    songs: (Song | SongWithScore | null)[];
    loading: boolean;
    error: string | null;
}) {
    if (!loading && error) return <Text>Error: {error}</Text>;

    return (
        <Carousel
            withIndicators
            height={500}
            slideSize={{ base: "100%", sm: "33.33%", lg: "20%" }}
            slideGap={{ base: 0, sm: "md" }}
            emblaOptions={{ align: "start" }}
        >
            {songs.map((song) => (
                <Carousel.Slide key={song ? song.id : Math.random()}>
                    <SongCards song={song} />
                </Carousel.Slide>
            ))}
        </Carousel>
    );
}
