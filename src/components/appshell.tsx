"use client";

import { AppShell, Badge, Burger, em, Flex, Group, Text, UnstyledButton } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import classes from "./MobileNavbar.module.css";
import Link from "next/link";
import Image from "next/image";

function Buttons() {
    return (
        <>
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
                backgroundColor: "#f0f0f0",
                padding: 8,
                height: isMobile ? 130 : 50,
            }}
        >
            <Flex direction={{ base: "column", sm: "row" }} flex="1" gap={{ base: 1, sm: "sm" }}>
                <Link href="/docs/terms">
                    <Text size="xs">利用規約</Text>
                </Link>
                <Link href="/docs/credits">
                    <Text size="xs">クレジット</Text>
                </Link>
                <Link href="/docs/analysis/guidelines">
                    <Text size="xs">分析ガイドライン</Text>
                </Link>
                <Text size="xs" mr="xl">
                    製作:
                    <Link
                        href="https://x.com/takechi_scratch"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        takechi
                    </Link>
                </Text>
                <Text
                    size="xs"
                    flex="1"
                    mt={{ base: "sm", sm: 0 }}
                    style={{ textAlign: isMobile ? "left" : "right" }}
                >
                    動画データ取得・埋め込みにYoutube APIを使用しています。
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
                    width={0}
                    height={0}
                    style={{ width: "auto", height: "20px", verticalAlign: "sub" }}
                />
            </Link>
        </Flex>
    );
}

export default function MyAppShell({ children }: { children: React.ReactNode }) {
    const [opened, { toggle }] = useDisclosure();

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
                                <h3 style={{ margin: 0 }}>
                                    MIMIさん全曲紹介
                                    {process.env.NEXT_PUBLIC_IS_DEVELOPMENT === "true" && (
                                        <Badge ml="md" color="orange">
                                            Dev
                                        </Badge>
                                    )}
                                </h3>
                            </Flex>
                        </Link>
                        <Group ml="xl" gap={0} visibleFrom="sm">
                            <Buttons />
                        </Group>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar py="md" px={4}>
                <Buttons />
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
