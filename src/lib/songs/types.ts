export type Song = {
    id: string;
    title: string;
    publishedTimestamp: number;
    isPublishedInOriginalChannel: boolean;
    durationSeconds: number;
    thumbnailURL: string;
    vocal: string;
    illustrations: string;
    movie: string;
    bpm: number;
    mainKey: number;
    chordRate6451: number;
    chordRate4561: number;
    mainChord: string;
    pianoRate: number;
    modulationTimes: number;
    comment: string;
};

export type SongWithScore = {
    id: string;
    song: Song;
    score: number;
};

export const hasScore = (item: Song | SongWithScore): item is SongWithScore => {
    return !!(item as SongWithScore)?.score;
};
