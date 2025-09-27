export const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat("ja-JP", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Tokyo",
        timeZoneName: "short",
    }).format(date);
};

export const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const formatElapsedSeconds = (seconds: number) => {
    if (seconds < 60) {
        return `1分未満`;
    } else if (seconds < 3600) {
        return `${Math.floor(seconds / 60)}分`;
    } else if (seconds < 86400) {
        return `${Math.floor(seconds / 3600)}時間`;
    } else if (seconds < 86400 * 30) {
        return `${Math.floor(seconds / 86400)}日`;
    } else if (seconds < 86400 * 365) {
        return `${Math.floor(seconds / (86400 * 30))}ヶ月`;
    } else {
        return `${Math.floor(seconds / (86400 * 365))}年`;
    }
};
