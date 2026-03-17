"use client";

import MyAppShell from "@/components/appshell/myAppshell";
import randomContents from "@/components/guestAvatar";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, Avatar, Box, Button, Group, Paper, Stack, Title } from "@mantine/core";
import { IconRefresh, IconUserQuestion } from "@tabler/icons-react";
import Link from "next/link";

export default function SettingsPage() {
    const { userInfo, user } = useAuth();
    const isGuest = user?.providerData.length === 0;

    if (!userInfo || isGuest) {
        return (
            <MyAppShell>
                <Title order={1} mb="md">
                    ユーザー設定
                </Title>
                <Paper shadow="xs" p="md" mb="md" radius="md">
                    <Alert icon={<IconUserQuestion size={24} />}>
                        ユーザー設定を変更するには、
                        <Link href="/login">{userInfo ? "アカウント連携" : "ログイン"}</Link>
                        してください。
                    </Alert>
                </Paper>
            </MyAppShell>
        );
    }

    let displayIcon;
    if (!userInfo.useProvidedIcon) {
        // 設定からアイコンを表示可能
        displayIcon = randomContents(userInfo.id).icon;
    } else {
        displayIcon = <Avatar src={userInfo.IconURL} alt="Icon" />;
    }

    return (
        <MyAppShell>
            <Title order={1} mb="md">
                ユーザー設定
            </Title>
            <Paper shadow="xs" p="md" mb="md" radius="md">
                <Title order={2} mb="sm">
                    プロフィール
                </Title>
                <Group gap="md">
                    <Group>
                        <Stack align="center" gap="xs">
                            {displayIcon}
                            <Button
                                variant="outline"
                                size="xs"
                                onClick={() => alert("アイコンの変更機能は現在開発中です。")}
                            >
                                <IconRefresh size={16} />
                                変更
                            </Button>
                        </Stack>
                    </Group>
                    <Box style={{ flex: 1 }}>
                        <Title order={3}>表示名:</Title>
                        <span>{userInfo?.displayName || "未設定"}</span>
                    </Box>
                </Group>
            </Paper>
        </MyAppShell>
    );
}
