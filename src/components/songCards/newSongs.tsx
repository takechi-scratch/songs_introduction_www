"use client";

import SongCards from "@/components/songCards/card";
import { useSongs } from "@/hooks/songs";
import { Carousel } from "@mantine/carousel";

import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";

export default function NewSongsCarousel() {
    const { songs, loading, error } = useSongs();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Carousel
            withIndicators
            height={500}
            slideSize={{ base: "100%", sm: "33.33%", lg: "20%" }}
            slideGap={{ base: 0, sm: "md" }}
            emblaOptions={{ align: "start" }}
        >
            {songs.map((song) => (
                <Carousel.Slide key={song.id}>
                    <SongCards {...song} />
                </Carousel.Slide>
            ))}
        </Carousel>
    );
}
