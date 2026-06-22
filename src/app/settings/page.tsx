import { fetchAllSongsAndCache } from "@/lib/songs/cachedapi";
import SettingsPage from "./settings";

export default async function RootPage() {
    const songs = await fetchAllSongsAndCache();
    return <SettingsPage songs={songs} />;
}
