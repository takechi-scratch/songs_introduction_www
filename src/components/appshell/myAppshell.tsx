"use client";

import {
    Anchor,
    AppShell,
    Badge,
    Box,
    Flex,
    getGradient,
    Group,
    Paper,
    Text,
    Tooltip,
    useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import Image from "next/image";
import UserMenu from "./userMenu";
import { noticeActiveAnnouncements } from "../announcements/manager";
import { IconPlaylist } from "@tabler/icons-react";
import { useEffect } from "react";
import QuickSearch from "../quickSearch";
import { useColorMode } from "@/contexts/ThemeContext";
import ColorModeMenu from "./colorModeMenu";
import { ColorThemes, DefaultColorMode } from "@/lib/themes";

function Footer({ computedColorScheme }: { computedColorScheme: "light" | "dark" }) {
    return (
        <Flex
            mt="lg"
            mb="xs"
            align="center"
            gap="xs"
            bg={computedColorScheme === "dark" ? "dark.7" : "blue.0"}
            h={{ base: 130, sm: 50 }}
            style={{
                backgroundColor: "#e9eef5",
                padding: 8,
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
                    visibleFrom="sm"
                    style={{ textAlign: "right" }}
                >
                    動画データ取得・埋め込みにYouTube APIを使用しています。
                </Text>
                <Text
                    size="xs"
                    flex="1"
                    mt={{ base: "sm", sm: 0 }}
                    hiddenFrom="sm"
                    style={{ textAlign: "left" }}
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
                    src={
                        computedColorScheme === "dark"
                            ? "/assets/yt_logo_fullcolor_white_digital.png"
                            : "/assets/yt_logo_fullcolor_almostblack_digital.png"
                    }
                    alt="YouTubeのロゴ"
                    width={180}
                    height={40}
                    // ブランドガイドラインより、高さは最低20px→100pxに変更されたらしい。
                    // TODO: 配置場所の見直し
                    // https://brand.youtube/youtube-logo/
                    style={{ width: "auto", height: "40px", verticalAlign: "sub" }}
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

    const { colorMode, computedColorScheme } = useColorMode();
    const theme = useMantineTheme();

    let bgTheme = ColorThemes[colorMode];
    if (bgTheme.value === "auto") {
        bgTheme = ColorThemes[DefaultColorMode[computedColorScheme]];
    }

    return (
        <AppShell
            bg={getGradient(
                { deg: 90, from: bgTheme.background.start, to: bgTheme.background.end },
                theme
            )}
            header={{ height: 60 / 2 + 16 }}
            withBorder={false}
        >
            <AppShell.Header
                bg={getGradient(
                    { deg: 90, from: bgTheme.background.start, to: bgTheme.background.end },
                    theme
                )}
            >
                <Group
                    justify="space-between"
                    mih={60}
                    px="md"
                    py="xs"
                    m="lg"
                    bg={computedColorScheme === "dark" ? "dark.7" : "white"}
                    style={{
                        borderRadius: 16,
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Group
                        align="center"
                        justify="space-between"
                        gap="xs"
                        mb={0}
                        style={{ flex: 1 }}
                    >
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
                            <QuickSearch />
                            <Tooltip
                                label={<Text size="sm">曲一覧</Text>}
                                withArrow
                                position="bottom"
                                events={{ hover: true, focus: true, touch: true }}
                            >
                                <Anchor
                                    href="/songs"
                                    c="orange.8"
                                    mr="sm"
                                    component={Link}
                                    className="flex items-center"
                                >
                                    <IconPlaylist />
                                </Anchor>
                            </Tooltip>
                            <ColorModeMenu />
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
                    <Footer computedColorScheme={computedColorScheme} />
                </Flex>
            </AppShell.Main>
        </AppShell>
    );
}
