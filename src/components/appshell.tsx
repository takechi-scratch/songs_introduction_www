"use client";

import { Anchor, AppShell, Badge, Box, em, Flex, Group, Paper, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import Image from "next/image";
import UserMenu from "./userMenu";
import { noticeActiveAnnouncements } from "./announcements/manager";
import { IconPlaylist } from "@tabler/icons-react";
import { useEffect } from "react";
import QuickSearch from "./quickSearch";

function Footer() {
    const isMobile = useMediaQuery(`(max-width: ${em(768)})`);

    return (
        <Flex
            mt="lg"
            mb="xs"
            align="center"
            gap="xs"
            style={{
                backgroundColor: "#e9eef5",
                padding: 8,
                height: isMobile ? 130 : 50,
                borderRadius: 16,
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
        >
            <Flex direction={{ base: "column", sm: "row" }} flex="1" gap={{ base: 1, sm: "sm" }}>
                <Anchor component={Link} href="/docs/terms">
                    <Text size="xs">規約など</Text>
                </Anchor>
                <Anchor component={Link} href="/docs/credits">
                    <Text size="xs">クレジット</Text>
                </Anchor>
                <Anchor component={Link} href="/docs/analysis/guidelines">
                    <Text size="xs">分析ガイドライン</Text>
                </Anchor>
                <Text size="xs" mr="xl">
                    {/* 空白を残すため */}
                    {"製作: "}
                    <Anchor
                        component={Link}
                        href="https://takechi.f5.si/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        takechi
                    </Anchor>
                </Text>
                <Text
                    size="xs"
                    flex="1"
                    mt={{ base: "sm", sm: 0 }}
                    style={{ textAlign: isMobile ? "left" : "right" }}
                >
                    動画データ取得・埋め込みにYouTube APIを使用しています。
                </Text>
            </Flex>
            <Link
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                // style={{ marginLeft: "auto" }}
            >
                <Image
                    src="/assets/yt_logo_rgb_light.png"
                    alt="YouTubeのロゴ"
                    width={180}
                    height={40}
                    // ブランドガイドラインより、高さは最低20px
                    // https://www.youtube.com/intl/ALL_jp//howyoutubeworks/resources/brand-resources/
                    style={{ width: "auto", height: "20px", verticalAlign: "sub" }}
                />
            </Link>
        </Flex>
    );
}

export default function MyAppShell({
    children,
    wrapInPaper,
}: {
    children: React.ReactNode;
    wrapInPaper?: boolean;
}) {
    useEffect(() => {
        noticeActiveAnnouncements();
    }, []);

    return (
        <AppShell
            className="bg-gradient-to-r from-bg-start to-bg-end bg-fixed"
            header={{ height: 60 / 2 + 16 }}
            withBorder={false}
        >
            <AppShell.Header className="z-50 bg-gradient-to-r from-bg-start to-bg-end bg-fixed">
                <Group
                    justify="space-between"
                    mih={60}
                    px="md"
                    py="xs"
                    m="lg"
                    style={{
                        borderRadius: 16,
                        backgroundColor: "white",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Group align="center" justify="space-between" gap="xs" style={{ flex: 1 }}>
                        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
                            <Flex align="center">
                                <Image
                                    src="/icon.svg"
                                    alt="Logo"
                                    width={40}
                                    height={40}
                                    style={{ marginRight: 8 }}
                                />
                                <Text size="lg" fw={700} style={{ margin: 0 }}>
                                    MIMIさん全曲紹介
                                </Text>
                            </Flex>
                        </Link>
                        <Badge color="green">BETA</Badge>
                        {process.env.NEXT_PUBLIC_IS_DEVELOPMENT === "true" && (
                            <Badge color="orange">DEV</Badge>
                        )}
                        <Box style={{ flex: 1 }} />
                        <Flex justify="flex-end" align="center" ml="auto" gap={0} visibleFrom="sm">
                            <Anchor
                                href="/songs"
                                c="green"
                                mr="sm"
                                component={Link}
                                className="flex items-center"
                            >
                                <IconPlaylist />
                            </Anchor>
                            <QuickSearch />
                        </Flex>
                    </Group>
                    <Group>
                        <UserMenu />
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Main pt={80}>
                <Flex direction="column" mt="lg" mr="lg" ml="lg">
                    <div style={{ minHeight: `calc(100vh - 72px - 108px)` }}>
                        {wrapInPaper ? (
                            <Paper
                                p="md"
                                radius="md"
                                style={{
                                    padding: "var(--mantine-spacing-lg)",
                                    flex: 1,
                                }}
                            >
                                {children}
                            </Paper>
                        ) : (
                            children
                        )}
                    </div>
                    <Footer />
                </Flex>
            </AppShell.Main>
        </AppShell>
    );
}
