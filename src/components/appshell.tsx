"use client";

import {
    AppShell,
    Badge,
    Burger,
    em,
    Flex,
    Group,
    Input,
    MantineStyleProp,
    Text,
    UnstyledButton,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import classes from "./MobileNavbar.module.css";
import Link from "next/link";
import Image from "next/image";
import UserMenu from "./userMenu";
import { noticeActiveAnnouncements } from "./announcements/manager";
import { IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { showNotification } from "@mantine/notifications";

type QuickSearchResult =
    | {
          type: "song";
          id: string;
      }
    | {
          type: "search";
          query: string;
      }
    | null;

function handleSearchInput(input: string): QuickSearchResult {
    // YouTubeのURLから動画IDを抽出、なければ検索キーワードとして返す
    try {
        const url = new URL(input);
        if (url.hostname === "youtu.be") {
            return { type: "song", id: url.pathname.slice(1) };
        } else if (url.hostname === "www.youtube.com" || url.hostname === "youtube.com") {
            if (url.pathname.startsWith("/shorts/")) {
                return { type: "song", id: url.pathname.slice(8) };
            }

            const id = url.searchParams.get("v");
            if (id === null) {
                return null;
            }

            return { type: "song", id: id };
        } else if (
            url.hostname === window.location.hostname &&
            url.pathname.startsWith("/songs/")
        ) {
            const id = url.pathname.split("/")[2];
            if (!id) {
                return null;
            }
            return { type: "song", id: id };
        }
    } catch {
        if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
            return { type: "song", id: input };
        } else {
            return { type: "search", query: input };
        }
    }
    return null;
}

// TODO: 新検索APIに対応。結果が1件のみなら直接曲ページへ遷移
function QuickSearch({ style }: { style?: MantineStyleProp }) {
    const router = useRouter();

    return (
        <Input
            placeholder="URL・タイトル・ボーカル名で検索"
            leftSection={<IconSearch size={16} />}
            style={{ minWidth: 150, maxWidth: 300, ...style }}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    const songID = handleSearchInput(e.currentTarget.value);
                    if (songID === null) {
                        showNotification({
                            title: "URLを解釈できませんでした",
                            message: "YouTubeの動画URL、または動画IDを入力してください。",
                            color: "red",
                        });
                        return;
                    }
                    if (songID.type === "song") {
                        router.push(`/songs/${songID.id}`);
                    } else {
                        router.push(`/songs?q=${encodeURIComponent(songID.query)}`);
                    }
                }
            }}
            ml="sm"
        />
    );
}

function Buttons() {
    return (
        <>
            {/* <UnstyledButton className={classes.control} component={Link} href="/">
                トップ
            </UnstyledButton> */}
            <UnstyledButton className={classes.control} component={Link} href="/songs">
                曲一覧
            </UnstyledButton>
            <UnstyledButton className={classes.control} component={Link} href="/contact">
                お問い合わせ
            </UnstyledButton>
        </>
    );
}

function Footer() {
    const isMobile = useMediaQuery(`(max-width: ${em(768)})`);

    return (
        <Flex
            mt={40}
            align="center"
            gap="xs"
            style={{
                backgroundColor: "#e9eef5",
                padding: 8,
                height: isMobile ? 130 : 50,
            }}
        >
            <Flex direction={{ base: "column", sm: "row" }} flex="1" gap={{ base: 1, sm: "sm" }}>
                <Link href="/docs/terms">
                    <Text size="xs">規約など</Text>
                </Link>
                <Link href="/docs/credits">
                    <Text size="xs">クレジット</Text>
                </Link>
                <Link href="/docs/analysis/guidelines">
                    <Text size="xs">分析ガイドライン</Text>
                </Link>
                <Text size="xs" mr="xl">
                    {/* 空白を残すため */}
                    {"製作: "}
                    <Link href="https://takechi.f5.si/" target="_blank" rel="noopener noreferrer">
                        takechi
                    </Link>
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

export default function MyAppShell({ children }: { children: React.ReactNode }) {
    const [opened, { toggle }] = useDisclosure();

    noticeActiveAnnouncements();

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: "sm",
                collapsed: { desktop: true, mobile: !opened },
            }}
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <Group justify="space-between" style={{ flex: 1 }}>
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
                                {process.env.NEXT_PUBLIC_IS_DEVELOPMENT === "true" && (
                                    <Badge ml="sm" color="orange">
                                        DEV
                                    </Badge>
                                )}
                            </Flex>
                        </Link>
                        <Flex
                            justify="flex-end"
                            align="center"
                            ml="auto"
                            gap={0}
                            visibleFrom="sm"
                            style={{ flex: 1 }}
                        >
                            <Buttons />
                            <QuickSearch style={{ flex: 1 }} />
                        </Flex>
                        <Group>
                            <UserMenu />
                        </Group>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar py="md" px={4}>
                <Buttons />
                <QuickSearch />
            </AppShell.Navbar>

            <AppShell.Main>
                <Flex
                    direction="column"
                    style={{
                        minHeight: `calc(100vh - 60px)`, // ヘッダーの高さを引く
                    }}
                >
                    <div
                        style={{
                            padding: "var(--mantine-spacing-lg)",
                            flex: 1,
                        }}
                    >
                        {children}
                    </div>
                    <Footer />
                </Flex>
            </AppShell.Main>
        </AppShell>
    );
}
