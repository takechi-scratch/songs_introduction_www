// API取得のコード。
// あとで修正

import { Song } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function fetchSongs(): Promise<Song[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/songs_all/`);

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
        const response = await fetch(`${API_BASE_URL}/songs/${id}`);

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
