import { formatDate, formatDateTime } from "./date";
import { Comment } from "./interaction/types";

export function downloadComments(comments: Comment[], type: "csv" | "json") {
    let textContent: string;
    if (type === "csv") {
        const header = "コメントID,曲の動画ID,コメント内容,投稿日時,更新日時\n";
        const rows = comments.map(
            (comment) =>
                `"${comment.id}","${comment.songID}","${comment.content}","${formatDateTime(comment.createdAt)}","${formatDateTime(comment.updatedAt)}"`
        );
        textContent = header + rows.join("\n");
    } else {
        textContent = JSON.stringify(
            comments.map((comment) => ({
                id: comment.id,
                songID: comment.songID,
                content: comment.content,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
            })),
            null,
            2
        );
    }

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `mimi_introduction_comments.${formatDate(new Date().getTime())}.${type}`;
    a.click();

    URL.revokeObjectURL(url);
}
