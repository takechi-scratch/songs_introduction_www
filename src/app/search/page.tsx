"use client";

import MyAppShell from "@/components/appshell/myAppshell";
import { Text, Title } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { AdvancedSearch } from "@/components/advancedSearch";
import { NextAnchor } from "@/components/nextLink";

function SearchPage() {
    const params = useSearchParams();
    const router = useRouter();

    return <AdvancedSearch params={params} router={router} />;
}

export default function Page() {
    return (
        <MyAppShell wrapInPaper>
            <Title order={2} mb="md">
                詳細検索
            </Title>
            <Suspense fallback={<Text>読み込み中...</Text>}>
                <SearchPage />
            </Suspense>
            <NextAnchor href="/songs/">曲一覧に戻る</NextAnchor>
        </MyAppShell>
    );
}
