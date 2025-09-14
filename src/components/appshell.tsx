"use client";

import { AppShell, Burger, Group, Text, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./MobileNavbar.module.css";
import Link from "next/link";

function Buttons() {
    return (
        <>
            <UnstyledButton className={classes.control} component={Link} href="/songs">
                曲一覧
            </UnstyledButton>
        </>
    );
}

export default function MyAppShell({ children }: { children: React.ReactNode }) {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: "sm", collapsed: { desktop: true, mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <Group justify="space-between" style={{ flex: 1 }}>
                        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
                            <h3 style={{ margin: 0 }}>MIMIさん全曲紹介</h3>
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

            <AppShell.Main>{children}</AppShell.Main>

            <AppShell.Footer p="md">
                <Text size="xs">
                    製作: <Link href="https://x.com/takechi_scratch">takechi</Link>
                </Text>
            </AppShell.Footer>
        </AppShell>
    );
}
