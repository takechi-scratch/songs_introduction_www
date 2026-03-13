import { Blockquote, Image, Text } from "@mantine/core";
import MantineMarkdown from "./markdown";
import Avatar from "boring-avatars";

const names = [
    "Mary Baker",
    "Amelia Earhart",
    "Mary Roebling",
    "Sarah Winnemucca",
    "Margaret Brent",
    "Lucy Stone",
    "Mary Edwards",
    "Margaret Chase",
    "Mahalia Jackson",
    "Maya Angelou",
];

const colorTypes = [
    ["#0a0310", "#49007e", "#ff005b", "#ff7d10", "#ffb238"],
    ["#b1e6d1", "#77b1a9", "#3d7b80", "#270a33", "#451a3e"],
    ["#fff4ce", "#d0deb8", "#ffa492", "#ff7f81", "#ff5c71"],
];

export function randomIdenticon(name: string) {
    const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);

    const colorType = colorTypes[hash % colorTypes.length];
    const iconName = names[hash % names.length];

    return <Avatar name={iconName} colors={colorType} variant="beam" size={40} />;
}

export function Comment({
    text,
    author,
    iconURL,
}: {
    text: string;
    author: string;
    iconURL?: string;
}) {
    return (
        <Blockquote
            color="blue"
            mx="md"
            mb="xl"
            icon={iconURL ? <Image src={iconURL} alt="Icon" /> : randomIdenticon(author)}
            style={{ maxWidth: 500 }}
            iconSize={40}
        >
            <MantineMarkdown text={text} />

            <Text size="sm" opacity={0.6} mt="sm">
                — {author}
            </Text>
        </Blockquote>
    );
}
