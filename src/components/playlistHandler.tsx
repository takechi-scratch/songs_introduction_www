"use client";

import { hasScore, Song, SongWithScore } from "@/lib/songs/types";
import { CreatePlaylistResult } from "@/lib/youtube";
import { List, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconPlaylistX, IconCheck } from "@tabler/icons-react";
import Link from "next/link";

export function confirmModal(isMany: boolean = false, inValidSongs: (Song | SongWithScore)[] = []) {
    return new Promise<boolean>((resolve) => {
        modals.openConfirmModal({
            title: "確認",
            children: (
                <List size="sm" spacing="xs">
                    {isMany && (
                        <List.Item>曲数が多いため、操作に時間がかかる場合があります。</List.Item>
                    )}
                    {inValidSongs.length > 0 && (
                        <List.Item>
                            以下の曲は仮掲載のため、再生リストには含まれません。
                            <List size="sm">
                                {inValidSongs.map((song) => (
                                    <List.Item key={song.id}>
                                        <Link
                                            href={`/songs/${song.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {hasScore(song) ? song.song.title : song.title}
                                        </Link>
                                    </List.Item>
                                ))}
                            </List>
                        </List.Item>
                    )}
                    <List.Item>
                        作成した再生リストは、
                        <Link href="https://www.youtube.com/@songs-introduction">
                            「MIMIさん全曲紹介」のチャンネル
                        </Link>
                        で公開されます。
                    </List.Item>
                </List>
            ),
            labels: { confirm: "作成", cancel: "キャンセル" },
            onConfirm: () => resolve(true),
            onCancel: () => resolve(false),
        });
    });
}

export function fallbackNotifications(result: CreatePlaylistResult, notificationID: string) {
    if (result.status !== 200) {
        notifications.update({
            id: notificationID,
            color: "red",
            title: "再生リストの作成に失敗しました",
            message: result.message,
            icon: <IconPlaylistX size={18} />,
            loading: false,
            withCloseButton: true,
            autoClose: 5000,
        });
    } else {
        const isCached =
            result.playlist && Date.now() - new Date(result.playlist.createdAt).getTime() > 1000;
        if (isCached) {
            console.log("Using cached playlist data.");
        }

        notifications.update({
            id: notificationID,
            color: "teal",
            title: "再生リストが作成されました！",
            message: (
                <>
                    <Text size="sm">
                        リンクは
                        <a
                            href={`https://www.youtube.com/playlist?list=${result.playlist?.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            こちら
                        </a>
                        。
                    </Text>
                    {isCached && process.env.NEXT_PUBLIC_IS_DEVELOPMENT === "true" && (
                        <Text size="xs" c="gray">
                            キャッシュされた結果を表示しています。
                        </Text>
                    )}
                </>
            ),
            icon: <IconCheck size={18} />,
            loading: false,
            withCloseButton: true,
        });
    }
}

// TODO: Notificationsも組み込んだplaylist作成用のボタンをここに置いておくのはありかも？
