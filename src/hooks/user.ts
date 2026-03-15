import { useAuth } from "@/contexts/AuthContext";
import { fetchMyUserInfo } from "@/lib/interaction/api";
import { User } from "@/lib/interaction/types";
import { useEffect, useState } from "react";

export function useMyUserInfo() {
    const { user: authUser } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function loadUser() {
        try {
            setLoading(true);
            if (!authUser) {
                setUser(null);
                setError(null);
                return;
            }
            const data = await fetchMyUserInfo();
            setUser(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUser();
    }, [authUser, loadUser]);

    return { user, loading, error, refetch: () => loadUser() };
}
