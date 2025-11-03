import { getCurrentUserRole, getCurrentUserToken } from "../auth";
import { SearchQuery } from "../search/filter";
import { customParams } from "../search/nearest";
import { Song, SongWithScore, UpsertSong } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export function scoreCanBeCalculated(song: Song) {
    return (
        song.vocal !== null &&
        song.illustrations !== null &&
        song.movie !== null &&
        song.bpm !== null &&
        song.mainKey !== null &&
        song.chordRate6451 !== null &&
        song.chordRate4561 !== null &&
        song.mainChord !== null &&
        song.pianoRate !== null &&
        song.modulationTimes !== null
    );
}

export async function fetchSongs(query: SearchQuery): Promise<Song[]> {
    const FilteredQuery = Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(query).filter(([_, value]) => value !== "")
    );

    try {
        const response = await fetch(
            `${API_BASE_URL}/search/filter/?` +
                new URLSearchParams(FilteredQuery as Record<string, string>)
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: Song[] = await response.json();
        return result;
    } catch (error) {
        console.error("Failed to fetch songs:", error);
        throw error;
    }
}

export async function fetchSongById(id: string): Promise<Song> {
    try {
        const response = await fetch(`${API_BASE_URL}/songs/${id}/`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: Song = await response.json();
        return result;
    } catch (error) {
        console.error(`Failed to fetch song ${id}:`, error);
        throw error;
    }
}

export async function fetchNearestSongs(id: string, limit: number = 10): Promise<SongWithScore[]> {
    try {
        const response = await fetch(
            `${API_BASE_URL}/search/nearest/?target_song_id=${id}&limit=${limit}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: SongWithScore[] = await response.json();
        return result;
    } catch (error) {
        console.error(`Failed to fetch nearest songs for ${id}:`, error);
        throw error;
    }
}

export async function fetchNearestSongsAdvanced(params: customParams): Promise<SongWithScore[]> {
    try {
        if (!params.target_song_id) {
            throw new Error("target_song_id is required");
        }

        const response = await fetch(`${API_BASE_URL}/search/nearest_advanced/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: SongWithScore[] = await response.json();
        return result;
    } catch (error) {
        console.error(`Failed to fetch nearest songs for ${params.target_song_id}:`, error);
        throw error;
    }
}

export async function upsertSong(songID: string | null, data: UpsertSong): Promise<Song> {
    if ((await getCurrentUserRole()) === "user") {
        throw new Error("Unauthorized");
    }

    try {
        const response = await fetch(`${API_BASE_URL}/songs/${songID ?? data.id}/`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${await getCurrentUserToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: Song = await response.json();
        return result;
    } catch (error) {
        console.error(`Failed to fetch song ${data.id}:`, error);
        throw error;
    }
}
