"use client";

import randomContents from "@/components/guestAvatar";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/auth";
import { getCurrentUserToken } from "@/lib/auth/firebase";
import { formatTime } from "@/lib/date";
import { User } from "@/lib/interaction/types";
import {
    Box,
    Button,
    Divider,
    Flex,
    Group,
    Avatar as MantineAvatar,
    Paper,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

interface Message {
    type: "post" | "delete";
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
    const { icon, displayName } = randomContents(chat.author.id, 30);
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
        <Group gap="sm" align="start">
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
                    <Text ml="sm" mr="auto">
                        {chat.content}
                    </Text>
                    {userRole === "admin" && (
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
    const [enabled, { toggle: toggleEnabled }] = useDisclosure(false);
    const socketRef = useRef<WebSocket | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    // console.log(messages);

    const onMessage = (event: MessageEvent<string>) => {
        const data = JSON.parse(event.data);
        console.log("Received message:", data);
        if (data.type === "post") {
            setMessages((prev) => [...prev, data]);
            console.log("Updated messages:", [...messages, data]);
        } else if (data.type === "delete") {
            setMessages((prev) => prev.filter((msg) => msg.chatID !== data.chatID));
        }
    };

    async function onStartChat() {
        const websocket = new WebSocket(
            `${API_BASE_URL.replace(/^http/, "ws")}/share-chat/ws/?token=${await getCurrentUserToken()}`
        );
        socketRef.current = websocket;
        console.log("WebSocket connection established");

        websocket.addEventListener("message", onMessage);
        toggleEnabled();
    }

    useEffect(() => {
        if (!enabled) return;

        function closeSocket() {
            socketRef.current?.removeEventListener("message", onMessage);
            socketRef.current?.close();
        }

        window.addEventListener("beforeunload", closeSocket);

        return () => {
            window.removeEventListener("beforeunload", closeSocket);
        };
    }, [enabled]);

    if (!enabled) {
        return (
            <Paper shadow="sm" p="md" h="100%" radius="md" style={{ overflowY: "auto" }}>
                <Flex direction="column" align="center" justify="center" h="100%">
                    <Title order={2} mt="md" mb="md">
                        チャット
                    </Title>
                    <Button onClick={onStartChat}>チャットをはじめる</Button>
                </Flex>
            </Paper>
        );
    }

    return (
        <Paper shadow="sm" p="md" h="100%" radius="md" style={{ overflowY: "auto" }}>
            <Title order={2} mt="md" mb="md">
                チャット
            </Title>
            {messages.map((chat, i) => (
                <Box key={chat.chatID}>
                    <Divider my="sm" />
                    <CommentCard
                        id={i}
                        chat={chat}
                        onCommentDeleted={(id) => {
                            setMessages((prev) => prev.filter((_, index) => index !== id));
                        }}
                    />
                </Box>
            ))}
            <Group gap="sm" align="center" mt="sm" w="100%">
                <TextInput
                    ref={inputRef}
                    style={{ flex: 1 }}
                    placeholder="メッセージを入力..."
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
                            socketRef.current?.send(
                                JSON.stringify({ type: "post", content: e.currentTarget.value })
                            );
                            e.currentTarget.value = "";
                        }
                    }}
                />
                <Button
                    onClick={() => {
                        if (!inputRef.current) return;
                        if (inputRef.current.value.trim() === "") return;
                        socketRef.current?.send(
                            JSON.stringify({ type: "post", content: inputRef.current.value })
                        );
                        inputRef.current.value = "";
                    }}
                >
                    送信
                </Button>
            </Group>
        </Paper>
    );
}
