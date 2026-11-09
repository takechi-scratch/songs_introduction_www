"use client";

import SongCard from "@/components/songCards/card";
import { hasScore, Song, SongWithScore } from "@/lib/songs/types";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import { Text } from "@mantine/core";

export default function SongsCarousel({
    songs,
    displayNotice = true,
    displayScore = null,
    size = "normal",
    forceFullSize = false,
}: {
    songs: (Song | SongWithScore | null)[];
    displayNotice?: boolean;
    displayScore?: boolean | null;
    size?: "normal" | "small";
    forceFullSize?: boolean;
}) {
    if (displayScore === null) {
        displayScore = songs.every((song) => song && hasScore(song) && song.score !== null);
    }

    let slideSize;
    if (size === "normal") {
        slideSize = { base: "100%", sm: "33.33%", lg: "20%" };
    } else {
        slideSize = { base: "100%", sm: "50%", lg: "33.33%" };
    }

    return (
        <>
            <Carousel
                height="100%"
                slideSize={slideSize}
                slideGap={{ base: 0, sm: "md" }}
                emblaOptions={{ align: "start", skipSnaps: true }}
            >
                {songs.map((song, index) => (
                    <Carousel.Slide key={song ? song.id : `placeholder-${index}`} mb="md">
                        <SongCard
                            song={song}
                            displayScore={displayScore}
                            forceFullSize={forceFullSize}
                        />
                    </Carousel.Slide>
                ))}
            </Carousel>
            {displayNotice && displayScore && (
                <Text size="sm" opacity={0.6} mt="sm" mb="md">
                    ※表示されている「類似度」は、独自の分析データを用いて算出したものです。YouTubeでの人気度や評価を反映したものではありません。
                </Text>
            )}
        </>
    );
}
