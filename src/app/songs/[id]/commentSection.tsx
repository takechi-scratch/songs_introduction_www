"use client";

import randomContents from "@/components/guestAvatar";
import { NextAnchor } from "@/components/nextLink";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, Avatar, Box, Group, Avatar as MantineAvatar, Paper, Text } from "@mantine/core";
import { IconHistoryToggle } from "@tabler/icons-react";

// コメント機能終了につき、移行的な対応
export default function CommentSection() {
    const { user: authUser, userInfo } = useAuth();
    const linkedUser = authUser && authUser.providerData.length > 0;

    let randomIdenticon, randomDisplayName;
    if (userInfo) {
        randomIdenticon = <Avatar radius="xl" />;
        ({ icon: randomIdenticon, displayName: randomDisplayName } = randomContents(userInfo.id));
    } else {
        ({ icon: randomIdenticon, displayName: randomDisplayName } = randomContents("guest"));
    }

    let displayIcon, displayName;
    if (!userInfo) {
        // 投稿後にアイコン・表示名が決定する
        displayIcon = <MantineAvatar alt="Icon" />;
    } else if (!linkedUser) {
        // アカウント連携するとアイコン表示可能
        displayIcon = randomIdenticon;
        displayName = randomDisplayName;
    } else if (!userInfo.useProvidedIcon) {
        // 設定からアイコンを表示可能
        displayIcon = randomIdenticon;
        displayName = randomDisplayName;
    } else {
        displayIcon = <MantineAvatar src={userInfo.IconURL} alt="Icon" />;
        displayName = userInfo.displayName || "匿名";
    }

    if (!authUser) {
        displayName = "匿名";
    } else if (!linkedUser) {
        displayName = "匿名 " + randomDisplayName;
    } else {
        displayName = userInfo?.displayName || "匿名 " + randomDisplayName;
    }

    return (
        <Paper p="md" radius="md" shadow="xs">
            <Group gap="sm" align="start" mb="md">
                {displayIcon}
                <Box style={{ flex: 1 }}>
                    <Group gap="sm" mb="xs">
                        <Text>{displayName}</Text>
                        {linkedUser && (
                            <NextAnchor ml="md" href="/settings/" size="sm">
                                ユーザー設定
                            </NextAnchor>
                        )}
                    </Group>
                    <Alert
                        variant="light"
                        color="gray"
                        radius="md"
                        title="コメント機能終了"
                        icon={<IconHistoryToggle />}
                    >
                        <Text>
                            コメントを投稿できる機能は終了しました。
                            <NextAnchor href="/settings/">ユーザー設定</NextAnchor>
                            から、過去に投稿したコメントを確認・ダウンロードできます。
                        </Text>
                    </Alert>
                </Box>
            </Group>
        </Paper>
    );
}
