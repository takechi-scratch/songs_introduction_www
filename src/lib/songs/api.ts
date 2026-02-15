import { getCurrentUserRole, getCurrentUserToken } from "@/lib/auth/firebase";
import { SearchQuery } from "../search/filter";
import { CustomParams } from "../search/nearest";
import { shuffleArray } from "../utils";
import { Song, SongWithScore, UpsertLyricsVec, UpsertSong } from "./types";
import { refreshHomePage, refreshSongPage } from "./refresh";

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

    let isRandom = false;
    if (FilteredQuery.order === "random") {
        isRandom = true;
        delete FilteredQuery.order;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/search/filter/?` +
                new URLSearchParams(FilteredQuery as Record<string, string>),
            { next: { revalidate: 3600 } }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: Song[] = await response.json();

        if (isRandom) {
            shuffleArray(result);
        }

        return result;
    } catch (error) {
        console.error("Failed to fetch songs:", error);
        throw error;
    }
}

export async function fetchSongById(id: string): Promise<Song> {
    try {
        const url = `${API_BASE_URL}/songs/${id}/`;
        console.log("[fetchSongById] Requesting:", url);
        console.log("[fetchSongById] API_BASE_URL:", API_BASE_URL);

        const response = await fetch(url, {
            next: { revalidate: 3600 },
        });

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
            `${API_BASE_URL}/search/nearest/?target_song_id=${id}&limit=${limit}`,
            { next: { revalidate: 3600 } }
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

export async function fetchNearestSongsAdvanced(params: CustomParams): Promise<SongWithScore[]> {
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
            next: { revalidate: 3600 },
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
        refreshSongPage(result.id);
        refreshHomePage();
        return result;
    } catch (error) {
        console.error(`Failed to fetch song ${data.id}:`, error);
        throw error;
    }
}

export async function upsertLyricsVector(data: UpsertLyricsVec[]): Promise<void> {
    if ((await getCurrentUserRole()) !== "admin") {
        throw new Error("Unauthorized");
    }

    try {
        const response = await fetch(`${API_BASE_URL}/lyrics-vector/`, {
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

        // 並列でrevalidationを実行
        await Promise.all([...data.map((item) => refreshSongPage(item.id)), refreshHomePage()]);
    } catch (error) {
        console.error(`Failed to upsert lyrics vectors:`, error);
        throw error;
    }
}
