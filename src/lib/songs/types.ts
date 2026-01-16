export interface Song {
    id: string;
    title: string;
    publishedTimestamp: number;
    publishedType: number;
    durationSeconds: number | null;
    thumbnailURL: string | null;
    vocal: string[] | null;
    illustrations: string[] | null;
    movie: string[] | null;
    bpm: number | null;
    mainKey: number | null;
    chordRate6451: number | null;
    chordRate4561: number | null;
    mainChord: string | null;
    pianoRate: number | null;
    modulationTimes: number | null;
    lyricsVector: number[] | null;
    lyricsOfficiallyReleased: boolean;
    comment: string | null;
}

export interface SongWithScore {
    id: string;
    song: Song;
    score: number;
}

export const hasScore = (item: Song | SongWithScore): item is SongWithScore => {
    return !!(item as SongWithScore)?.score;
};

export interface UpsertSong {
    id: string;
    title?: string;
    publishedTimestamp?: number;
    publishedType?: number;
    durationSeconds?: number;
    thumbnailURL?: string;
    vocal: string[];
    illustrations: string[];
    movie: string[];
    bpm: number;
    mainKey: number;
    chordRate6451: number;
    chordRate4561: number;
    mainChord: string;
    pianoRate: number;
    modulationTimes: number;
    lyricsVector?: number[];
    lyricsOfficiallyReleased: boolean;
    comment: string;
}

export interface UpsertLyricsVec {
    id: string;
    lyricsVector: number[];
    lyricsOfficiallyReleased: boolean;
}
