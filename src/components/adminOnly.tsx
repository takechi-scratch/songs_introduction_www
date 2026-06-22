"use client";

import { useUserRole } from "@/hooks/auth";
import { Alert } from "@mantine/core";
import { IconShieldLockFilled } from "@tabler/icons-react";
import { NextAnchor } from "./nextLink";

export default function AdminOnlyComponent({ children }: { children: React.ReactNode }) {
    const userRole = useUserRole();

    if (userRole !== "admin") {
        return (
            <>
                <Alert title="403 Forbidden" color="red" icon={<IconShieldLockFilled />} mb="md">
                    アクセス権限がありません。
                </Alert>
                <NextAnchor href="/" mb="md">
                    トップページに戻る
                </NextAnchor>
            </>
        );
    }

    return <>{children}</>;
}
