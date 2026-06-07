import { fetchAllSongs } from "@/lib/songs/api";
import Playlist from "./playlist";

export default async function Page() {
    const songs = await fetchAllSongs();

    return <Playlist allSongs={songs} />;
}
