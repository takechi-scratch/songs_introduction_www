"use client";

import MyAppShell from "@/components/appshell";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useDocsFile } from "@/hooks/docs";
import { use } from "react";
import Link from "next/link";

// useを使えーって出るときは、引数部分をPromiseで囲む！
export default function DocsPage({ params }: { params: Promise<{ path: string[] }> }) {
    const path = use(params).path;
    const { docs } = useDocsFile(path);

    return (
        <MyAppShell>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
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
                }}
            >
                {docs || "loading..."}
            </ReactMarkdown>
        </MyAppShell>
    );
}
