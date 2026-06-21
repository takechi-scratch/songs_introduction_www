import { cacheTag } from "next/cache";
import { SongSearchParams } from "../search/search";
import {
    advancedSearchForSongs,
    fetchAllSongs,
    fetchNearestSongs,
    fetchSongById,
    searchSongs,
} from "./api";
import { Song, SongWithScore } from "./types";

export async function fetchAllSongsAndCache(): Promise<Song[]> {
    "use cache";
    cacheTag("songs-all");
    return fetchAllSongs();
}

export async function fetchSongByIdAndCache(id: string): Promise<Song> {
    "use cache";
    cacheTag(`song-${id}`);
    return fetchSongById(id);
}

export async function fetchNearestSongsAndCache(
    id: string,
    limit: number = 10
): Promise<SongWithScore[]> {
    "use cache";
    cacheTag("songs-all");
    return fetchNearestSongs(id, limit);
}

export async function searchSongsAndCache(q: string): Promise<Song[]> {
    "use cache";
    cacheTag("songs-all");
    return searchSongs(q);
}

export async function advancedSearchForSongsAndCache(
    params: SongSearchParams
): Promise<SongWithScore[]> {
    "use cache";
    cacheTag("songs-all");
    return advancedSearchForSongs(params);
}
