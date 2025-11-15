import { Song, SongWithScore } from "./songs/types";
import { getCurrentUser, getCurrentUserRole, getCurrentUserToken } from "./auth/firebase";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function createPlaylist(
    songs: (Song | SongWithScore | string)[],
    playlistTitle: string,
    playlistDescription: string
) {
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
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: {
            playlistId: string;
            playlistUrl: string;
        } = await response.json();
        return result;
    } catch (error) {
        console.error(`Failed to create playlist:`, error);
        throw error;
    }
}
