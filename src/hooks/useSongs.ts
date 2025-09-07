// Reactで曲を取得するhooks。
// あとで修正

"use client";

import { useState, useEffect } from "react";
import { fetchSongs } from "@/lib/api/songs";
import { Song } from "@/lib/api/types";

export function useSongs() {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
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

        loadSongs();
    }, []);

    return { songs, loading, error, refetch: () => loadSongs() };
}
