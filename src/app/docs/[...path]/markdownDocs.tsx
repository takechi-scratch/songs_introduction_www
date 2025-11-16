import { Alert } from "@mantine/core";
import { IconExclamationCircle } from "@tabler/icons-react";
import MantineMarkdown from "@/components/markdown";

export default function MarkdownDocs({ docs, error }: { docs: string; error: string | null }) {
    if (error) {
        return (
            <Alert
                variant="light"
                color="red"
                radius="md"
                mb="lg"
                title="取得エラー"
                icon={<IconExclamationCircle />}
            >
                {error}
            </Alert>
        );
    }

    return <MantineMarkdown docs={docs} />;
}
