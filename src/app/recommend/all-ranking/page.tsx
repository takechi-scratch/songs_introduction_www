import { fetchAllSongs } from "@/lib/songs/api";
import AllRankingPage from "./ranking";

export default async function RootPage() {
    const songs = await fetchAllSongs();
    return <AllRankingPage songs={songs.filter((song) => song.publishedType !== -1)} />;
}
