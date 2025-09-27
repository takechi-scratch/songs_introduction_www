"use client";

import { useState, useEffect } from "react";

export function useDocsFile(path: string[]) {
    const [docs, setDocs] = useState<string | null>(null);

    async function loadDocs(path: string[]) {
        try {
            const response = await fetch(`/docsFiles/${path.join("/")}.md`);

            if (response.status === 404) {
                setDocs("404 | 指定されたファイルが見つかりません");
                return "404 | 指定されたファイルが見つかりません";
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: string = await response.text();
            setDocs(result);
            return result;
        } catch (error) {
            console.error(`Failed to fetch docs ${path.join("/")}:`, error);
            throw error;
        }
    }

    useEffect(() => {
        loadDocs(path);
    }, [path]);

    return { docs, refetch: () => loadDocs(path) };
}
