"use client";

import MyAppShell from "@/components/appshell";
import { useDocsFile } from "@/hooks/docs";
import MarkdownDocs from "./markdownDocs";
import { use } from "react";
import React from "react";

// useを使えーって出るときは、引数部分をPromiseで囲む！
export default function DocsPage({ params }: { params: Promise<{ path: string[] }> }) {
    const path = use(params).path;
    const { docs } = useDocsFile(path);

    return (
        <MyAppShell>
            <MarkdownDocs docs={docs || "loading..."} error={null} />
        </MyAppShell>
    );
}
