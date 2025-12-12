"use client";

import MyAppShell from "@/components/appshell";
import { useAuth } from "@/contexts/AuthContext";
import { getCurrentUserToken, loginWithProvider, logout } from "@/lib/auth/firebase";
import { Title, Button, Alert, Text, Anchor } from "@mantine/core";
import { GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation";
import { IconInfoCircle, IconUserFilled } from "@tabler/icons-react";
import Link from "next/link";
import GoogleSignInButton from "@/components/signIn/google";
import { notifications } from "@mantine/notifications";

export default function LoginPage() {
    const router = useRouter();
    const { user } = useAuth();
    const googleProvider = new GoogleAuthProvider();

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

            {!user ? (
                <>
                    <GoogleSignInButton
                        style={{ marginBottom: 12 }}
                        onClick={async () => {
                            const user = await loginWithProvider(googleProvider);
                            console.log("ログイン成功");
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
                    <Anchor component={Link} href="/login/examining" mt="lg">
                        <Text size="sm">監査用アカウントでログイン</Text>
                    </Anchor>
                </>
            ) : (
                <>
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
        </MyAppShell>
    );
}
