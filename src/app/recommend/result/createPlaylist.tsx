"use client";

import { confirmModal, fallbackNotifications } from "@/components/playlistHandler";
import WarningTip from "@/components/warningTip";
import { useUserRole } from "@/hooks/auth";
import { usePlaylistManager } from "@/hooks/playlist";
import { formatDate } from "@/lib/date";
import { Song, SongWithScore } from "@/lib/songs/types";
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRef } from "react";

export default function CreatePlaylistButton({
    songs,
    name,
}: {
    songs: (Song | SongWithScore)[];
    name: string;
}) {
    const userRole = useUserRole();

    const notificationID = useRef<string | null>(null);
    const { loadingPlaylist, validSongs, create } = usePlaylistManager(
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
            console.log(id);
        },
        (result) => {
            if (notificationID.current) fallbackNotifications(result, notificationID.current);
        }
    );

    const title = `${name} さんにおすすめの曲 - ${formatDate(Date.now() / 1000)}`;
    const description = `「MIMIさん全曲紹介」のおすすめ曲診断で、好みに合いそうな曲をピックアップしました！`;

    return (
        <WarningTip warning={userRole === "guest" ? "ログインすると利用できます" : null}>
            <Button
                fullWidth
                color="red"
                variant="light"
                loading={loadingPlaylist}
                disabled={userRole === "guest"}
                onClick={() => create(title, description)}
                mb="md"
            >
                診断結果から再生リストを作成（パターン1）
            </Button>
        </WarningTip>
    );
}
