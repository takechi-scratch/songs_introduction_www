import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/auth";
import { Menu } from "@mantine/core";
import { IconDatabasePlus, IconLogin, IconUserFilled } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export default function UserMenu() {
    const { user } = useAuth();
    const userRole = useUserRole();

    return (
        <Menu shadow="md" width={250}>
            <Menu.Target>
                {user?.photoURL ? (
                    <Image
                        src={user?.photoURL}
                        alt={"ユーザーアイコン"}
                        width={32}
                        height={32}
                        style={{ borderRadius: "50%" }}
                    />
                ) : (
                    <IconUserFilled color="#868e96" width={32} height={32} />
                )}
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Item>{user ? `${user.email} (${userRole})` : "未ログイン"}</Menu.Item>
                <Menu.Divider />
                <Menu.Label>メニュー</Menu.Label>
                <Menu.Item href="/login" component={Link} leftSection={<IconLogin size={14} />}>
                    ログイン
                </Menu.Item>
                {user && userRole !== "user" && (
                    <>
                        <Menu.Divider />
                        <Menu.Label>編集者用</Menu.Label>
                        <Menu.Item
                            href="/edit_songs/"
                            component={Link}
                            leftSection={<IconDatabasePlus size={14} />}
                        >
                            曲を追加
                        </Menu.Item>
                    </>
                )}
            </Menu.Dropdown>
        </Menu>
    );
}
