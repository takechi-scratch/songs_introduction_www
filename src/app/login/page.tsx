"use client";

import MyAppShell from "@/components/appshell";
import { useAuth } from "@/contexts/AuthContext";
import {
    getCurrentUserToken,
    loginWithAnonymous,
    loginWithProvider,
    logout,
} from "@/lib/auth/firebase";
import { Title, Button, Alert, Text, Anchor, Flex, Paper } from "@mantine/core";
import { GoogleAuthProvider, TwitterAuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation";
import { IconInfoCircle, IconUserFilled, IconUserQuestion } from "@tabler/icons-react";
import Link from "next/link";
import GoogleSignInButton from "@/components/signIn/google";
import { notifications } from "@mantine/notifications";
import { useColorMode } from "@/contexts/ThemeContext";
import Image from "next/image";

export default function LoginPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { computedColorScheme } = useColorMode();
    const googleProvider = new GoogleAuthProvider();
    const twitterProvider = new TwitterAuthProvider();

    if (process.env.NEXT_PUBLIC_IS_DEVELOPMENT === "true") {
        console.log("現在のUID: " + user?.uid);
        getCurrentUserToken().then((token) => console.log("アクセストークン: " + token));
    }

    // Googleログインボタンの素材
    // https://developers.google.com/identity/branding-guidelines?hl=ja

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

            <Paper shadow="sm" p="xs">
                {!user ? (
                    <Flex align="center" justify="center" direction="row" m="md" gap="md">
                        <GoogleSignInButton
                            onClick={async () => {
                                const user = await loginWithProvider(googleProvider);
                                notifications.show({
                                    title: "ログインしました",
                                    color: "green",
                                    message: `ようこそ、${
                                        user.displayName ? user.displayName : user.email
                                    }さん！`,
                                });
                                router.push("/");
                            }}
                        />
                        <Button
                            color={computedColorScheme === "dark" ? "gray.2" : "gray"}
                            radius="xl"
                            onClick={async () => {
                                const user = await loginWithProvider(twitterProvider);
                                notifications.show({
                                    title: "ログインしました",
                                    color: "green",
                                    message: `ようこそ、${
                                        user.displayName ? user.displayName : user.email
                                    }さん！`,
                                });
                                router.push("/");
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
                ) : (
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
                )}
            </Paper>
        </MyAppShell>
    );
}
