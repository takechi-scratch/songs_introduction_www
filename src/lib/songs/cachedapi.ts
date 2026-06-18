import { cacheTag } from "next/cache";
import { SongSearchParams } from "../search/search";
import { advancedSearchForSongs } from "./api";
import { SongWithScore } from "./types";

export async function advancedSearchForSongsAndCache(
    params: SongSearchParams
): Promise<SongWithScore[]> {
    "use cache";
    cacheTag("songs-all");
    return advancedSearchForSongs(params);
}
