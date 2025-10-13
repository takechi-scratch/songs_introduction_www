import MyAppShell from "@/components/appshell";
import { fetchDocsFile } from "@/lib/docs";
import MarkdownDocs from "./markdownDocs";
import { Metadata } from "next";

export const generateMetadata = async ({
    params,
}: {
    params: Promise<{ path: string[] }>;
}): Promise<Metadata> => {
    // ブログの詳細データを取得する関数
    const path = (await params).path;
    let docs = "";
    try {
        docs = await fetchDocsFile(path);
    } catch {
        return {
            title: "エラー | MIMIさん全曲分析",
            description: "ドキュメントの取得中にエラーが発生しました。",
        };
    }

    const splitDocs = docs.split("\n");
    const firstHeading = splitDocs[0].replace("# ", "").slice(0, 60);

    const title = `${firstHeading} | MIMIさん全曲分析`;
    const description = splitDocs.slice(1).join("\n").slice(0, 100);

    return {
        title: title,
        description: description,
        openGraph: {
            title: firstHeading,
            description: description,
            siteName: "MIMIさん全曲分析",
            locale: "ja_JP",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: title,
            description: description,
        },
    };
};

// サーバー側でファイルを取得し、クライアント側でレンダリング
export default async function DocsPage({ params }: { params: Promise<{ path: string[] }> }) {
    const path = (await params).path;

    let docs = "";
    let error = null;
    try {
        docs = await fetchDocsFile(path);
    } catch (e) {
        error = e instanceof Error ? e.message : String(e);
    }
    return (
        <MyAppShell>
            <MarkdownDocs docs={docs} error={error} />
        </MyAppShell>
    );
}
