"use client";

import { confirmModal, fallbackNotifications } from "@/components/playlistHandler";
import CardsList from "@/components/songCards/cardsList";
import SongsSlot from "@/components/songCards/cardsSlot";
import WarningTip from "@/components/warningTip";
import { useUserRole } from "@/hooks/auth";
import { usePlaylistManager } from "@/hooks/playlist";
import { SongSearchParams } from "@/lib/search/search";
import { Song, SongWithScore } from "@/lib/songs/types";
import { Flex, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRef, useState } from "react";

function ActionButtons({
    songs,
    slotsActive,
    setSlotsActive,
    searchParams,
}: {
    songs: (Song | SongWithScore | null)[];
    slotsActive: boolean;
    setSlotsActive: React.Dispatch<React.SetStateAction<boolean>>;
    searchParams: SongSearchParams;
}) {
    const userRole = useUserRole();

    const notificationID = useRef<string | null>(null);
    const { loadingPlaylist, validSongs, createFromSearchParams } = usePlaylistManager(
        songs,
        async () => await confirmModal(validSongs.length > 30),
        () => {
            const id = notifications.show({
                loading: true,
                title: "再生リストを作成中...",
                message: "作成完了まで数秒～数十秒かかります。しばらくお待ちください。",
                autoClose: false,
                withCloseButton: false,
            });
            notificationID.current = id;
        },
        (result) => {
            if (notificationID.current) fallbackNotifications(result, notificationID.current);
        }
    );

    return (
        <Flex
            direction={{ base: "column", sm: "row" }}
            justify="center"
            m="md"
            gap={{ base: "sm", sm: "lg" }}
        >
            <Button
                fullWidth
                color="cyan"
                variant="light"
                onClick={() => {
                    setSlotsActive(() => !slotsActive);
                }}
            >
                {slotsActive ? "ルーレットを閉じる" : "検索結果でルーレットを回す"}
            </Button>
            <WarningTip warning={userRole === "guest" ? "ログインすると利用できます" : null}>
                <Button
                    fullWidth
                    color="red"
                    variant="light"
                    loading={loadingPlaylist}
                    disabled={userRole === "guest"}
                    onClick={() => createFromSearchParams(searchParams)}
                >
                    検索結果から再生リストを作成
                </Button>
            </WarningTip>
        </Flex>
    );
}

export default function Actions({
    songs,
    songSearchParams,
}: {
    songs: SongWithScore[];
    songSearchParams: SongSearchParams;
}) {
    const [slotsActive, setSlotsActive] = useState(false);

    return (
        <>
            <ActionButtons
                songs={songs}
                slotsActive={slotsActive}
                setSlotsActive={setSlotsActive}
                searchParams={songSearchParams}
            />
            {slotsActive ? <SongsSlot songs={songs} /> : <CardsList songs={songs} />}
        </>
    );
}
