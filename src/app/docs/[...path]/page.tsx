"use client";

import MyAppShell from "@/components/appshell";
import { useDocsFile } from "@/hooks/docs";
import MarkdownDocs from "./markdownDocs";
import { use } from "react";
import React from "react";
import { Button, Skeleton } from "@mantine/core";

// useを使えーって出るときは、引数部分をPromiseで囲む！
export default function DocsPage({ params }: { params: Promise<{ path: string[] }> }) {
    const path = use(params).path;
    const { docs } = useDocsFile(path);

    const GitHubRepositoryURL = process.env.NEXT_PUBLIC_GITHUB_REPOSITORY_URL;

    return (
        <MyAppShell>
            {docs ? (
                <MarkdownDocs docs={docs || "loading..."} error={null} />
            ) : (
                <>
                    <Skeleton height={48} width="40%" radius="lg" mt="lg" />
                    <Skeleton height={16} mt="xl" radius="lg" />
                    <Skeleton height={16} mt="xs" radius="lg" />
                </>
            )}

            <Button
                variant="light"
                color="dark.4"
                component="a"
                target="_blank"
                rel="noopener noreferrer"
                href={`${GitHubRepositoryURL}/blob/main/public/docsFiles/${path.join("/")}.md`}
                mt="md"
            >
                GitHubで変更履歴を確認・修正を提案
            </Button>
        </MyAppShell>
    );
}
