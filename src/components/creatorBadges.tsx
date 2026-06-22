import { SearchQuery } from "@/lib/search/filter";
import { BadgeProps } from "@mantine/core";
import { NextLinkedBadge } from "./nextLink";

export default function CreatorBadges({
    creators,
    searchQueryName,
    ...props
}: {
    creators: string[];
    searchQueryName: keyof SearchQuery;
} & Omit<BadgeProps, "component" | "href" | "children">) {
    if (creators.length === 0) {
        return "-";
    }

    return (
        <>
            {creators.map((rawCreator) => {
                const creator = rawCreator.trim();

                return (
                    <NextLinkedBadge
                        mr="sm"
                        tt="none"
                        variant="light"
                        href={`/songs/?params=filter:(${searchQueryName}:'"${encodeURIComponent(
                            creator
                        )}"')`}
                        key={creator}
                        {...props}
                        style={{ cursor: "pointer" }}
                    >
                        {creator}
                    </NextLinkedBadge>
                );
            })}
        </>
    );
}
