import { fetchAllSongs } from "@/lib/songs/api";
import SettingsPage from "./settings";

export default async function RootPage() {
    const songs = await fetchAllSongs();
    return <SettingsPage songs={songs} />;
}
