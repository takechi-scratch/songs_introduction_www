"use client";

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { onAuthStateChange } from "@/lib/auth/firebase";
import { fetchMyUserInfo } from "@/lib/interaction/api";
import { User } from "@/lib/interaction/types";

interface AuthContextType {
    user: FirebaseUser | null;
    loading: boolean;
    userInfo: User | null;
    userInfoLoading: boolean;
    userInfoError: string | null;
    refreshMyUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [userInfoLoading, setUserInfoLoading] = useState(true);
    const [userInfoError, setUserInfoError] = useState<string | null>(null);

    const refreshMyUser = useCallback(async () => {
        if (!user) {
            setUserInfo(null);
            setUserInfoError(null);
            setUserInfoLoading(false);
            return;
        }

        try {
            setUserInfoLoading(true);
            const data = await fetchMyUserInfo();
            setUserInfo(data);
            setUserInfoError(null);
        } catch (err) {
            setUserInfoError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setUserInfoLoading(false);
        }
    }, [user]);

    useEffect(() => {
        const unsubscribe = onAuthStateChange((user) => {
            setUser(user);
            setLoading(false);
        });

        // クリーンアップ関数
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        refreshMyUser();
    }, [user?.uid, refreshMyUser]);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                userInfo,
                userInfoLoading,
                userInfoError,
                refreshMyUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
