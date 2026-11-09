"use client";

import { NextAnchor } from "@/components/nextLink";
import CardsList from "@/components/songCards/cardsList";
import { Song } from "@/lib/songs/types";
import { shuffleArray } from "@/lib/utils";
import {
    Button,
    Flex,
    List,
    ListItem,
    Popover,
    PopoverDropdown,
    PopoverTarget,
    Text,
} from "@mantine/core";
import { useState } from "react";
import rison from "rison";
import { Collection } from "../collections";

export default function CollectedSongsSection({
    initialsongs,
    collectionTitle,
    collectionSearchParams,
    numberOfSearchResults,
}: {
    initialsongs: Song[];
    collectionTitle: string;
    collectionSearchParams: Collection["searchParams"];
    numberOfSearchResults: number[];
}) {
    const [songs, setSongs] = useState(initialsongs);

    return (
        <>
            <CardsList songs={songs} />
            <Flex
                direction={{ base: "column", sm: "row" }}
                justify="center"
                m="md"
                gap={{ base: "sm", sm: "lg" }}
            >
                <Button
                    fullWidth
                    variant="light"
                    onClick={() =>
                        setSongs((prevSongs) => {
                            shuffleArray(prevSongs);
                            return [...prevSongs];
                        })
                    }
                >
                    ランダムに並べ替え
                </Button>
                {collectionSearchParams && (
                    <>
                        {collectionSearchParams.length === 1 && (
                            <Button
                                fullWidth
                                color="orange"
                                variant="light"
                                component={NextAnchor}
                                href={`/songs/?params=${rison.encode_object(collectionSearchParams[0])}`}
                            >
                                詳しい条件で検索する
                            </Button>
                        )}
                        {collectionSearchParams.length > 1 && (
                            <Popover shadow="md" width={300}>
                                <PopoverTarget>
                                    <Button fullWidth color="orange" variant="light">
                                        詳しい条件で検索する
                                    </Button>
                                </PopoverTarget>

                                <PopoverDropdown>
                                    <Text size="sm" color="dimmed" mb="xs">
                                        このコレクションは、複数の検索条件を組み合わせています。
                                    </Text>
                                    <List>
                                        {collectionSearchParams.map((searchParam, index) => (
                                            <ListItem key={index}>
                                                <NextAnchor
                                                    href={`/songs/?params=${rison.encode_object(searchParam)}`}
                                                    size="sm"
                                                >
                                                    条件{index + 1}（{numberOfSearchResults[index]}
                                                    件）
                                                </NextAnchor>
                                            </ListItem>
                                        ))}
                                    </List>
                                </PopoverDropdown>
                            </Popover>
                        )}
                    </>
                )}
                <Button
                    fullWidth
                    color="red"
                    variant="light"
                    component="a"
                    href={`https://www.youtube.com/watch_videos?title=${collectionTitle}&video_ids=${songs.map((song) => song.id).join(",")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    YouTubeの再生リストで再生
                </Button>
            </Flex>
        </>
    );
}
