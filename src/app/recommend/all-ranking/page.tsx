import { fetchAllSongsAndCache } from "@/lib/songs/cachedapi";
import AllRankingPage from "./ranking";

export default async function RootPage() {
    const songs = await fetchAllSongsAndCache();
    return <AllRankingPage songs={songs.filter((song) => song.publishedType !== -1)} />;
}
