import { Song, SongWithScore } from "./songs/types";
import { getCurrentUser, getCurrentUserToken } from "./auth/firebase";

import { google } from "googleapis";

export async function insertPlaylist(token: string, title: string, description: string) {
    const youtube = google.youtube({ version: "v3", auth: token });

    const response = await youtube.playlists.insert({
        part: ["snippet"],
        requestBody: {
            snippet: {
                title: title,
                description: description,
            },
        },
    });

    return response.data;
}

export async function insertPlaylistItem(
    token: string,
    playlistId: string,
    videoId: string,
    note?: string
) {
    const youtube = google.youtube({ version: "v3", auth: token });
    const response = await youtube.playlistItems.insert({
        part: ["snippet", "contentDetails"],
        requestBody: {
            snippet: {
                playlistId: playlistId,
                resourceId: {
                    kind: "youtube#video",
                    videoId: videoId,
                },
            },
            contentDetails: {
                note: note,
            },
        },
    });

    return response.data;
}

export async function createPlaylist(
    songs: (Song | SongWithScore | string)[],
    playlistTitle: string,
    playlistDescription: string
) {
    const user = getCurrentUser();
    if (!user || user.providerId !== "google.com") {
        throw new Error("User not authenticated");
    }

    const token = await getCurrentUserToken();
    if (!token) {
        throw new Error("Failed to get user token");
    }

    const playlist = await insertPlaylist(token, playlistTitle, playlistDescription);

    if (!playlist.id) {
        throw new Error("Failed to create playlist");
    }

    for (const song of songs) {
        const videoId = typeof song === "string" ? song : song.id;
        await insertPlaylistItem(token, playlist.id, videoId);
    }

    return playlist;
}
