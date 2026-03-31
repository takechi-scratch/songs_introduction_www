"use client";

import {
    Text,
    Avatar as MantineAvatar,
    Group,
    Box,
    HoverCard,
    Textarea,
    Button,
    Anchor,
    Alert,
    List,
} from "@mantine/core";
import MantineMarkdown from "./markdown";
import Avatar from "boring-avatars";
import { Comment } from "@/lib/interaction/types";
import { formatDateTime, formatElapsedSeconds } from "@/lib/date";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { IconEdit, IconTrash, IconUserQuestion } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { deleteComment, postComment, updateComment } from "@/lib/interaction/api";
import { refreshComments } from "@/lib/refresh";
import { loginWithAnonymous } from "@/lib/auth/firebase";
import { getHotkeyHandler, useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import randomContents from "./guestAvatar";
import { useUserRole } from "@/hooks/auth";

const messages = [
    "コメントを入力...",
    "感想を一言で表すと...",
    "初めてこの曲を聴いた時のことを思い出してみてください...",
    "この曲の第一印象はどうでしたか？",
    "この曲を誰かにおすすめするなら、どう紹介しますか？",
    "歌詞の一番好きなところはどこですか？",
    "曲でぐっと惹きつけられる部分はどこですか？",
    "どんな場面で聴きたい曲ですか？",
];

export function CommentCard<IDType extends unknown>({
    id,
    comment,
    onCommentEdited,
    onCommentDeleted,
}: {
    id: IDType;
    comment: Comment;
    onCommentEdited?: (id: IDType, comment: Comment) => void;
    onCommentDeleted?: (id: IDType) => void;
}) {
    const { icon, displayName } = randomContents(comment.user.id);
    const { user, userInfo } = useAuth();
    const isGuest = user?.providerData.length === 0;
    const userRole = useUserRole();
    const isMine = userInfo && !isGuest && userInfo.id === comment.user.id;

    const [editMode, { toggle: toggleEditMode, close: closeEditMode }] = useDisclosure(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const [sending, setSending] = useState(false);

    const displayIcon = comment.user.IconURL ? (
        <MantineAvatar src={comment.user.IconURL} alt="Icon" />
    ) : (
        icon
    );

    async function handleEditComment() {
        setSending((state) => !state);
        if (editedContent.trim() === "") {
            closeEditMode();
            setSending((state) => !state);
            return;
        }
        await updateComment(comment.id, editedContent);
        await refreshComments(comment.songID);
        closeEditMode();
        setSending((state) => !state);
        onCommentEdited && onCommentEdited(id, { ...comment, content: editedContent });
    }

    return (
        <Group gap="sm" align="start">
            {isMine ? (
                <Link href="/settings/" style={{ textDecoration: "none" }}>
                    {displayIcon}
                </Link>
            ) : (
                displayIcon
            )}

            <Box style={{ flex: 1 }}>
                <Group gap="sm" mb="xs">
                    <Text>{comment.user.displayName || "匿名 " + displayName}</Text>
                    <HoverCard width={250} shadow="sm" position="right">
                        <HoverCard.Target>
                            <Text size="sm" opacity={0.6}>
                                {formatElapsedSeconds(
                                    Number(Date.now() / 1000 - comment.createdAt)
                                )}
                                前
                            </Text>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                            <Text size="sm">投稿：{formatDateTime(comment.createdAt)}</Text>
                            <Text size="sm">更新：{formatDateTime(comment.updatedAt)}</Text>
                        </HoverCard.Dropdown>
                    </HoverCard>
                    {(isMine || userRole === "admin") && (
                        <>
                            <IconEdit
                                size={18}
                                opacity={0.6}
                                onClick={toggleEditMode}
                                style={{ cursor: "pointer" }}
                            />
                            <IconTrash
                                color="red"
                                size={18}
                                opacity={0.6}
                                onClick={() =>
                                    modals.openConfirmModal({
                                        children: "コメントを削除してもよいですか？",
                                        labels: { confirm: "削除する", cancel: "キャンセル" },
                                        confirmProps: { color: "red" },
                                        onConfirm: async () => {
                                            await deleteComment(comment.id);
                                            await refreshComments(comment.songID);
                                            onCommentDeleted && onCommentDeleted(id);
                                        },
                                    })
                                }
                                style={{ cursor: "pointer" }}
                            />
                        </>
                    )}
                </Group>

                {editMode ? (
                    <>
                        <Textarea
                            placeholder="コメントを編集..."
                            minRows={3}
                            mb="xs"
                            w="100%"
                            autosize
                            maw={500}
                            value={editedContent}
                            onChange={(event) => setEditedContent(event.currentTarget.value)}
                            onKeyDown={getHotkeyHandler([["mod+Enter", handleEditComment]])}
                        />
                        <Button size="sm" mb="xs" onClick={handleEditComment} loading={sending}>
                            送信する
                        </Button>
                        <Button size="sm" mb="xs" color="gray" onClick={closeEditMode} ml="xs">
                            キャンセル
                        </Button>
                    </>
                ) : (
                    <MantineMarkdown text={comment.content} />
                )}
            </Box>
        </Group>
    );
}

export function NewCommentCard({
    songID,
    onCommentPosted,
}: {
    songID: string;
    onCommentPosted?: (comment: Comment) => void;
}) {
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

    const [content, setContent] = useState("");
    const [sending, setSending] = useState(false);
    async function handlePostComment() {
        if (content.trim() === "") {
            return;
        }

        setSending((state) => !state);

        let user;
        if (!authUser) {
            user = await loginWithAnonymous();
        }

        const comment = await postComment(songID, content, user);
        refreshComments(songID);

        setContent("");
        setSending((state) => !state);
        onCommentPosted && onCommentPosted(comment);
    }

    const [placeholderMessage, setPlaceholderMessage] = useState("");
    useEffect(() => {
        setPlaceholderMessage(messages[Math.floor(Math.random() * messages.length)]);
    }, []);

    return (
        <Group gap="sm" align="start" mb="md">
            {displayIcon}
            <Box style={{ flex: 1 }}>
                <Group gap="sm" mb="xs">
                    <Text>{displayName}</Text>
                    {linkedUser && (
                        <Anchor ml="md" component={Link} href="/settings/" size="sm">
                            ユーザー設定
                        </Anchor>
                    )}
                </Group>
                <Textarea
                    placeholder={placeholderMessage}
                    minRows={3}
                    mb="xs"
                    autosize
                    w="100%"
                    maw={500}
                    value={content}
                    onChange={(event) => setContent(event.currentTarget.value)}
                    onKeyDown={getHotkeyHandler([["mod+Enter", handlePostComment]])}
                />
                <Text size="sm" c="dimmed" mb="xs">
                    **太字**、- 箇条書き などのマークダウン記法が使えます。
                </Text>
                <Button mb="xs" onClick={handlePostComment} loading={sending}>
                    コメントを投稿
                </Button>
                {!userInfo && (
                    <Alert
                        color="pink"
                        title="ログインしていません"
                        icon={<IconUserQuestion />}
                        mb="xs"
                    >
                        <Text size="sm">
                            コメントを投稿すると、ゲストアカウントが自動で作成されます。
                        </Text>
                        <Text size="sm">
                            <Anchor href="/login/" component={Link} size="sm">
                                ログイン
                            </Anchor>
                            すると、アイコン・表示名の変更や、コメントの編集・削除ができるようになります！（後から連携することもできます）
                        </Text>
                    </Alert>
                )}
                {userInfo && !linkedUser && (
                    <Alert
                        color="pink"
                        title="ゲストアカウントでログインしています"
                        icon={<IconUserQuestion />}
                        mb="xs"
                    >
                        <Anchor href="/login/" component={Link} size="sm">
                            アカウント連携
                        </Anchor>
                        をすると、
                        <List size="sm" mt="xs">
                            <List.Item>アイコン・名前を変えられます！</List.Item>
                            <List.Item>コメントの編集・削除ができます！</List.Item>
                            <List.Item>URL付きのコメントも送れます！</List.Item>
                        </List>
                    </Alert>
                )}
            </Box>
        </Group>
    );
}
