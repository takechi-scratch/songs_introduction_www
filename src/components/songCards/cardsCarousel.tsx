"use client";

import SongCards from "@/components/songCards/card";
import { Carousel } from "@mantine/carousel";

import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import { Skeleton } from "@mantine/core";
import { Song, SongWithScore } from "@/lib/songs/types";

function NewSongCards({
    songs,
    loading,
    error,
}: {
    songs: (Song | SongWithScore)[];
    loading: boolean;
    error: string | null;
}) {
    if (loading) {
        return [...Array(5)].map((_, index) => (
            <Carousel.Slide key={index}>
                <Skeleton height={300} />
            </Carousel.Slide>
        ));
    }
    if (error) return <div>Error: {error}</div>;

    return songs.map((song) => (
        <Carousel.Slide key={song.id}>
            <SongCards song={song} />
        </Carousel.Slide>
    ));
}

export default function NewSongsCarousel({
    songs,
    loading,
    error,
}: {
    songs: (Song | SongWithScore)[];
    loading: boolean;
    error: string | null;
}) {
    return (
        <Carousel
            withIndicators
            height={500}
            slideSize={{ base: "100%", sm: "33.33%", lg: "20%" }}
            slideGap={{ base: 0, sm: "md" }}
            emblaOptions={{ align: "start" }}
        >
            <NewSongCards songs={songs} loading={loading} error={error} />
        </Carousel>
    );
}
