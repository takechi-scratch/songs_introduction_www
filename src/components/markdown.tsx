"use client";

import { Code, Table, Text } from "@mantine/core";
import Link from "next/link";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

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
                p: ({ children }) => {
                    return (
                        <Text size={textSize ?? "md"} mb="xs">
                            {children}
                        </Text>
                    );
                },
            }}
        >
            {text}
        </ReactMarkdown>
    );
}
