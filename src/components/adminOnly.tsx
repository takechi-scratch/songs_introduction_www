"use client";

import { useUserRole } from "@/hooks/auth";
import { Alert, Anchor } from "@mantine/core";
import { IconShieldLockFilled } from "@tabler/icons-react";
import Link from "next/link";

export default function AdminOnlyComponent({ children }: { children: React.ReactNode }) {
    const userRole = useUserRole();

    if (userRole !== "admin") {
        return (
            <>
                <Alert title="403 Forbidden" color="red" icon={<IconShieldLockFilled />} mb="md">
                    アクセス権限がありません。
                </Alert>
                <Anchor href="/" mb="md" component={Link}>
                    トップページに戻る
                </Anchor>
            </>
        );
    }

    return <>{children}</>;
}
