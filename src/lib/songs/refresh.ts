"use server";
import { revalidatePath } from "next/cache";

export async function refreshSongPage(songID: string) {
    revalidatePath("/songs/" + songID);
    revalidatePath("/");
}
