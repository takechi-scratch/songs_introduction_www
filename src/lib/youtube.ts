import { Song, SongWithScore } from "./songs/types";
import { getCurrentUser, getCurrentUserRole, getCurrentUserToken } from "./auth/firebase";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

interface YoutubePlaylist {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    videoIDs: string[];
}

export interface CreatePlaylistResult {
    playlist?: YoutubePlaylist;
    status: number;
    message?: string;
}

export async function createPlaylist(
    songs: (Song | SongWithScore | string)[],
    playlistTitle: string,
    playlistDescription: string
): Promise<CreatePlaylistResult> {
    const user = getCurrentUser();
    if (!user || user.providerData[0]?.providerId !== "google.com") {
        throw new Error("User not authenticated");
    }

    if ((await getCurrentUserRole()) !== "admin") {
        throw new Error("Unauthorized");
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
            return { status: response.status, message: "サーバー側でエラーが発生しました。" };
        }

        const playlist: YoutubePlaylist = await response.json();
        return { playlist, status: 200 };
    } catch (error) {
        console.error(`Failed to create playlist:`, error);
        throw error;
    }
}
