import MyAppShell from "@/components/appshell/myAppshell";
import MantineMarkdown from "@/components/markdown/mantineMarkdown";
import { NextAnchor } from "@/components/nextLink";
import CardsList from "@/components/songCards/cardsList";
import { advancedSearchForSongsAndCache, fetchAllSongsAndCache } from "@/lib/songs/cachedapi";
import { Song } from "@/lib/songs/types";
import {
    Alert,
    Button,
    Flex,
    List,
    ListItem,
    Popover,
    PopoverDropdown,
    PopoverTarget,
    Text,
    Title,
} from "@mantine/core";
import { IconMessageChatbot } from "@tabler/icons-react";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import rison from "rison";
import { CollectionsData } from "../collections";

export async function generateMetadata(
    {
        params,
    }: {
        params: Promise<{ slug: string }>;
    },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const collection = CollectionsData.find((collection) => collection.slug === slug);

    if (!collection) {
        notFound();
    }

    const parentMetadata = await parent;

    return {
        title: collection.title,
        description: collection.description,
        openGraph: {
            ...parentMetadata.openGraph,
            title: collection.title,
            description: collection.description,
        },
        twitter: {
            ...parentMetadata.twitter,
            title: collection.title,
            description: collection.description,
        },
    };
}

async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const collection = CollectionsData.find((collection) => collection.slug === slug);

    if (
        !collection ||
        (!collection.songs && !collection.searchParams && !collection.searchFunction)
    ) {
        notFound();
    }

    let songs: Song[] = [];
    const numberOfSearchResults: number[] = [];
    if (collection.songs) {
        const allSongs = await fetchAllSongsAndCache();
        for (const songId of collection.songs) {
            const song = allSongs.find((s) => s.id === songId);
            if (song) {
                songs.push(song);
            } else {
                notFound();
            }
        }
    } else if (collection.searchFunction) {
        const allSongs = await fetchAllSongsAndCache();
        songs = allSongs.filter(collection.searchFunction);
    } else if (collection.searchParams) {
        for (const searchParam of collection.searchParams) {
            const searchResults = await advancedSearchForSongsAndCache(searchParam);
            numberOfSearchResults.push(searchResults.length);
            songs.push(...searchResults.map((result) => result.song));
        }
        songs = [...new Set(songs)];
        songs.sort((a, b) => b.publishedTimestamp - a.publishedTimestamp);
    }

    return (
        <>
            <Title order={1} size="h2" mb="md">
                {collection.title}
            </Title>
            <MantineMarkdown text={collection.description} />
            <Text size="sm" ta="right" m="md">
                総曲数: {songs.length}曲
            </Text>
            <CardsList songs={songs} />
            <Flex
                direction={{ base: "column", sm: "row" }}
                justify="center"
                m="md"
                gap={{ base: "sm", sm: "lg" }}
            >
                {collection.searchParams && (
                    <>
                        {collection.searchParams.length === 1 && (
                            <Button
                                fullWidth
                                color="orange"
                                variant="light"
                                component={NextAnchor}
                                href={`/songs/?params=${rison.encode_object(collection.searchParams[0])}`}
                            >
                                詳しい条件で検索する
                            </Button>
                        )}
                        {collection.searchParams.length > 1 && (
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
                                        {collection.searchParams.map((searchParam, index) => (
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
                    href={`https://www.youtube.com/watch_videos?title=${collection.title}&video_ids=${songs.map((song) => song.id).join(",")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    YouTubeの再生リストで再生
                </Button>
            </Flex>
            {collection.askForSuggestion && (
                <Alert m="md" color="green" icon={<IconMessageChatbot />}>
                    <Text size="sm">
                        よりよいコレクションの案を募集中！追加してほしい曲があったら、
                        <NextAnchor href="/contact" size="sm">
                            お問い合わせ
                        </NextAnchor>
                        から教えてください！
                    </Text>
                </Alert>
            )}
            <NextAnchor href="/collections">コレクション一覧に戻る</NextAnchor>
        </>
    );
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
    return (
        <MyAppShell>
            <Suspense fallback={<Text>読み込み中...</Text>}>
                <CollectionPage params={params} />
            </Suspense>
        </MyAppShell>
    );
}

export async function generateStaticParams() {
    return CollectionsData.map((collection) => ({ slug: collection.slug }));
}
