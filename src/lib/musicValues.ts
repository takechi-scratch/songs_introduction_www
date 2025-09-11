const noteNames = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];

export const formatOriginalKey = (key: number) => {
    const absKey = Math.abs(key);
    if (absKey < 60 || 72 < absKey) {
        return "不明";
    }
    return `${noteNames[absKey % 12]} ${key > 0 ? "major" : "minor"}`;
};
