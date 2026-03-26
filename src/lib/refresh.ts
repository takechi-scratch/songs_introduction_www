"use server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function refreshSongPage(songID: string) {
    revalidatePath("/songs/" + songID);
}

export async function refreshHomePage() {
    revalidatePath("/");
}

export async function refreshComments(songID: string) {
    revalidateTag("comments-" + songID);
}

export async function refreshAllComments() {
    revalidateTag("comments");
}
