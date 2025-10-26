"use client";

import MyAppShell from "@/components/appshell";
import { useAuth } from "@/contexts/AuthContext";
import {
    getCurrentUserToken,
    loginWithEmailAndPassword,
    loginWithProvider,
    logout,
} from "@/lib/auth";
import { Title, TextInput, PasswordInput, Button, Alert, Text } from "@mantine/core";
import { GoogleAuthProvider } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconAlertTriangle } from "@tabler/icons-react";

// 将来的には表示させる
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function LoginWithEmailForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    return (
        <>
            <TextInput
                label="メールアドレス"
                placeholder="あなたのメールアドレス"
                required
                onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <PasswordInput
                label="パスワード"
                placeholder="あなたのパスワード"
                required
                onChange={(e) => {
                    setPassword(e.currentTarget.value);
                }}
            />
            <Button
                mb="md"
                type="submit"
                loading={loading}
                onClick={async () => {
                    setLoading(true);
                    await loginWithEmailAndPassword(email, password);
                    console.log("ログイン成功");
                    router.push("/");
                }}
            >
                ログイン
            </Button>
        </>
    );
}

// useを使えーって出るときは、引数部分をPromiseで囲む！
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
                <Image
                    src="/assets/auth/google.svg"
                    alt="Googleでログインのボタン"
                    width={200}
                    height={50}
                    onClick={async () => {
                        // setLoading(true);
                        await loginWithProvider(googleProvider);
                        console.log("ログイン成功");
                        router.push("/");
                    }}
                    style={{ margin: 12 }}
                />
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
