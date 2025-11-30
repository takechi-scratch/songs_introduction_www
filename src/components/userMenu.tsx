"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/auth";
import { logout } from "@/lib/auth/firebase";
import { Menu } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
    IconDatabasePlus,
    IconLogin,
    IconUserFilled,
    IconUserCheck,
    IconLogout,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export default function UserMenu() {
    const { user } = useAuth();
    const userRole = useUserRole();

    let userImage;
    if (user === null) {
        userImage = <IconUserFilled color="#868e96" width={32} height={32} />;
    } else if (user?.photoURL === null) {
        userImage = <IconUserCheck color="#1c79d6" width={32} height={32} />;
    } else {
        userImage = (
            <Image
                src={user.photoURL}
                alt={"ユーザーアイコン"}
                width={32}
                height={32}
                style={{ borderRadius: "50%" }}
            />
        );
    }

    return (
        <Menu shadow="md" width={250}>
            <Menu.Target>{userImage}</Menu.Target>

            <Menu.Dropdown>
                <Menu.Item>{user ? `${user.email} (${userRole})` : "未ログイン"}</Menu.Item>

                {user && userRole !== "user" && (
                    <>
                        <Menu.Divider />
                        <Menu.Label>編集者用</Menu.Label>
                        <Menu.Item
                            href="/songs/edit/"
                            component={Link}
                            leftSection={<IconDatabasePlus size={14} />}
                        >
                            曲を追加
                        </Menu.Item>
                    </>
                )}

                <Menu.Divider />
                <Menu.Label>メニュー</Menu.Label>
                {user ? (
                    <Menu.Item
                        color="red"
                        // component={UnstyledButton}
                        leftSection={<IconLogout size={14} />}
                        onClick={async () => {
                            await logout();
                            notifications.show({
                                title: "ログアウトしました",
                                message: "またのご利用をお待ちしております。",
                            });
                        }}
                    >
                        ログアウト
                    </Menu.Item>
                ) : (
                    <Menu.Item href="/login" component={Link} leftSection={<IconLogin size={14} />}>
                        ログイン
                    </Menu.Item>
                )}
            </Menu.Dropdown>
        </Menu>
    );
}
