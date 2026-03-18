"use client";

import MyAppShell from "@/components/appshell/myAppshell";
import randomContents from "@/components/guestAvatar";
import { useAuth } from "@/contexts/AuthContext";
import { updateMyUserInfo } from "@/lib/interaction/api";
import { refreshAllComments } from "@/lib/refresh";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Group,
    Paper,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconRefresh, IconUserQuestion } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

export default function SettingsPage() {
    const { userInfo, user } = useAuth();
    const isGuest = user?.providerData.length === 0;
    const [editedUserInfo, setEditedUserInfo] = useState<typeof userInfo>(null);
    const activeUserInfo = editedUserInfo ?? userInfo;

    if (!activeUserInfo || isGuest) {
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

    const { icon: randomIcon, displayName: randomDisplayName } = randomContents(activeUserInfo.id);
    let displayIcon;
    if (!activeUserInfo.useProvidedIcon) {
        displayIcon = randomIcon;
    } else {
        displayIcon = <Avatar src={activeUserInfo.IconURL || user?.photoURL} alt="Icon" />;
    }

    return (
        <MyAppShell>
            <Title order={1} mb="md">
                ユーザー設定
            </Title>
            <Paper shadow="xs" p="md" mb="md" radius="md">
                <Title order={2} mb="md">
                    プロフィール
                </Title>
                <Group gap="md" mb="md" style={{ maxWidth: 500 }}>
                    <Group>
                        <Stack align="center" gap="xs">
                            {displayIcon}
                            <Button
                                variant="outline"
                                size="xs"
                                onClick={() =>
                                    setEditedUserInfo({
                                        ...activeUserInfo,
                                        useProvidedIcon: !activeUserInfo.useProvidedIcon,
                                    })
                                }
                            >
                                <IconRefresh size={16} />
                                変更
                            </Button>
                        </Stack>
                    </Group>
                    <Box style={{ flex: 1 }}>
                        <TextInput
                            label="表示名"
                            description="最大30文字まで"
                            placeholder={"匿名" + randomDisplayName}
                            value={activeUserInfo.displayName || ""}
                            onChange={(event) =>
                                setEditedUserInfo({
                                    ...activeUserInfo,
                                    displayName: event.currentTarget.value || null,
                                })
                            }
                        />
                    </Box>
                </Group>
                <Button
                    fullWidth
                    mb="lg"
                    onClick={async () => {
                        await updateMyUserInfo(activeUserInfo);
                        notifications.show({
                            title: "ユーザー情報を更新しました",
                            message: "ユーザー情報の更新が完了しました。",
                            color: "green",
                        });
                        refreshAllComments();
                    }}
                    style={{ maxWidth: 500 }}
                >
                    変更を保存
                </Button>
                <Text size="sm">
                    アイコンは、デフォルトアイコンか、連携したアカウントのアイコンを選べます。
                </Text>
                <Text size="sm" mb="md">
                    表示名は自由につけられますが、個人情報や不適切な内容を含むものは避けてください。
                </Text>
                <Text c="dimmed" size="sm">
                    ユーザーID: {activeUserInfo.id}
                </Text>
            </Paper>
        </MyAppShell>
    );
}
