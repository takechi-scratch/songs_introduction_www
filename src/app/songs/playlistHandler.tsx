import { formatDate } from "@/lib/date";
import { SearchQuery, FilterableContents } from "@/lib/search/filter";
import { CustomParams } from "@/lib/search/nearest";
import { fetchSongById } from "@/lib/songs/api";
import { Song, SongWithScore, hasScore } from "@/lib/songs/types";
import { createPlaylist, CreatePlaylistResult } from "@/lib/youtube";
import { List, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconPlaylistX, IconCheck } from "@tabler/icons-react";

export function confirmModal(playlistHandler: () => void, isMany: boolean = false) {
    modals.openConfirmModal({
        title: "確認",
        children: (
            <List size="sm" spacing="xs">
                {isMany && (
                    <List.Item>曲数が多いため、操作に時間がかかる場合があります。</List.Item>
                )}
                <List.Item>
                    作成した再生リストは、「MIMIさん全曲紹介」のチャンネルで公開されます。
                </List.Item>
            </List>
        ),
        labels: { confirm: "作成", cancel: "キャンセル" },
        onConfirm: playlistHandler,
    });
}

export function playlistHandler(
    songs: (Song | SongWithScore | null)[],
    searchType: "filter" | "nearest",
    searchQuery: SearchQuery,
    customParams: CustomParams,
    setLoadingPlaylist: (loading: boolean) => void
) {
    setLoadingPlaylist(true);
    const id = notifications.show({
        loading: true,
        title: "再生リストを作成中...",
        message: "作成完了まで数秒～数十秒かかります。しばらくお待ちください。",
        autoClose: false,
        withCloseButton: false,
    });

    const validSongs = songs
        .filter((song) => song !== null)
        .filter((song) => {
            if (hasScore(song)) return song.song.publishedType !== -1;
            return song.publishedType !== -1;
        });
    createPlaylistMetaData(validSongs.length, searchType, searchQuery, customParams).then(
        (metadata) => {
            createPlaylist(validSongs, metadata.title, metadata.description).then((result) => {
                setLoadingPlaylist(false);
                createPlaylistFallback(result, id);
            });
        }
    );
}

async function createPlaylistMetaData(
    songCount: number,
    searchType: "filter" | "nearest",
    searchQuery: SearchQuery,
    customParams: CustomParams
): Promise<{ title: string; description: string }> {
    let title = "";
    let description = "";

    if (searchType === "filter") {
        title = `MIMIさん曲まとめ - ${formatDate(Date.now() / 1000)}`;

        description += `「MIMIさん全曲紹介」の検索結果（全${songCount}曲）から自動で作成しました。\n\n`;
        description += "【絞り込み条件】\n";
        Object.entries(searchQuery).forEach(([key, value]) => {
            if (key === "order" || key === "asc") return;

            if (value) {
                description += `- ${
                    FilterableContents.find((content) => content.key === key)?.displayName || key
                }: ${value}\n`;
            }
        });
    } else if (searchType === "nearest") {
        const targetSong = await fetchSongById(customParams.target_song_id || "");

        title = `「${targetSong?.title}」が好きな人におすすめの曲 - ${formatDate(
            Date.now() / 1000
        )}`;
        description += `「MIMIさん全曲紹介」で、「${targetSong?.title}」に似ている曲を${songCount}曲集めました。\n※似ている曲の選出にはカスタムパラメータが使用されています。`;
    }

    return { title, description };
}

function createPlaylistFallback(result: CreatePlaylistResult, notificationID: string) {
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
