"use client";

import { NextAnchor } from "@/components/nextLink";
import { Anchor, Code, Divider, Table, Text, Title } from "@mantine/core";
import matter from "gray-matter";
import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:3000";

export default function generateDetailsMarkdown({ text }: { text: string }) {
    // gray-matterを使って、メタデータと本文を安全に分離
    const { announcementsData, bodyText } = useMemo(() => {
        try {
            const { data, content } = matter(text);

            if (data.title && data.description) {
                return {
                    announcementsData: [
                        {
                            title: String(data.title),
                            description: String(data.description),
                            pinned: data.pinned === true,
                        },
                    ],
                    bodyText: content.trim(),
                };
            } else {
                return {
                    announcementsData: [],
                    bodyText: text,
                };
            }
        } catch (error) {
            return {
                announcementsData: [],
                bodyText: text,
            };
        }
    }, [text]);

    return {
        announcementsData,
        body: (
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                    a: ({ href, children, ...props }) => {
                        if (!href || (href?.startsWith("http") && !href.startsWith(BASE_URL))) {
                            return (
                                <Anchor
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                    style={{ wordBreak: "break-all" }}
                                    {...props}
                                >
                                    {children}
                                </Anchor>
                            );
                        } else {
                            return (
                                <NextAnchor
                                    href={href}
                                    style={{ wordBreak: "break-all" }}
                                    {...props}
                                >
                                    {children}
                                </NextAnchor>
                            );
                        }
                    },
                    code: ({ children }) => {
                        return <Code color="var(--mantine-color-blue-light)">{children}</Code>;
                    },
                    table: ({ children }) => {
                        return (
                            <Table striped verticalSpacing="sm">
                                {children}
                            </Table>
                        );
                    },
                    thead: ({ children }) => {
                        return <Table.Thead>{children}</Table.Thead>;
                    },
                    tbody: ({ children }) => {
                        return <Table.Tbody>{children}</Table.Tbody>;
                    },
                    tr: ({ children }) => {
                        return <Table.Tr>{children}</Table.Tr>;
                    },
                    th: ({ children }) => {
                        return <Table.Th>{children}</Table.Th>;
                    },
                    td: ({ children }) => {
                        return <Table.Td>{children}</Table.Td>;
                    },
                    p: ({ children }) => {
                        return (
                            <Text size="md" mb="xs">
                                {children}
                            </Text>
                        );
                    },
                    h2: ({ children }) => {
                        return (
                            <>
                                <Title order={2} mt="xl">
                                    {children}
                                </Title>
                                <Divider my="xs" mb="xl" />
                            </>
                        );
                    },
                }}
            >
                {bodyText}
            </ReactMarkdown>
        ),
    };
}
