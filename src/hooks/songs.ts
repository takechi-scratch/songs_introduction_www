"use client";

import { useState, useEffect } from "react";
import { advancedSearchForSongs, fetchNearestSongs, fetchSongById } from "@/lib/songs/api";
import { Song, SongWithScore } from "@/lib/songs/types";
import { SongSearchParams } from "@/lib/search/search";
import { shuffleArray } from "@/lib/utils";

export function useAdvancedSearch(searchParams: SongSearchParams, random: boolean = false) {
    const [songs, setSongs] = useState<(SongWithScore | null)[]>([...Array(10).fill(null)]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasInitialized, setHasInitialized] = useState<boolean>(false);

    async function loadSongs(searchParam: SongSearchParams) {
        try {
            setSongs([...Array(10).fill(null)]);
            setLoading(true);
            const data = await advancedSearchForSongs(searchParam);
            if (random) {
                shuffleArray(data);
            }
            setSongs(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!hasInitialized) {
            loadSongs(searchParams);
            setHasInitialized(true);
            return;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasInitialized]);

    return { songs, loading, error, refetch: () => loadSongs(searchParams) };
}

export function useSong(id: string | null) {
    const [song, setSong] = useState<Song | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function loadSong(id: string | null) {
        if (!id) return;

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

export function useNearestSongs(id: string, limit: number = 10) {
    const [songs, setSongs] = useState<SongWithScore[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function loadNearestSongs(id: string, limit: number) {
        try {
            setLoading(true);
            const data = await fetchNearestSongs(id, limit);
            setSongs(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadNearestSongs(id, limit);
    }, [id, limit]);

    return { songs, loading, error, refetch: () => loadNearestSongs(id, limit) };
}
