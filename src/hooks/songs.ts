"use client";

import { useState, useEffect } from "react";
import { fetchNearestSongs, fetchSongById, fetchSongs } from "@/lib/songs/api";
import { Song, SongWithScore } from "@/lib/songs/types";

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
