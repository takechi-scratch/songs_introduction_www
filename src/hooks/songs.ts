// Reactで曲を取得するhooks。
// あとで修正

"use client";

import { useState, useEffect } from "react";
import { fetchSongById, fetchSongs } from "@/lib/songs/api";
import { Song } from "@/lib/songs/types";

export function useSongs() {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function loadSongs() {
        try {
            setLoading(true);
            const data = await fetchSongs();
            setSongs(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadSongs();
    }, []);

    return { songs, loading, error, refetch: () => loadSongs() };
}

export function useSong(id: string) {
    const [song, setSong] = useState<Song | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function loadSong(id: string) {
        try {
            setLoading(true);
            const data = await fetchSongById(id);
            setSong(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadSong(id);
    }, [id]);

    return { song, loading, error, refetch: () => loadSong(id) };
}
