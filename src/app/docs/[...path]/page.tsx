"use client";

import MyAppShell from "@/components/appshell";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { useDocsFile } from "@/hooks/docs";
import { Code, Table } from "@mantine/core";
import { use } from "react";
import Link from "next/link";
import React from "react";

// useを使えーって出るときは、引数部分をPromiseで囲む！
export default function DocsPage({ params }: { params: Promise<{ path: string[] }> }) {
    const path = use(params).path;
    const { docs } = useDocsFile(path);

    return (
        <MyAppShell>
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
        </MyAppShell>
    );
}
