"use client";

import { data } from "./data";
import { showNotification } from "@mantine/notifications";
import MantineMarkdown from "@/components/markdown";
import { Alert } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

export function noticeActiveAnnouncements() {
    const currentTimeStamp = Math.floor(Date.now() / 1000);
    const isDev = process.env.NEXT_PUBLIC_IS_DEVELOPMENT === "true";

    if (typeof window === "undefined") {
        return;
    }

    const rawShownAnnouncements = localStorage.getItem("shown_announcements") || "[]";
    const shownAnnouncements: string[] = JSON.parse(rawShownAnnouncements);

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
                message: <MantineMarkdown docs={announcement.content} />,
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
        <>
            {pinnedAnnouncements.map((announcement) => (
                <Alert
                    key={announcement.id}
                    title={announcement.title}
                    icon={<IconInfoCircle />}
                    mb="md"
                    {...announcement.alertProps}
                >
                    <MantineMarkdown docs={announcement.content} />
                </Alert>
            ))}
        </>
    );
}
