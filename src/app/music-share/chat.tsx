"use client";

import randomContents from "@/components/guestAvatar";
import { NextAnchor } from "@/components/nextLink";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/auth";
import { getCurrentUserToken, loginWithAnonymous } from "@/lib/auth/firebase";
import { formatTime } from "@/lib/date";
import { User } from "@/lib/interaction/types";
import {
    Alert,
    Box,
    Button,
    Divider,
    Flex,
    Group,
    Avatar as MantineAvatar,
    Paper,
    ScrollArea,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconTrash, IconUserQuestion, IconWifiOff } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

interface Message {
    type: "post" | "delete" | "info";
    chatID: string;
    timestamp: number;
    author: User;
    content: string;
}

export function CommentCard<IDType>({
    id,
    chat,
    onCommentDeleted,
}: {
    id: IDType;
    chat: Message;
    onCommentDeleted: (id: IDType) => void;
}) {
    const { icon, displayName } = randomContents(chat.author.id, 26);
    const { user, userInfo } = useAuth();
    const isGuest = user?.providerData.length === 0;
    const userRole = useUserRole();
    const isMine = userInfo && !isGuest && userInfo.id === chat.author.id;

    const displayIcon = chat.author.IconURL ? (
        <MantineAvatar src={chat.author.IconURL} alt="Icon" size="sm" />
    ) : (
        icon
    );

    return (
        <Group gap="xs" align="start">
            <Box style={{ flex: 1 }}>
                <Group gap="sm" mb="xs">
                    {isMine ? (
                        <Link href="/settings/" style={{ textDecoration: "none" }}>
                            {displayIcon}
                        </Link>
                    ) : (
                        displayIcon
                    )}
                    <Text size="sm">{chat.author.displayName || "匿名 " + displayName}</Text>
                    <Text size="sm" opacity={0.6}>
                        {formatTime(chat.timestamp)}
                    </Text>
                    <Text
                        ml="sm"
                        mr="auto"
                        c={chat.type === "info" ? "gray" : undefined}
                        size={chat.type === "info" ? "sm" : "md"}
                    >
                        {chat.content}
                    </Text>
                    {userRole === "admin" && chat.chatID && (
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
                                        onCommentDeleted(id);
                                    },
                                })
                            }
                            style={{ cursor: "pointer" }}
                        />
                    )}
                </Group>
            </Box>
        </Group>
    );
}

