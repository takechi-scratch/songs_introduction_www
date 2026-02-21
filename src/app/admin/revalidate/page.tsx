"use client";

import AdminOnlyComponent from "@/components/adminOnly";
import MyAppShell from "@/components/appshell";
import { getCurrentUserToken } from "@/lib/auth/firebase";
import { Title, Button, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";

export default function AllRevalidatePage() {
    return (
        <MyAppShell>
            <AdminOnlyComponent>
                <Title mb="xl">ページキャッシュを再生成</Title>
                <Text mb="md">トップページ・関連検索などのキャッシュを再生成します。</Text>
                <Button color="red" onClick={async () => revalidateAll()} mb="md">
                    再生成
                </Button>
            </AdminOnlyComponent>
        </MyAppShell>
    );
}

async function revalidateAll() {
    const token = await getCurrentUserToken();

    try {
        const response = await fetch("/api/revalidate", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            showNotification({
                title: "成功",
                message: "全てのキャッシュの再生成が開始されました。",
                color: "green",
            });
        } else {
            showNotification({
                title: "エラー",
                message: "全てのキャッシュの再生成に失敗しました。",
                color: "red",
            });
        }
    } catch (error) {
        console.error("Error revalidating all:", error);
        showNotification({
            title: "エラー",
            message: "キャッシュの再生成中にエラーが発生しました。",
            color: "red",
        });
    }
}
