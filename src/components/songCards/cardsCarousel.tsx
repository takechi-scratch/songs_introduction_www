"use client";

import SongCard from "@/components/songCards/card";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import { Song, SongWithScore } from "@/lib/songs/types";

export default function SongsCarousel({ songs }: { songs: (Song | SongWithScore | null)[] }) {
    return (
        <Carousel
            withIndicators
            height={400}
            slideSize={{ base: "100%", sm: "33.33%", lg: "20%" }}
            slideGap={{ base: 0, sm: "md" }}
            emblaOptions={{ align: "start" }}
        >
            {songs.map((song) => (
                <Carousel.Slide key={song ? song.id : Math.random()}>
                    <SongCard song={song} />
                </Carousel.Slide>
            ))}
        </Carousel>
    );
}