export default function Chat() {
    const { user: authUser, userInfo } = useAuth();
    const linkedUser = authUser && authUser.providerData.length > 0;

    const [chatStatus, setChatStatus] = useState<"active" | "inactive" | "disconnected">(
        "inactive"
    );
    const socketRef = useRef<WebSocket | null>(null);
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);

    function onMessage(event: MessageEvent<string>) {
        const data = JSON.parse(event.data);
        if (data.type === "post") {
            setMessages((prev) => [...prev, data]);
        } else if (data.type === "delete") {
            setMessages((prev) => prev.filter((msg) => msg.chatID !== data.chatID));
        } else if (data.type === "info") {
            setMessages((prev) => [...prev, data]);
        } else if (data.type === "history") {
            setMessages([
                ...data.messages,
                {
                    type: "info",
                    chatID: "",
                    timestamp: Date.now() / 1000,
                    content:
                        "ようこそ！曲の感想やバグ報告など、自由に書き込んでください！個人情報や勧誘などの送信は禁止です。",
                    author: {
                        id: "system",
                        displayName: "システム",
                        IconURL: "/icon-192x192.png",
                        useProvidedIcon: true,
                    },
                },
            ]);
        }
    }

    function onClose(event: CloseEvent) {
        console.log("Chat connection closed", event);
        setChatStatus("disconnected");
    }

    async function onStartChat() {
        if (!authUser) {
            await loginWithAnonymous();
        }

        const websocket = new WebSocket(`${API_BASE_URL.replace(/^http/, "ws")}/share-chat/ws/`);
        socketRef.current = websocket;
        console.log("WebSocket connection established");

        websocket.addEventListener("open", async () => {
            socketRef.current?.send(
                JSON.stringify({
                    type: "auth",
                    token: await getCurrentUserToken(),
                })
            );
        });

        websocket.addEventListener("message", onMessage);
        websocket.addEventListener("close", onClose);
        setChatStatus("active");
    }

    function sendMessage() {
        if (chatStatus === "active" && inputValue.length <= 140 && inputValue.trim() !== "") {
            socketRef.current?.send(JSON.stringify({ type: "post", content: inputValue.trim() }));
            setInputValue("");
        }
    }

    useEffect(() => {
        if (chatStatus !== "active") return;
        return () => {
            socketRef.current?.removeEventListener("message", onMessage);
            socketRef.current?.removeEventListener("close", onClose);
            socketRef.current?.close();
        };
    }, [chatStatus]);

    useEffect(() => {
        if (chatStatus === "active" && viewportRef.current) {
            try {
                viewportRef.current.scrollTo({
                    top: viewportRef.current.scrollHeight,
                    behavior: "smooth",
                });
            } catch (e) {
                // fallback
                viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
            }
        }
    }, [messages, chatStatus]);

    useHotkeys([["mod + Enter", sendMessage]]);

    if (chatStatus === "inactive") {
        return (
            <Paper shadow="sm" p="md" h="100%" radius="md" style={{ overflowY: "auto" }}>
                <Flex direction="column" align="center" justify="center" h="100%">
                    <Title order={2} mt="md" mb="md">
                        チャット
                    </Title>
                    <Button onClick={onStartChat} mb="md">
                        チャットをはじめる
                    </Button>
                    {!userInfo && (
                        <Alert
                            color="pink"
                            title="ログインしていません"
                            icon={<IconUserQuestion />}
                            mb="xs"
                            style={{ wordBreak: "break-all" }}
                        >
                            <Text size="sm">
                                チャットに参加する際、ゲストアカウントが自動で作成されます。
                            </Text>
                            <Text size="sm">
                                <NextAnchor href="/login/" size="sm" style={{ display: "inline" }}>
                                    ログイン
                                </NextAnchor>
                                すると、アイコン・名前を変えられるようになります！（後から連携することもできます）
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
                            <NextAnchor href="/login/" size="sm">
                                アカウント連携
                            </NextAnchor>
                            をすると、アイコン・名前を変えられるようになります！
                        </Alert>
                    )}
                </Flex>
            </Paper>
        );
    }

    return (
        <Paper shadow="sm" p="md" h="100%" radius="md" style={{ overflowY: "auto" }}>
            <Title order={2} mt="md" mb="md">
                チャット
            </Title>
            <ScrollArea h={400} viewportRef={viewportRef}>
                <Box>
                    {messages.map((chat, i) => (
                        <Box key={chat.chatID || i}>
                            <Divider my="xs" />
                            <CommentCard
                                id={i}
                                chat={chat}
                                onCommentDeleted={(id) => {
                                    socketRef.current?.send(
                                        JSON.stringify({ type: "delete", chatID: chat.chatID })
                                    );
                                    setMessages((prev) => prev.filter((_, index) => index !== id));
                                }}
                            />
                        </Box>
                    ))}
                </Box>
            </ScrollArea>
            <Group gap="sm" align="flex-start" mt="sm" w="100%">
                <TextInput
                    style={{ flex: 1 }}
                    placeholder="メッセージを入力..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.currentTarget.value)}
                    error={inputValue.length > 140 ? "140文字以内で入力してください" : false}
                    disabled={chatStatus !== "active"}
                    onKeyDown={getHotkeyHandler([["mod + Enter", sendMessage]])}
                />
                <Button
                    disabled={
                        inputValue.trim() === "" ||
                        inputValue.length > 140 ||
                        chatStatus !== "active"
                    }
                    onClick={sendMessage}
                >
                    送信
                </Button>
            </Group>
            {chatStatus === "disconnected" && (
                <Alert color="red" mt="sm" icon={<IconWifiOff />} title="">
                    <Text size="sm" mb="xs">
                        チャットサーバーとの接続が切断されました。ページを更新して再接続してください。
                    </Text>
                    <Text size="sm">
                        更新しても直らない場合は、お手数ですが
                        <NextAnchor href="/contact/" size="sm">
                            お問い合わせ
                        </NextAnchor>
                        をお願いします。
                    </Text>
                </Alert>
            )}
        </Paper>
    );
}
