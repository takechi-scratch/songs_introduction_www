"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/auth";
import { logout } from "@/lib/auth/firebase";
import { Menu, MenuItem } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
    IconCopyleft,
    IconDatabasePlus,
    IconFileMusic,
    IconLogin,
    IconLogout,
    IconMessageChatbot,
    IconRefresh,
    IconUserCheck,
    IconUserCog,
    IconUserFilled,
    IconUserQuestion,
} from "@tabler/icons-react";
import Image from "next/image";
import { NextLinkedMenuItem } from "../nextLink";
import ColorModeMenu from "./colorModeMenu";

export default function UserMenu() {
    const { user } = useAuth();
    const userRole = useUserRole();

    let userImage;
    if (user === null) {
        userImage = <IconUserFilled color="#868e96" width={32} height={32} />;
    } else if (userRole === "user-temp") {
        userImage = <IconUserQuestion color="#1c79d6" width={32} height={32} />;
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
        <Menu shadow="md" width={250} position="bottom-end" closeOnItemClick={false}>
            <Menu.Target>{userImage}</Menu.Target>

            <Menu.Dropdown>
                <Menu.Item>
                    {user
                        ? `${user.displayName || user.email || user.uid} (${userRole})`
                        : "未ログイン"}
                </Menu.Item>

                {user && (userRole === "editor" || userRole === "admin") && (
                    <>
                        <Menu.Divider />
                        <Menu.Label>編集者用</Menu.Label>
                        <NextLinkedMenuItem
                            href="/songs/edit/"
                            leftSection={<IconDatabasePlus size={14} />}
                        >
                            曲を追加
                        </NextLinkedMenuItem>
                    </>
                )}

                {user && userRole === "admin" && (
                    <>
                        <Menu.Divider />
                        <Menu.Label>管理者用</Menu.Label>
                        <NextLinkedMenuItem
                            href="/admin/lyrics-vector/"
                            leftSection={<IconFileMusic size={14} />}
                        >
                            歌詞ベクトル情報の更新
                        </NextLinkedMenuItem>
                        <NextLinkedMenuItem
                            href="/admin/service-account/"
                            leftSection={<IconUserCog size={14} />}
                        >
                            専用アカウントの管理
                        </NextLinkedMenuItem>
                        <NextLinkedMenuItem
                            href="/admin/revalidate/"
                            leftSection={<IconRefresh size={14} />}
                        >
                            キャッシュの再生成
                        </NextLinkedMenuItem>
                    </>
                )}

                <Menu.Divider />
                <Menu.Label>メニュー</Menu.Label>
                {userRole === "guest" && (
                    <NextLinkedMenuItem href="/login" leftSection={<IconLogin size={14} />}>
                        ログイン
                    </NextLinkedMenuItem>
                )}
                {userRole === "user-temp" && (
                    <NextLinkedMenuItem href="/login" leftSection={<IconLogin size={14} />}>
                        アカウント連携
                    </NextLinkedMenuItem>
                )}
                {userRole !== "guest" && userRole !== "user-temp" && (
                    <>
                        <NextLinkedMenuItem
                            href="/settings"
                            leftSection={<IconUserCog size={14} />}
                        >
                            ユーザー設定
                        </NextLinkedMenuItem>
                        <MenuItem
                            color="red"
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
                        </MenuItem>
                    </>
                )}
                <NextLinkedMenuItem href="/contact" leftSection={<IconMessageChatbot size={14} />}>
                    お問い合わせ・機能提案
                </NextLinkedMenuItem>
                <NextLinkedMenuItem href="/docs/credits" leftSection={<IconCopyleft size={14} />}>
                    クレジット
                </NextLinkedMenuItem>
                <ColorModeMenu submenu />
            </Menu.Dropdown>
        </Menu>
    );
}
