"use client";

import { Button, Flex, Group, Text, TextInput } from "@mantine/core";
import { useHotkeys, useMediaQuery } from "@mantine/hooks";
import { IconListSearch } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

import rison from "rison";

export default function SearchBar() {
    const params = useSearchParams();
    const isLargeScreen = useMediaQuery("(min-width: 48em)");

    const searchInputRef = useRef<HTMLInputElement>(null);
    useHotkeys([
        ["mod + K", () => searchInputRef.current?.focus()],
        ["mod + /", () => searchInputRef.current?.focus()],
        ["mod + F", () => searchInputRef.current?.focus()],
    ]);

    const [searchQuery, setSearchQuery] = useState(() => {
        if (params.get("params") !== null) {
            try {
                rison.decode_object(params.get("params") || "");
                return "?" + params.get("params") || "";
            } catch (e) {
                console.warn("Failed to decode search params from URL. Error:", e);
            }
        } else if (params.get("q") !== null) {
            return params.get("q") || "";
        }
        return "";
    });
    const router = useRouter();

    function handleSearch() {
        if (searchQuery.trim() === "") {
            router.push("/songs/", { scroll: false });
        } else if (searchQuery.trim().startsWith("?")) {
            router.push("/songs/?params=" + searchQuery.trim().slice(1), { scroll: false });
        } else {
            router.push("/songs/?q=" + encodeURIComponent(searchQuery.trim()), { scroll: false });
        }
    }

    function handleAdvancedSearchLink() {
        if (searchQuery.trim() === "") {
            router.push("/search/");
        } else if (searchQuery.trim().startsWith("?")) {
            router.push("/search/?params=" + searchQuery.trim().slice(1));
        } else {
            router.push("/search/?params=q:'" + encodeURIComponent(searchQuery.trim()) + "'");
        }
    }

    return (
        <Flex m="md" gap="md" direction={{ base: "column", sm: "row" }}>
            <TextInput
                placeholder="URL・タイトル・ボーカル名などで検索"
                ref={searchInputRef}
                size="md"
                radius="md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSearch();
                    } else if (e.key === "Escape") {
                        searchInputRef.current?.blur();
                    }
                }}
                flex={1}
            />
            <Group gap="md" grow={!isLargeScreen}>
                <Button size="md" radius="md" onClick={handleSearch}>
                    検索
                </Button>
                <Button variant="light" size="md" radius="md" onClick={handleAdvancedSearchLink}>
                    <Group gap="xs" wrap="nowrap">
                        <IconListSearch size={20} />
                        <Text size="sm" fw={700}>
                            詳しく
                        </Text>
                    </Group>
                </Button>
            </Group>
        </Flex>
    );
}
