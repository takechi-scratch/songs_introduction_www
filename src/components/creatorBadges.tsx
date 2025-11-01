import { SearchQuery } from "@/lib/search/filter";
import { Badge, BadgeProps } from "@mantine/core";
import Link from "next/link";

export default function CreatorBadges({
    creators,
    searchQueryName,
    ...props
}: {
    creators: string[];
    searchQueryName: keyof SearchQuery;
} & Omit<BadgeProps, "component" | "href" | "children">) {
    return (
        <>
            {creators.map((rawCreator) => {
                const creator = rawCreator.trim();

                return (
                    <Badge
                        mr="sm"
                        tt="none"
                        variant="light"
                        component={Link}
                        href={`/songs?${searchQueryName}=${encodeURIComponent(creator)}`}
                        key={creator}
                        {...props}
                    >
                        {creator}
                    </Badge>
                );
            })}
        </>
    );
}
