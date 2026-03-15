"use client";

import {
    Text,
    Avatar as MantineAvater,
    Group,
    Box,
    HoverCard,
    Textarea,
    Button,
    Anchor,
    Alert,
} from "@mantine/core";
import MantineMarkdown from "./markdown";
import Avatar from "boring-avatars";
import { Comment } from "@/lib/interaction/types";
import { formatDateTime, formatElapsedSeconds } from "@/lib/date";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { IconUserQuestion } from "@tabler/icons-react";
import { useState } from "react";
import { postComment } from "@/lib/interaction/api";
import { useRouter } from "next/navigation";
import { refreshComments } from "@/lib/refresh";
import { loginWithAnonymous } from "@/lib/auth/firebase";

const names = [
    "Mary Baker",
    "Amelia Earhart",
    "Mary Roebling",
    "Sarah Winnemucca",
    "Margaret Brent",
    "Lucy Stone",
    "Mary Edwards",
    "Margaret Chase",
    "Mahalia Jackson",
    "Maya Angelou",
];

const colorTypes = [
    ["#0a0310", "#49007e", "#ff005b", "#ff7d10", "#ffb238"],
    ["#b1e6d1", "#77b1a9", "#3d7b80", "#270a33", "#451a3e"],
    ["#fff4ce", "#d0deb8", "#ffa492", "#ff7f81", "#ff5c71"],
];

const displayNames = ["うさぎ", "フランスパン", "ラベンダー", "ハート", "紅茶", "桜"];

function randomContents(name: string) {
    const hash = Array.from(name).reduce(
        (acc, char, i) => acc + char.charCodeAt(0) * (i + 1),
        3131
    );

    const colorType = colorTypes[hash % colorTypes.length];
    const iconName = names[hash % names.length];

    return [
        <Avatar name={iconName} colors={colorType} variant="beam" size={40} />,
        displayNames[hash % displayNames.length],
    ];
}

export function CommentCard({ comment }: { comment: Comment }) {
    const [Identicon, displayName] = randomContents(comment.user.id);

    return (
        <Group gap="sm" align="start">
            {comment.user.IconURL ? (
                <MantineAvater src={comment.user.IconURL} alt="Icon" />
            ) : (
                Identicon
            )}

            <Box>
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
                </Group>

                <MantineMarkdown text={comment.content} />
            </Box>
        </Group>
    );
}

export function NewCommentCard({ songID }: { songID: string }) {
    const { user: authUser, userInfo } = useAuth();
    const linkedUser = authUser && authUser.providerData.length > 0;

    let randomIdenticon, randomDisplayName;
    if (userInfo) {
        randomIdenticon = <Avatar radius="xl" />;
        [randomIdenticon, randomDisplayName] = randomContents(userInfo.id);
    } else {
        [randomIdenticon, randomDisplayName] = randomContents("guest");
    }

    let displayIcon, displayName;
    if (!userInfo) {
        // 投稿後にアイコン・表示名が決定する
        displayIcon = <MantineAvater alt="Icon" />;
    } else if (!linkedUser) {
        // アカウント連携するとアイコン表示可能
        displayIcon = randomIdenticon;
        displayName = randomDisplayName;
    } else if (!userInfo.useProvidedIcon) {
        // 設定からアイコンを表示可能
        displayIcon = randomIdenticon;
        displayName = randomDisplayName;
    } else {
        displayIcon = <MantineAvater src={userInfo.IconURL} alt="Icon" />;
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
    const router = useRouter();
    async function handlePostComment() {
        if (content.trim() === "") {
            return;
        }

        let user;
        if (!authUser) {
            user = await loginWithAnonymous();
        }

        await postComment(songID, content, user);
        await refreshComments(songID);

        setContent("");
        router.refresh();
    }

    return (
        <Group gap="sm" align="start" mb="md">
            {displayIcon}
            <Box style={{ flex: 1 }}>
                <Group gap="sm" mb="xs">
                    <Text>{displayName}</Text>
                    {linkedUser && (
                        <Anchor ml="md" component={Link} href="/settings/profile" size="sm">
                            ユーザー設定
                        </Anchor>
                    )}
                </Group>
                <Textarea
                    placeholder={
                        "コメントを入力...\nマークダウン記法に対応（**太字**、- 箇条書き など）"
                    }
                    minRows={3}
                    mb="xs"
                    autosize
                    w="50%"
                    maw={500}
                    value={content}
                    onChange={(event) => setContent(event.currentTarget.value)}
                />
                <Button mb="xs" onClick={handlePostComment}>
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
                        をすると、アイコン・表示名の変更や、コメントの編集・削除ができるようになります！
                    </Alert>
                )}
            </Box>
        </Group>
    );
}
