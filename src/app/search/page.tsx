"use client";

import MyAppShell from "@/components/appshell";
import { Title, Text, Anchor } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import Link from "next/link";
import { AdvancedSearch } from "@/components/advancedSearch";

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
            <Anchor component={Link} href="/songs/">
                曲一覧に戻る
            </Anchor>
        </MyAppShell>
    );
}
