import MyAppShell from "@/components/appshell";
import KoeLoopWidget from "@/components/feedbackWidget";
import { Title, Text } from "@mantine/core";
import { List, ListItem } from "@mantine/core";
import Link from "next/link";

// useを使えーって出るときは、引数部分をPromiseで囲む！
export default async function DocsPage() {
    const mailEntity =
        "&#116;&#97;&#107;&#101;&#99;&#104;&#105;&#46;&#115;&#99;&#114;&#97;&#116;&#99;&#104;&#64;&#103;&#109;&#97;&#105;&#108;&#46;&#99;&#111;&#109;";

    return (
        <MyAppShell>
            <Title mb="lg">お問い合わせ</Title>
            <Text>現在お問い合わせフォームは準備中です。</Text>
            <Text mb="lg">
                ご意見があれば、以下のフィードバックフォーム、もしくはX(
                <Link
                    href="https://x.com/takechi_scratch"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    @takechi_scratch
                </Link>
                )のDMまでお願いします。
            </Text>
            <Text mb="sm">
                ※お問い合わせ内容が以下にあてはまる場合は、
                <span
                    dangerouslySetInnerHTML={{
                        __html: `<a href="mailto:${mailEntity}">${mailEntity}</a>`,
                    }}
                />
                までご連絡ください。
            </Text>
            <List mb="lg">
                <ListItem>
                    権利者の方からの削除依頼（公式のメールアドレスを使用してご連絡ください）
                </ListItem>
                <ListItem>
                    <Link href="/docs/terms/privacy/">プライバシーポリシー</Link>
                    に基づく、個人情報の開示・訂正・削除の請求
                </ListItem>
            </List>

            <KoeLoopWidget />
        </MyAppShell>
    );
}
