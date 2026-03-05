import { MantineStyleProp, Input } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { easeOut, motion } from "framer-motion";

export default function QuickSearch() {
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div
            initial={{ width: 40 }}
            animate={{ width: isExpanded ? 300 : 40 }}
            transition={{ duration: 0.7, ease: easeOut }}
            style={{ flex: 1 }}
        >
            {isExpanded ? (
                <Input
                    autoFocus
                    placeholder="URL・タイトル・ボーカル名で検索"
                    leftSection={<IconSearch size={18} />}
                    onBlur={() => setIsExpanded(false)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            router.push(
                                `/songs?q=${encodeURIComponent(e.currentTarget.value)}&autoRedirect=1`
                            );
                        }
                    }}
                    ml="sm"
                    mr={0}
                    radius="lg"
                />
            ) : (
                <IconSearch
                    size={18}
                    style={{ cursor: "pointer" }}
                    onClick={() => setIsExpanded(true)}
                />
            )}
        </motion.div>
    );
}
