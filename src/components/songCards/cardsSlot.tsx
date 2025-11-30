"use client";

import SongCard from "@/components/songCards/card";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import { hasScore, Song, SongWithScore } from "@/lib/songs/types";
import { Button, Switch, Text, useMatches } from "@mantine/core";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { EmblaCarouselType } from "embla-carousel";
import { shuffleArray } from "@/lib/utils";
import { useRouter } from "next/navigation";

type RollingStatus = "beforeRolling" | "stop" | "rolling" | "slowingDown";

function SlowDownSlot(
    embla: EmblaCarouselType,
    count: number,
    setRollingStatus: Dispatch<SetStateAction<RollingStatus>>
): NodeJS.Timeout | null {
    if (count <= 0) {
        setRollingStatus("stop");
        return null;
    }

    embla.scrollNext();
    return setTimeout(
        () => SlowDownSlot(embla, count - 1, setRollingStatus),
        Math.max(500 / count, 100)
    );
}

export default function SongsSlot({ songs }: { songs: (Song | SongWithScore | null)[] }) {
    const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);
    const [rollingStatus, setRollingStatus] = useState<RollingStatus>("beforeRolling");
    const [autoTransition, setAutoTransition] = useState<boolean>(true);

    const [selectedSongIndex, setSelectedSongIndex] = useState<number | null>(null);
    const [isHighlighted, setIsHighlighted] = useState(false);

    const selectedIndexOffset = useMatches({
        base: 0,
        sm: 1,
        lg: 2,
    });

    // useEffectを使わずにスッキリ書ける
    const songsInCarousel = useMemo(() => {
        const shuffledSongs = [...songs];
        shuffleArray(shuffledSongs);
        return shuffledSongs;
    }, [songs]);

    const router = useRouter();

    useEffect(() => {
        let timeoutId: NodeJS.Timeout | null;
        if (!embla) return;
        if (rollingStatus === "rolling") {
            timeoutId = setInterval(() => {
                embla.scrollNext();
            }, 100);
        } else if (rollingStatus === "slowingDown") {
            const count = Math.floor(Math.random() * 10 + 5);
            timeoutId = SlowDownSlot(embla, count, setRollingStatus);
        } else if (rollingStatus === "stop") {
            const selectedIndex =
                (embla.selectedScrollSnap() + selectedIndexOffset) % songsInCarousel.length;
            setSelectedSongIndex(selectedIndex);
            setIsHighlighted(true);

            timeoutId = setInterval(() => {
                setIsHighlighted((prev) => !prev);
            }, 500);

            setTimeout(() => {
                if (timeoutId) clearInterval(timeoutId);
                if (autoTransition) {
                    router.push(`/songs/${songsInCarousel[selectedIndex]?.id}/`);
                }

                setRollingStatus("beforeRolling");
                setIsHighlighted(false);
            }, 3000);
        }

        return () => {
            if (!timeoutId) return;
            clearTimeout(timeoutId);
        };
    }, [rollingStatus, embla, selectedIndexOffset, autoTransition, router, songsInCarousel]);

    return (
        <>
            <Carousel
                height={380}
                slideSize={{ base: "100%", sm: "33.33%", lg: "20%" }}
                slideGap={{ base: 0, sm: "md" }}
                emblaOptions={{ align: "start", loop: true }}
                getEmblaApi={setEmbla}
                withControls={false}
            >
                {songsInCarousel.map((song, index) => (
                    <Carousel.Slide key={song ? song.id : Math.random()}>
                        <SongCard
                            song={song}
                            isHighLighted={selectedSongIndex === index && isHighlighted}
                        />
                    </Carousel.Slide>
                ))}
            </Carousel>
            {rollingStatus === "beforeRolling" ? (
                <Button
                    onClick={() => {
                        if (!embla) return;
                        setRollingStatus("rolling");
                    }}
                    mb="md"
                    fullWidth
                    color="cyan"
                    variant="light"
                >
                    スタート
                </Button>
            ) : (
                <Button
                    onClick={() => {
                        if (embla) setRollingStatus("slowingDown");
                    }}
                    disabled={rollingStatus !== "rolling"}
                    mb="md"
                    fullWidth
                    color="orange"
                    variant="light"
                >
                    ストップ
                </Button>
            )}

            <Switch
                defaultChecked
                label="自動で当たった曲へ移動する"
                onChange={(event) => setAutoTransition(event.currentTarget.checked)}
            />

            {songs.filter((song) => song && hasScore(song)).length > 0 && (
                <Text size="sm" c="gray.8" mb="md">
                    ※表示されている「類似度」は、独自の分析データを用いて算出したものです。YouTubeでの人気度や評価を反映したものではありません。
                </Text>
            )}
        </>
    );
}
