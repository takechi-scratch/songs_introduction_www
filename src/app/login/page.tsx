"use client";

import MyAppShell from "@/components/appshell/myAppshell";
import { useAuth } from "@/contexts/AuthContext";
import {
    getCurrentUserToken,
    linkAnonymousAccountWithProvider,
    loginWithAnonymous,
    loginWithProvider,
    logout,
} from "@/lib/auth/firebase";
import { Title, Button, Alert, Text, Anchor, Flex, Paper } from "@mantine/core";
import { GoogleAuthProvider, TwitterAuthProvider, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { IconInfoCircle, IconUserFilled, IconUserQuestion } from "@tabler/icons-react";
import Link from "next/link";
import GoogleSignInButton from "@/components/signIn/google";
import { notifications } from "@mantine/notifications";
import { useColorMode } from "@/contexts/ThemeContext";
import Image from "next/image";
import { useUserRole } from "@/hooks/auth";
import { modals } from "@mantine/modals";

export default function LoginPage() {
    const router = useRouter();
    const { user } = useAuth();
    const userRole = useUserRole();
    const { computedColorScheme } = useColorMode();
    const googleProvider = new GoogleAuthProvider();
    const twitterProvider = new TwitterAuthProvider();

    if (process.env.NEXT_PUBLIC_IS_DEVELOPMENT === "true") {
        console.log("現在のUID: " + user?.uid);
        getCurrentUserToken().then((token) => console.log("アクセストークン: " + token));
    }

    function handleLogin(user: User) {
        notifications.show({
            title: "ログインしました",
            color: "green",
            message: `ようこそ、${user.displayName ? user.displayName : user.email}さん！`,
        });
        router.push("/");
    }

    // Googleログインボタンの素材
    // https://developers.google.com/identity/branding-guidelines?hl=ja

    let LoginMenu;
    if (userRole === "guest") {
        LoginMenu = (
            <>
                <Flex align="center" justify="center" direction="row" m="md" gap="md">
                    <GoogleSignInButton
                        onClick={async () => {
                            const user = await loginWithProvider(googleProvider);
                            handleLogin(user);
                        }}
                    />
                    <Button
                        color={computedColorScheme === "dark" ? "gray.2" : "gray"}
                        radius="xl"
                        onClick={async () => {
                            const user = await loginWithProvider(twitterProvider);
                            handleLogin(user);
                        }}
                    >
                        <Image
                            src={
                                computedColorScheme === "dark"
                                    ? "/assets/x-logo-black.png"
                                    : "/assets/x-logo-white.png"
                            }
                            alt="Twitterロゴ"
                            width={20}
                            height={20}
                        />
                        <Text
                            ml="xs"
                            size="sm"
                            fw={700}
                            c={computedColorScheme === "dark" ? "black" : "white"}
                        >
                            Xでログイン
                        </Text>
                    </Button>
                    <Button
                        color={computedColorScheme === "dark" ? "blue" : "blue"}
                        radius="xl"
                        onClick={async () => {
                            await loginWithAnonymous();
                            notifications.show({
                                title: "ゲストアカウントを作成しました",
                                color: "green",
                                message: `再生リスト作成などの一部機能は使えません。\nログインページから、他のアカウントを紐づけられます！`,
                            });
                            router.push("/");
                        }}
                    >
                        <IconUserQuestion color="white" />
                        <Text ml="xs" size="sm" fw={500}>
                            ゲストとしてログイン
                        </Text>
                    </Button>
                    <Anchor component={Link} href="/login/examining">
                        <Text size="sm">監査用アカウントでログイン</Text>
                    </Anchor>
                </Flex>
            </>
        );
    } else if (userRole === "user-temp") {
        LoginMenu = (
            <>
                <Text>現在、ゲストアカウントとして登録されています。</Text>
                <Text>
                    アカウント連携をすることで、コメントなどをそのまま引き継ぐことができます！
                </Text>
                <Flex align="center" justify="center" direction="row" m="md" gap="md">
                    <GoogleSignInButton
                        onClick={async () => {
                            const linkedUser =
                                await linkAnonymousAccountWithProvider(googleProvider);
                            handleLogin(linkedUser);
                        }}
                    />
                    <Button
                        color={computedColorScheme === "dark" ? "gray.2" : "gray"}
                        radius="xl"
                        onClick={async () => {
                            const linkedUser =
                                await linkAnonymousAccountWithProvider(twitterProvider);
                            handleLogin(linkedUser);
                        }}
                    >
                        <Image
                            src={
                                computedColorScheme === "dark"
                                    ? "/assets/x-logo-black.png"
                                    : "/assets/x-logo-white.png"
                            }
                            alt="Twitterロゴ"
                            width={20}
                            height={20}
                        />
                        <Text
                            ml="xs"
                            size="sm"
                            fw={700}
                            c={computedColorScheme === "dark" ? "black" : "white"}
                        >
                            Xでログイン
                        </Text>
                    </Button>
                    <Button
                        color="orange"
                        ml="lg"
                        onClick={() =>
                            modals.openConfirmModal({
                                title: "ゲストアカウントを削除",
                                children:
                                    "投稿したコメントが削除され、元に戻せなくなります。本当に削除しますか？",
                                labels: { confirm: "削除する", cancel: "キャンセル" },
                                confirmProps: { color: "red" },
                                onConfirm: async () => {
                                    await logout();
                                    notifications.show({
                                        title: "ゲストアカウントを削除しました",
                                        message: "またのご利用をお待ちしております。",
                                        color: "green",
                                    });
                                    router.push("/");
                                },
                            })
                        }
                    >
                        ゲストアカウントを削除
                    </Button>
                </Flex>
                <Text mt="lg" size="sm" c="dimmed">
                    連携先のアカウントでログインしたことがある場合、自動で引き継ぐことはできません。
                </Text>
                <Text size="sm" c="dimmed">
                    コメントなどのデータをまとめる処理をいたしますので、
                    <Anchor href="/contact" component={Link}>
                        お問い合わせ
                    </Anchor>
                    からご連絡をお願いいたします。
                </Text>
            </>
        );
    } else if (user) {
        LoginMenu = (
            <>
                <Text>表示名: {user.displayName}</Text>
                <Text>ID: {user.email}</Text>
                <Button
                    color="orange"
                    mt="md"
                    onClick={async () => {
                        await logout();
                        router.push("/");
                    }}
                >
                    ログアウト
                </Button>
            </>
        );
    } else {
        LoginMenu = <Text>ユーザー情報を読み込み中…</Text>;
    }

    return (
        <MyAppShell>
            <Title mb="lg">ログイン</Title>

            <Alert radius="md" mb="lg" icon={<IconUserFilled />}>
                ログインすると、再生リストの作成・コメント（現在開発中）などができるようになります。
            </Alert>

            <Alert color="orange" radius="md" mb="lg" icon={<IconInfoCircle />}>
                ログインする前に、必ず
                <Link href="/docs/terms/">
                    利用規約・プライバシーポリシー・ユーザーデータポリシー
                </Link>
                をご確認ください。
            </Alert>

            <Paper shadow="sm" p="sm">
                {LoginMenu}
            </Paper>
        </MyAppShell>
    );
}
