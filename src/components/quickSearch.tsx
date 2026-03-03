import { MantineStyleProp, Input } from "@mantine/core";
import { useFocusWithin } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function QuickSearch({ style }: { style?: MantineStyleProp }) {
    const router = useRouter();
    const { ref, focused } = useFocusWithin();

    const transition = {
        duration: 0.8,
        delay: 0.5,
    };

    return (
        <Input
            ref={ref}
            placeholder="URL・タイトル・ボーカル名で検索"
            leftSection={<IconSearch size={16} />}
            style={{ minWidth: 150, maxWidth: 300, ...style }}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    router.push(
                        `/songs?q=${encodeURIComponent(e.currentTarget.value)}&autoRedirect=1`
                    );
                }
            }}
            ml="sm"
            radius="lg"
            w="100%"
        />
    );
}
