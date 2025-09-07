// API取得のコード。
// あとで修正

import { Song, ApiResponse } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export async function fetchSongs(): Promise<Song[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/songs`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse<Song[]> = await response.json();
        return result.data;
    } catch (error) {
        console.error("Failed to fetch songs:", error);
        throw error;
    }
}

export async function fetchSongById(id: string): Promise<Song> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/songs/${id}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse<Song> = await response.json();
        return result.data;
    } catch (error) {
        console.error(`Failed to fetch song ${id}:`, error);
        throw error;
    }
}
