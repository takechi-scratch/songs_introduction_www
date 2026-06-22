import MyAppShell from "@/components/appshell/myAppshell";
import { fetchAllSongsAndCache } from "@/lib/songs/cachedapi";
import { Text } from "@mantine/core";
import { Metadata } from "next";
import { Suspense } from "react";
import Playlist from "./playlist";

const title = "音楽シェア | MIMIさん全曲紹介";
const description = "MIMIさんの曲をリアルタイムで一緒に聴こう！";
const imageUrl = "https://mimi.takechi.f5.si/assets/card.png";

export const metadata: Metadata = {
    title: title,
    description: description,
    openGraph: {
        title: title,
        description: description,
        url: imageUrl,
        siteName: title,
        images: [
            {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: title,
            },
        ],
        locale: "ja_JP",
        type: "website",
    },
    twitter: {
        card: "summary",
        title: title,
        description: description,
        images: [imageUrl],
    },
};

export default async function Page() {
    const songs = await fetchAllSongsAndCache();

    return (
        <MyAppShell>
            <Suspense fallback={<Text>再生リストを読み込んでいます...</Text>}>
                <Playlist allSongs={songs} />
            </Suspense>
        </MyAppShell>
    );
}
