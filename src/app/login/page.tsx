"use client";

import MyAppShell from "@/components/appshell";
import { useAuth } from "@/contexts/AuthContext";
import { getCurrentUserToken, loginWithProvider, logout } from "@/lib/auth/firebase";
import { Title, Button, Alert, Text, Anchor } from "@mantine/core";
import { GoogleAuthProvider } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IconAlertTriangle } from "@tabler/icons-react";
import Link from "next/link";

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

            <Alert variant="light" color="orange" radius="md" mb="lg" icon={<IconAlertTriangle />}>
                ログイン機能は現在管理者向けに作成されており、利用できる機能はありません。
            </Alert>

            {!user ? (
                <>
                    <Image
                        src="/assets/auth/google.svg"
                        alt="Googleでログインのボタン"
                        width={200}
                        height={50}
                        onClick={async () => {
                            await loginWithProvider(googleProvider);
                            console.log("ログイン成功");
                            router.push("/");
                        }}
                        style={{ margin: 12 }}
                    />
                    <Anchor component={Link} href="/login/examining">
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
