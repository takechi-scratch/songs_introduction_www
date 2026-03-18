import { getCurrentUserRole, getCurrentUserToken } from "../auth/firebase";
import { Comment, UpdateUser, User } from "./types";
import { User as FirebaseUser } from "firebase/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function fetchMyUserInfo(): Promise<User> {
    if ((await getCurrentUserRole()) === "guest") {
        throw new Error("Unauthorized");
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${await getCurrentUserToken()}`,
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: User = await response.json();
        return result;
    } catch (error) {
        console.error("Failed to fetch user info:", error);
        throw error;
    }
}

export async function updateMyUserInfo(data: UpdateUser): Promise<User> {
    if ((await getCurrentUserRole()) === "guest") {
        throw new Error("Unauthorized");
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${await getCurrentUserToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: User = await response.json();
        return result;
    } catch (error) {
        console.error("Failed to update user info:", error);
        throw error;
    }
}

export async function fetchMyComments(): Promise<Comment[]> {
    if ((await getCurrentUserRole()) === "guest") {
        throw new Error("Unauthorized");
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/me/comments/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${await getCurrentUserToken()}`,
            },
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: Comment[] = await response.json();
        return result;
    } catch (error) {
        console.error(`Failed to fetch my comments:`, error);
        throw error;
    }
}

export async function fetchCommentsBySongID(songID: string): Promise<Comment[]> {
    try {
        const response = await fetch(
            `${API_BASE_URL}/comments/?songID=${encodeURIComponent(songID)}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                next: { tags: [`comments-${songID}`, "comments"] },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: Comment[] = await response.json();
        return result;
    } catch (error) {
        console.error(`Failed to fetch comments for song ${songID}:`, error);
        throw error;
    }
}

export async function postComment(
    songID: string,
    content: string,
    user?: FirebaseUser
): Promise<Comment> {
    let token;
    if (user) {
        token = await user.getIdToken();
    } else if ((await getCurrentUserRole()) !== "guest") {
        token = await getCurrentUserToken();
    } else {
        throw new Error("Unauthorized");
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/comments/?songID=${encodeURIComponent(songID)}`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content }),
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: Comment = await response.json();
        return result;
    } catch (error) {
        console.error(`Failed to post comment for song ${songID}:`, error);
        throw error;
    }
}

export async function deleteComment(commentID: string): Promise<void> {
    if ((await getCurrentUserRole()) === "guest") {
        throw new Error("Unauthorized");
    }

    try {
        const response = await fetch(`${API_BASE_URL}/comments/${encodeURIComponent(commentID)}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${await getCurrentUserToken()}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error(`Failed to delete comment ${commentID}:`, error);
        throw error;
    }
}

export async function updateComment(commentID: string, content: string): Promise<Comment> {
    if ((await getCurrentUserRole()) === "guest") {
        throw new Error("Unauthorized");
    }

    try {
        const response = await fetch(`${API_BASE_URL}/comments/${encodeURIComponent(commentID)}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${await getCurrentUserToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: Comment = await response.json();
        return result;
    } catch (error) {
        console.error(`Failed to update comment ${commentID}:`, error);
        throw error;
    }
}
