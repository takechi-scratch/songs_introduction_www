import MyAppShell from "@/components/appshell/myAppshell";
import { Title } from "@mantine/core";
import { Metadata, ResolvingMetadata } from "next";
import CollectionsList from "./list";

// parentを受け取るだけなら関数にするべきではない？
export async function generateMetadata(parent: ResolvingMetadata): Promise<Metadata> {
    const parentMetadata = await parent;

    const title = "コレクション";
    const description = "MIMIさんの曲をテーマごとにまとめて紹介しています。";

    return {
        title,
        description,
        openGraph: {
            ...parentMetadata.openGraph,
            title: title,
            description: description,
        },
        twitter: {
            ...parentMetadata.twitter,
            title: title,
            description: description,
        },
    };
}

export default function Page() {
    return (
        <MyAppShell>
            <Title order={2} mb="md">
                コレクション一覧
            </Title>
            <CollectionsList />
        </MyAppShell>
    );
}
