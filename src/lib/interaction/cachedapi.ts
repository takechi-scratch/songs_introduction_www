import { cacheLife, cacheTag } from "next/cache";
import { fetchCommentsBySongID } from "./api";
import { Comment } from "./types";

export async function fetchCommentsBySongIDAndCache(songID: string): Promise<Comment[]> {
    "use cache";
    cacheTag("comments-" + songID, "comments");
    cacheLife("weeks");
    return fetchCommentsBySongID(songID);
}
