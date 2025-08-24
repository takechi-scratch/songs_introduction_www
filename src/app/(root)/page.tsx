"use client";

import { AppShell, Burger, Group, UnstyledButton } from "@mantine/core";
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

export default function HomePage() {
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
                        Header
                        <Group ml="xl" gap={0} visibleFrom="sm">
                            <Buttons />
                        </Group>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar py="md" px={4}>
                <Buttons />
            </AppShell.Navbar>

            <AppShell.Main>ホーム</AppShell.Main>
        </AppShell>
    );
}
