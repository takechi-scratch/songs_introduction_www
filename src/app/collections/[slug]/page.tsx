import MyAppShell from "@/components/appshell/myAppshell";
import MantineMarkdown from "@/components/markdown/mantineMarkdown";
import { NextAnchor } from "@/components/nextLink";
import { advancedSearchForSongsAndCache, fetchAllSongsAndCache } from "@/lib/songs/cachedapi";
import { Song } from "@/lib/songs/types";
import { Alert, Text, Title } from "@mantine/core";
import { IconMessageChatbot } from "@tabler/icons-react";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CollectionsData } from "../collections";
import CollectedSongsSection from "./songs";

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

    let initialsongs: Song[] = [];
    const numberOfSearchResults: number[] = [];
    if (collection.songs) {
        const allSongs = await fetchAllSongsAndCache();
        for (const songId of collection.songs) {
            const song = allSongs.find((s) => s.id === songId);
            if (song) {
                initialsongs.push(song);
            } else {
                notFound();
            }
        }
    } else if (collection.searchFunction) {
        const allSongs = await fetchAllSongsAndCache();
        initialsongs = allSongs.filter(collection.searchFunction);
    } else if (collection.searchParams) {
        for (const searchParam of collection.searchParams) {
            const searchResults = await advancedSearchForSongsAndCache(searchParam);
            numberOfSearchResults.push(searchResults.length);
            initialsongs.push(...searchResults.map((result) => result.song));
        }
        initialsongs = [...new Set(initialsongs)];
        initialsongs.sort((a, b) => b.publishedTimestamp - a.publishedTimestamp);
    }

    return (
        <>
            <Title order={1} size="h2" mb="md">
                {collection.title}
            </Title>
            <MantineMarkdown text={collection.description} />
            <Text size="sm" ta="right" m="md">
                総曲数: {initialsongs.length}曲
            </Text>
            <CollectedSongsSection
                initialsongs={initialsongs}
                collectionTitle={collection.title}
                collectionSearchParams={collection.searchParams}
                numberOfSearchResults={numberOfSearchResults}
            />
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
