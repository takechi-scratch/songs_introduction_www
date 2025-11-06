"use client";

import MyAppShell from "@/components/appshell";
import { useDocsFile } from "@/hooks/docs";
import MarkdownDocs from "./markdownDocs";
import { use } from "react";
import React from "react";
import { Button } from "@mantine/core";

// useを使えーって出るときは、引数部分をPromiseで囲む！
export default function DocsPage({ params }: { params: Promise<{ path: string[] }> }) {
    const path = use(params).path;
    const { docs } = useDocsFile(path);

    const githubRepositoryURL = process.env.NEXT_PUBLIC_GITHUB_REPOSITORY_URL;

    return (
        <MyAppShell>
            <MarkdownDocs docs={docs || "loading..."} error={null} />
            <Button
                variant="light"
                color="dark.4"
                component="a"
                target="_blank"
                rel="noopener noreferrer"
                href={`${githubRepositoryURL}/blob/main/public/docsFiles/${path.join("/")}.md`}
                mt="md"
            >
                Githubで変更履歴を確認・修正を提案
            </Button>
        </MyAppShell>
    );
}
