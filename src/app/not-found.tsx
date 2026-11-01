import MyAppShell from "@/components/appshell/myAppshell";
import { Text, Title } from "@mantine/core";
import Link from "next/link";

export default function NotFound() {
    return (
        <MyAppShell>
            <Title order={1} mb="lg">
                404
            </Title>
            <Text mb="md">指定されたページが見つかりません。</Text>
            <Link href="/">ホームに戻る</Link>
        </MyAppShell>
    );
}
