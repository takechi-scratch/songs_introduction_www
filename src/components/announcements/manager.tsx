"use client";

import { data } from "./data";
import { showNotification } from "@mantine/notifications";
import MantineMarkdown from "@/components/markdown";
import { Alert, Paper, Stack } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

// 必ずuseEffect内で呼び出す！
export function noticeActiveAnnouncements() {
    const currentTimeStamp = Math.floor(Date.now() / 1000);
    const isDev = process.env.NEXT_PUBLIC_IS_DEVELOPMENT === "true";

    const rawShownAnnouncements = localStorage.getItem("shown_announcements") || "[]";
    let shownAnnouncements: string[] = [];
    try {
        const parsed = JSON.parse(rawShownAnnouncements);
        shownAnnouncements = Array.isArray(parsed)
            ? parsed.filter((item): item is string => typeof item === "string")
            : [];
    } catch {
        shownAnnouncements = [];
    }

    data.sort((a, b) => {
        if (a.pinnedToTop && !b.pinnedToTop) return -1;
        if (!a.pinnedToTop && b.pinnedToTop) return 1;
        return b.expiresDate - a.expiresDate;
    });

    data.forEach((announcement) => {
        if (announcement.onlyInDev && !isDev) {
            return;
        }

        if (
            announcement.expiresDate > currentTimeStamp &&
            !shownAnnouncements.includes(announcement.id)
        ) {
            showNotification({
                title: announcement.title,
                message: <MantineMarkdown text={announcement.content} textSize="sm" />,
                ...(announcement.notificationProps ?? {}),
            });
            shownAnnouncements.push(announcement.id);
        }
    });

    localStorage.setItem("shown_announcements", JSON.stringify(shownAnnouncements));
}

export function resetShownAnnouncements() {
    localStorage.removeItem("shown_announcements");
}

export function PinnedAnnouncements() {
    const currentTimeStamp = Math.floor(Date.now() / 1000);

    const pinnedAnnouncements = data.filter(
        (announcement) =>
            announcement.pinnedToTop &&
            announcement.expiresDate > currentTimeStamp &&
            (!announcement.onlyInDev || process.env.NEXT_PUBLIC_IS_DEVELOPMENT === "true")
    );

    return (
        <Paper withBorder p="xs" mb="md" radius="md">
            <Stack gap="md">
                {pinnedAnnouncements.map((announcement) => (
                    <Alert
                        key={announcement.id}
                        title={announcement.title}
                        icon={<IconInfoCircle />}
                        {...announcement.alertProps}
                    >
                        <MantineMarkdown text={announcement.content} textSize="sm" />
                    </Alert>
                ))}
            </Stack>
        </Paper>
    );
}
