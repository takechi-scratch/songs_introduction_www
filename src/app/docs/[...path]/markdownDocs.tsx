"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Alert, Code, Table } from "@mantine/core";
import Link from "next/link";
import { IconExclamationCircle } from "@tabler/icons-react";

export default function MarkdownDocs({ docs, error }: { docs: string; error: string | null }) {
    if (error) {
        return (
            <Alert
                variant="light"
                color="red"
                radius="md"
                mb="lg"
                title="取得エラー"
                icon={<IconExclamationCircle />}
            >
                {error}
            </Alert>
        );
    }

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            components={{
                a: ({ href, children, ...props }) => {
                    if (!href || href?.startsWith("http")) {
                        return (
                            <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                                {children}
                            </a>
                        );
                    } else {
                        return (
                            <Link href={href} {...props}>
                                {children}
                            </Link>
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
            }}
        >
            {docs || "loading..."}
        </ReactMarkdown>
    );
}
