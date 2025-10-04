import { Song } from "../songs/types";

type specifiableParam = {
    displayName: string;
    key: keyof Song;
    default: number;
};

export const specifiableParams: specifiableParam[] = [
    { displayName: "ボーカル", key: "vocal", default: 0.8 },
    { displayName: "イラスト等", key: "illustrations", default: 1 },
    { displayName: "動画", key: "movie", default: 0.3 },
    { displayName: "BPM", key: "bpm", default: 1.3 },
    { displayName: "6451進行の割合", key: "chordRate6451", default: 0.5 },
    { displayName: "4561進行の割合", key: "chordRate4561", default: 0.1 },
    { displayName: "ピアノの使用度", key: "pianoRate", default: 0.6 },
    { displayName: "主なキー", key: "mainKey", default: 0.6 },
    { displayName: "主なコード", key: "mainChord", default: 0.6 },
    { displayName: "転調回数", key: "modulationTimes", default: 0.4 },
];

export type customParams = {
    target_song_id?: string;
    parameters: {
        [K in (typeof specifiableParams)[number]["key"]]: number;
    } & {
        a?: number;
    };
    limit?: number;
    is_reversed?: boolean;
};

export const defaultCustomParams: customParams = {
    limit: 10,
    parameters: specifiableParams.reduce((acc, content) => {
        acc[content.key as keyof Song] = content.default;
        return acc;
    }, {} as customParams["parameters"]),
};
