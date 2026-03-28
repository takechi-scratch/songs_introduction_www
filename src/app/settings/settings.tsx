"use client";

import MyAppShell from "@/components/appshell/myAppshell";
import randomContents from "@/components/guestAvatar";
import MantineMarkdown from "@/components/markdown";
import { useAuth } from "@/contexts/AuthContext";
import { useMyComments } from "@/hooks/interaction";
import { formatDateTime, formatElapsedSeconds } from "@/lib/date";
import { downloadComments } from "@/lib/downloadComments";
import { updateMyUserInfo } from "@/lib/interaction/api";
import { Comment, User } from "@/lib/interaction/types";
import { refreshAllComments } from "@/lib/refresh";
import { Song } from "@/lib/songs/types";
import {
    Alert,
    Anchor,
    Avatar,
    Box,
    Button,
    Divider,
    Group,
    HoverCard,
    Paper,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
    IconCodeDots,
    IconFileSpreadsheet,
    IconRefresh,
    IconUserQuestion,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState, Fragment } from "react";
import { User as FirebaseUser } from "firebase/auth";

function MyCommentCard({ comment, songTitle }: { comment: Comment; songTitle: string }) {
    return (
        <Box style={{ flex: 1 }}>
            <Group gap="sm" mb="xs">
                <Anchor href={`/songs/${comment.songID}`} component={Link}>
                    {songTitle}
                </Anchor>
                <HoverCard width={250} shadow="sm" position="right">
                    <HoverCard.Target>
                        <Text size="sm" opacity={0.6}>
                            {formatElapsedSeconds(Number(Date.now() / 1000 - comment.createdAt))}前
                        </Text>
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                        <Text size="sm">投稿：{formatDateTime(comment.createdAt)}</Text>
                        <Text size="sm">更新：{formatDateTime(comment.updatedAt)}</Text>
                    </HoverCard.Dropdown>
                </HoverCard>
            </Group>

            <MantineMarkdown text={comment.content} />
        </Box>
    );
}

function SettingsSection({
    user,
    userInfo,
    myComments,
}: {
    user: FirebaseUser | null;
    userInfo: User | null;
    myComments: { comment: Comment; songTitle: string }[];
}) {
    const isGuest = user?.providerData.length === 0;
    const [editedUserInfo, setEditedUserInfo] = useState<typeof userInfo>(userInfo);
    const comments = myComments.map(({ comment }) => comment);

    if (!userInfo || !editedUserInfo || isGuest) {
        return (
            <Paper shadow="xs" p="md" mb="md" radius="md">
                <Alert icon={<IconUserQuestion size={24} />}>
                    ユーザー設定を変更するには、
                    <Link href="/login">{userInfo ? "アカウント連携" : "ログイン"}</Link>
                    してください。
                </Alert>
            </Paper>
        );
    }

    const { icon: randomIcon, displayName: randomDisplayName } = randomContents(userInfo.id);
    let displayIcon;
    if (!editedUserInfo?.useProvidedIcon) {
        displayIcon = randomIcon;
    } else {
        displayIcon = <Avatar src={editedUserInfo.IconURL || user?.photoURL} alt="Icon" />;
    }

    return (
        <>
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
                                        ...editedUserInfo,
                                        useProvidedIcon: !editedUserInfo?.useProvidedIcon,
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
                            value={userInfo.displayName || ""}
                            onChange={(event) =>
                                setEditedUserInfo({
                                    ...editedUserInfo,
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
                        await updateMyUserInfo(editedUserInfo);
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
                    ユーザーID: {userInfo.id}
                </Text>
            </Paper>
            <Paper shadow="xs" p="md" mb="md" radius="md">
                <Title order={2} mb="md">
                    コメント履歴
                </Title>
                {myComments ? (
                    myComments.map(
                        ({ comment, songTitle }: { comment: Comment; songTitle: string }) => (
                            <Fragment key={comment.id}>
                                <MyCommentCard
                                    key={comment.id}
                                    comment={comment}
                                    songTitle={songTitle}
                                />
                                <Divider my="md" />
                            </Fragment>
                        )
                    )
                ) : (
                    <Text>コメントを読み込み中...</Text>
                )}
                <Group gap="md" mb="md">
                    <Button
                        color="teal"
                        onClick={() => {
                            downloadComments(comments || [], "csv");
                        }}
                    >
                        <IconFileSpreadsheet size={20} style={{ marginRight: 4 }} />
                        CSV形式でダウンロード
                    </Button>
                    <Button
                        color="orange"
                        onClick={() => {
                            downloadComments(comments || [], "json");
                        }}
                    >
                        <IconCodeDots size={20} style={{ marginRight: 4 }} />
                        JSON形式でダウンロード
                    </Button>
                </Group>
            </Paper>
        </>
    );
}

export default function SettingsPage({ songs }: { songs: Song[] }) {
    const { userInfo, user } = useAuth();
    const { comments } = useMyComments();

    console.log(userInfo);
    console.log(user?.photoURL);

    return (
        <MyAppShell>
            <SettingsSection
                key={`${user?.uid || "guest"} + ${userInfo?.id || "guest"}`}
                user={user}
                userInfo={userInfo}
                myComments={
                    comments
                        ? comments.map((comment) => ({
                              comment,
                              songTitle:
                                  songs.find((song) => song.id === comment.songID)?.title ||
                                  "不明な曲",
                          }))
                        : []
                }
            />
        </MyAppShell>
    );
}
