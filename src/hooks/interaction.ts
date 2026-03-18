import { useAuth } from "@/contexts/AuthContext";
import { fetchMyComments } from "@/lib/interaction/api";
import { Comment } from "@/lib/interaction/types";
import { useEffect, useState } from "react";

export function useMyComments() {
    const [comments, setComments] = useState<Comment[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    async function loadComments() {
        try {
            if (!user) {
                setComments(null);
                setError(null);
                return;
            }
            setLoading(true);
            const data = await fetchMyComments();
            setComments(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadComments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return { comments, loading, error, refetch: () => loadComments() };
}
