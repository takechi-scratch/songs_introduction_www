import MyAppShell from "@/components/appshell";
import { Title, Text } from "@mantine/core";
import Link from "next/link";

// useを使えーって出るときは、引数部分をPromiseで囲む！
export default async function DocsPage() {
    const mailEntity =
        "&#116;&#97;&#107;&#101;&#99;&#104;&#105;&#46;&#115;&#99;&#114;&#97;&#116;&#99;&#104;&#64;&#103;&#109;&#97;&#105;&#108;&#46;&#99;&#111;&#109;";

    return (
        <MyAppShell>
            <Title mb="lg">お問い合わせ</Title>
            <Text mb="md">
                現在お問い合わせフォームは準備中です。ご意見があれば、
                <Link href="/">トップページ</Link>
                のフィードバック、またはX(
                <Link
                    href="https://x.com/takechi_scratch"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    @takechi_scratch
                </Link>
                )のDMまでお願いします。
            </Text>
            <Text>
                ※権利者の方からの削除依頼などについては、公式のメールアドレスを使用して
                <span
                    dangerouslySetInnerHTML={{
                        __html: `<a href="mailto:${mailEntity}">${mailEntity}</a>`,
                    }}
                />
                までご連絡ください。
            </Text>
        </MyAppShell>
    );
}
