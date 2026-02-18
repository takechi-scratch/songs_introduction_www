import MyAppShell from "@/components/appshell";
import { Title, Text, Alert } from "@mantine/core";
import { IconZoomExclamation } from "@tabler/icons-react";
import { Suspense } from "react";

import { PageProps } from "@/lib/utils";

import rison from "rison";
import { SongSearchParams } from "@/lib/search/search";
import { advancedSearchForSongs } from "@/lib/songs/api";
import Actions from "./actions";
import SearchBar from "./search";
import { redirect } from "next/navigation";
import { Metadata } from "next";

const title = "曲一覧 | MIMIさん全曲紹介";
const description = "MIMIさんの曲を全曲紹介。気になるあの曲も検索できます。";
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
        card: "summary_large_image",
        title: title,
        description: description,
        images: [imageUrl],
    },
    robots: { index: false },
};

async function MainPage(props: PageProps) {
    const searchParams = await props.searchParams;
    let songSearchParams: SongSearchParams = {};

    if (typeof searchParams.q === "string") {
        songSearchParams.q = searchParams.q;
    }

    if (typeof searchParams.params === "string") {
        try {
            // paramsが指定されている場合、先に読み込んだqは破棄する
            songSearchParams = rison.decode_object(searchParams.params);
            // console.log("Decoded search params from URL:", songSearchParams);
        } catch (e) {
            console.warn("Failed to decode search params from URL. Error:", e);
        }
    }

    let autoRedirect = false;
    if (typeof searchParams.autoRedirect === "string" && searchParams.autoRedirect === "1") {
        autoRedirect = true;
    }

    let songs;
    try {
        songs = await advancedSearchForSongs(songSearchParams);
    } catch (e) {
        return (
            <Alert icon={<IconZoomExclamation />} title="読み込みエラー" color="red" m="md">
                {e instanceof Error ? e.message : "不明なエラーが発生しました"}
            </Alert>
        );
    }

    if (autoRedirect && songs.length === 1) {
        const song = songs[0];
        redirect(`/songs/${song.id}`);
    }

    return (
        <>
            {songs !== null && <Actions songs={songs} songSearchParams={songSearchParams} />}
            {/* <Drawer
                opened={opened}
                onClose={close}
                title="Authentication"
                trapFocus={false}
                withOverlay={false}
            >
                Drawer content
            </Drawer>

            <Button variant="default" onClick={open}>
                Open Drawer
            </Button> */}
        </>
    );
}

export default async function Page(props: PageProps) {
    return (
        <MyAppShell>
            <Title order={2} mb="md">
                曲一覧
            </Title>
            <Suspense fallback={<Text>検索条件を読み込み中...</Text>}>
                <SearchBar />
            </Suspense>
            <Suspense fallback={<Text>曲の情報を読み込み中...</Text>}>
                <MainPage {...props} />
            </Suspense>
        </MyAppShell>
    );
}
