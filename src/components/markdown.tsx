"use client";

import { Anchor, Code, Divider, Table, Text, Title } from "@mantine/core";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { NextAnchor } from "./nextLink";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:3000";

export default function MantineMarkdown({
    text,
    textSize,
}: {
    text: string;
    textSize?: "sm" | "xs" | "md" | "lg" | "xl";
}) {
    return (
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
                            <NextAnchor href={href} style={{ wordBreak: "break-all" }} {...props}>
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
                        <Text size={textSize ?? "md"} mb="xs">
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
            {text}
        </ReactMarkdown>
    );
}
