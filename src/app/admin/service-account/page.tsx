"use client";

import AdminOnlyComponent from "@/components/adminOnly";
import MyAppShell from "@/components/appshell";
import { Button, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ServiceAccountPage() {
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get("status") === "success") {
            showNotification({
                title: "送信完了",
                message: "専用チャンネル用アカウントの認証情報が正常に更新されました。",
                color: "green",
            });
        } else if (searchParams.get("status") === "unauthorized") {
            showNotification({
                title: "認証エラー",
                message: "Firebaseの認証に失敗しました。再度ログインしてください。",
                color: "red",
            });
        } else if (searchParams.get("status") === "forbidden") {
            showNotification({
                title: "権限エラー",
                message: "この操作はadminのみ実行できます。",
                color: "red",
            });
        } else if (searchParams.get("status") === "error") {
            showNotification({
                title: "エラー",
                message: "更新に失敗しました。",
                color: "red",
            });
        }
    }, [searchParams]);

    const handleStartAuth = async () => {
        try {
            const { getCurrentUserToken } = await import("@/lib/auth/firebase");
            const token = await getCurrentUserToken();

            if (!token) {
                showNotification({
                    title: "エラー",
                    message: "ログインしてください。",
                    color: "red",
                });
                return;
            }

            // FirebaseトークンをhttpOnly cookieに保存
            document.cookie = `firebase_auth_token=${token}; path=/; max-age=300; SameSite=Lax${
                process.env.NODE_ENV === "production" ? "; Secure" : ""
            }`;

            // GETリクエストでリダイレクト
            window.location.href = `/api/service-account/`;
        } catch (error) {
            console.error("Error getting token:", error);
            showNotification({
                title: "エラー",
                message: "認証トークンの取得に失敗しました。",
                color: "red",
            });
        }
    };

    return (
        <MyAppShell>
            <AdminOnlyComponent>
                <Title mb="xl">専用チャンネル用アカウントの管理</Title>
                <Button color="orange" onClick={handleStartAuth}>
                    認証・トークンを更新
                </Button>
            </AdminOnlyComponent>
        </MyAppShell>
    );
}
