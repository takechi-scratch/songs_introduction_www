"use client";

import { AdvancedSearch } from "@/app/search/page";
import {
    AppShell,
    AppShellAside,
    ScrollArea,
    AppShellMain,
    Text,
    Group,
    Anchor,
} from "@mantine/core";
import { Suspense } from "react";
import SearchBar from "./searchBar";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import Link from "next/link";

// childrenではサーバー側で曲が取得され、actionsに渡される
export default function SearchShell({ children }: { children: React.ReactNode }) {
    const isLargeScreen = useMediaQuery("(min-width: 48em)");
    const [advancedSearchOpened, { toggle: toggleOpened }] = useDisclosure();

    return (
        <>
            <Suspense fallback={<Text>検索条件を読み込み中...</Text>}>
                <SearchBar
                    isLargeScreen={isLargeScreen}
                    advancedSearchOpened={advancedSearchOpened}
                    toggleAdvancedSearch={toggleOpened}
                />
            </Suspense>
            <AppShell
                mode="static"
                header={{ height: 0 }}
                aside={{
                    width: 400,
                    breakpoint: "sm",
                    collapsed: { mobile: true, desktop: !advancedSearchOpened },
                }}
                transitionDuration={300}
                transitionTimingFunction="ease"
            >
                <AppShellAside
                    p="md"
                    style={{ zIndex: 0 }}
                    display={isLargeScreen ? undefined : "none"}
                >
                    <Group gap="md" mb="md" align="center">
                        <Text size="lg" fw={700}>
                            詳細検索
                        </Text>
                        <Anchor component={Link} href="/search" style={{ marginLeft: "auto" }}>
                            全画面で見る
                        </Anchor>
                    </Group>
                    <ScrollArea h="calc(100vh - 200px)">
                        <AdvancedSearch />
                    </ScrollArea>
                </AppShellAside>
                <AppShellMain>
                    <Suspense fallback={<Text>曲の情報を読み込み中...</Text>}>{children}</Suspense>
                </AppShellMain>
            </AppShell>
        </>
    );
}
