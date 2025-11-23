"use client";

import MyAppShell from "@/components/appshell";
import { loginWithEmailAndPassword } from "@/lib/auth/firebase";
import { TextInput, PasswordInput, Button, Title, Alert, Anchor, Divider } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    return (
        <MyAppShell>
            <Title mb="md">ログイン（監査用アカウント）</Title>
            <Alert variant="light" color="red" radius="md" mb="lg" icon={<IconAlertTriangle />}>
                一般ユーザーは使用しないでください。また、アカウントの作成はできません。
            </Alert>

            <TextInput
                mb="sm"
                label="メールアドレス"
                placeholder="test@example.com"
                required
                onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <PasswordInput
                mb="md"
                label="パスワード"
                placeholder="password"
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

            <Divider my="lg" />

            <Anchor component={Link} href="/login">
                戻る
            </Anchor>
        </MyAppShell>
    );
}
