"use client";

import AdminOnlyComponent from "@/components/adminOnly";
import MyAppShell from "@/components/appshell";
import { Button, Text, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { getCurrentUserToken } from "@/lib/auth/firebase";

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
            const token = await getCurrentUserToken();

            if (!token) {
                showNotification({
                    title: "エラー",
                    message: "ログインしてください。",
                    color: "red",
                });
                return;
            }

            // POSTでトークンを送信し、サーバー側でCookieにセット
            const response = await fetch("/api/service-account/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data: { authUrl?: string; error?: string } = await response.json();

            if (data.authUrl) {
                window.location.href = data.authUrl;
            } else {
                window.location.href = `/admin/service-account?status=${data.error || "error"}`;
            }
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
                <Button color="orange" onClick={handleStartAuth} mb="md">
                    認証・トークンを更新
                </Button>
                <Text mb="md" c="dimmed" size="sm">
                    ※2分以内に認証を完了させてください。
                </Text>
            </AdminOnlyComponent>
        </MyAppShell>
    );
}
