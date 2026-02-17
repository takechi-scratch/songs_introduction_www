import { Song, SongWithScore, hasScore } from "@/lib/songs/types";
import { createPlaylist, CreatePlaylistResult, createMetaDataFromSearchQuery } from "@/lib/youtube";
import { useMemo, useState } from "react";
import { SongSearchParams } from "@/lib/search/search";

export function usePlaylistManager(
    songs: (Song | SongWithScore | null)[],
    confirm?: () => Promise<boolean>,
    creating?: () => void,
    callback?: (result: CreatePlaylistResult) => void
) {
    const [loadingPlaylist, setLoadingPlaylist] = useState(false);

    const validSongs = useMemo(() => {
        return songs
            .filter((song) => song !== null)
            .filter((song) => {
                if (hasScore(song)) return song.song.publishedType !== -1;
                return song.publishedType !== -1;
            });
    }, [songs]);

    async function createFromSearchParams(searchParams: SongSearchParams) {
        if (confirm && !(await confirm())) return;
        setLoadingPlaylist(true);
        const metadata = await createMetaDataFromSearchQuery(validSongs.length, searchParams);
        callPlaylistAPI(metadata.title, metadata.description);
    }

    async function create(title: string, description: string) {
        if (confirm && !(await confirm())) return;
        setLoadingPlaylist(true);
        callPlaylistAPI(title, description);
    }

    function callPlaylistAPI(title: string, description: string) {
        if (creating) creating();

        createPlaylist(validSongs, title, description).then((result) => {
            setLoadingPlaylist(false);
            if (callback) callback(result);
        });
    }

    return { loadingPlaylist, validSongs, createFromSearchParams, create };
}
