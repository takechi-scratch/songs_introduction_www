import { Song, SongWithScore } from "./songs/types";
import { getCurrentUser, getCurrentUserToken } from "./auth/firebase";
import { formatDate } from "./date";
import { SearchQuery, FilterableContents } from "./search/filter";
import { fetchSongById } from "./songs/api";
import { CustomParams } from "./search/nearest";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

interface YouTubePlaylist {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    videoIDs: string[];
}

interface CreatePlaylistSuccess {
    playlist: YouTubePlaylist;
    status: 200;
}

interface CreatePlaylistFailure {
    status: 403 | 429 | 503 | 500;
    message: string;
}

export type CreatePlaylistResult = CreatePlaylistSuccess | CreatePlaylistFailure;

export async function createPlaylist(
    songs: (Song | SongWithScore | string)[],
    playlistTitle: string,
    playlistDescription: string
): Promise<CreatePlaylistResult> {
    const user = getCurrentUser();
    if (!user) {
        console.warn("User not authenticated");
        return { status: 403, message: "未ログインのため、再生リストを作成できません。" };
    }

    try {
        const response = await fetch(`${API_BASE_URL}/playlists/create/`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${await getCurrentUserToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                video_ids: songs.map((song) => (typeof song === "string" ? song : song.id)),
                title: playlistTitle,
                description: playlistDescription,
            }),
        });

        if (!response.ok) {
            if (response.status === 503) {
                return {
                    status: 503,
                    message:
                        "再生リストは現在作成できません。（APIの割り当てがなくなった可能性があります。）しばらくしてから再度お試しください。",
                };
            } else if (response.status === 429) {
                return {
                    status: 429,
                    message:
                        "再生リストの作成上限に到達しました。しばらくしてから再度お試しください。",
                };
            }
            console.error(`Failed to create playlist: ${response.status} ${response.statusText}`);
            return { status: 500, message: "サーバー側でエラーが発生しました。" };
        }

        const playlist: YouTubePlaylist = await response.json();
        return { playlist, status: 200 };
    } catch (error) {
        console.error(`Failed to create playlist:`, error);
        return { status: 500, message: "サーバー側でエラーが発生しました。" };
    }
}

export async function createMetaDataFromSearchQuery(
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
