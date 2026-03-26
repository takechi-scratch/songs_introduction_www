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

const displayNames = ["うさぎ", "フランスパン", "ラベンダー", "ハート", "紅茶", "桜"];

export default function randomContents(name: string) {
    const hash = Array.from(name).reduce(
        (acc, char, i) => acc + char.charCodeAt(0) * (i + 1),
        3131
    );

    const colorType = colorTypes[hash % colorTypes.length];
    const iconName = names[hash % names.length];

    return {
        icon: <Avatar name={iconName} colors={colorType} variant="beam" size={40} />,
        displayName: displayNames[hash % displayNames.length],
    };
}
