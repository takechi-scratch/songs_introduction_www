import { getCurrentUserRole, getCurrentUserToken } from "@/lib/auth/firebase";
import { Song, SongWithScore, UpsertLyricsVec, UpsertSong } from "./types";
import { refreshHomePage, refreshSongPage } from "./refresh";
import { SongSearchParams } from "../search/search";

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

// TODO: キャッシュ戦略の見直し
export async function fetchAllSongs(): Promise<Song[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/songs-all/`, {
            cache: "force-cache",
            next: { tags: ["songs-all"] },
        });

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

export async function fetchSongById(
    id: string,
    cache: "force-cache" | "no-cache" = "force-cache"
): Promise<Song> {
    try {
        const url = `${API_BASE_URL}/songs/${id}/`;

        const response = await fetch(url, { cache, next: { tags: [`song-${id}`] } }); // デフォルトでもキャッシュを強制

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
            `${API_BASE_URL}/nearest-search/?target_song_id=${id}&limit=${limit}`,
            { next: { tags: ["songs-all"] } }
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

export async function searchSongs(q: string): Promise<Song[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/search/?q=${encodeURIComponent(q)}`, {
            next: { tags: ["songs-all"] },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: Song[] = await response.json();
        return result;
    } catch (error) {
        console.error(`Failed to search songs with keyword ${q}:`, error);
        throw error;
    }
}

export async function advancedSearchForSongs(params: SongSearchParams): Promise<SongWithScore[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/advanced-search/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
            next: { tags: ["songs-all"] },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} ${await response.text()}`);
        }

        const result: SongWithScore[] = await response.json();
        return result;
    } catch (error) {
        console.error(`Failed to search songs with params ${JSON.stringify(params)}:`, error);
        throw error;
    }
}

export async function upsertSong(songID: string | null, data: UpsertSong): Promise<Song> {
    if ((await getCurrentUserRole()) === "user") {
        throw new Error("Unauthorized");
    }

    console.log("Upserting song with data:", data);

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
        fetch(`/api/revalidate/`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${await getCurrentUserToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ songIDs: [result.id] }),
        }).catch((error) => {
            console.error("Failed to trigger revalidation:", error);
        });

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
