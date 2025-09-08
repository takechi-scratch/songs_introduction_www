"use client";

import SongCards from "@/components/songCards/card";
import { useSongs } from "@/hooks/useSongs";
import { Carousel } from "@mantine/carousel";

export default function NewSongsCarousel() {
    const { songs, loading, error } = useSongs();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Carousel
            withIndicators
            height={200}
            slideSize={{ base: "100%", sm: "50%", md: "33.333333%" }}
            slideGap={{ base: 0, sm: "md" }}
            emblaOptions={{ loop: true, align: "start" }}
        >
            {songs.map((song) => (
                <Carousel.Slide key={song.id}>
                    <SongCards {...song} />
                </Carousel.Slide>
            ))}
        </Carousel>
    );
}
