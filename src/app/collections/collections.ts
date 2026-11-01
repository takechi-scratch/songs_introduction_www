import { SongSearchParams } from "@/lib/search/search";

export const CollectionsData: {
    slug: string;
    title: string;
    description: string;
    searchParams?: SongSearchParams[];
    songs?: string[];
    askForSuggestion?: boolean;
}[] = [
    {
        slug: "komuro-chord-progression",
        title: "小室進行の曲",
        description: [
            "小室進行とは、1990年代に作曲家の小室哲哉さんが多くの曲で採用したことから名づけられたコード進行です！",
            "高揚感・疾走感のある曲からしっとりしたバラードまで幅広い表現ができ、現在のボカロ曲やJ-POPにも多く取り入れられています！",
        ].join("\n"),
        searchParams: [
            {
                filter: { mainChord: "6451" },
            },
            {
                filter: { mainChord: "61451" },
            },
        ],
    },
    {
        slug: "vocaloid",
        title: "ボカロ曲",
        description: "MIMIさんのボカロ曲（合成音声をボーカルにした曲）をまとめました！",
        searchParams: [
            {
                q: "初音ミク | 可不 | 重音テト | 重音テトSV | 音街ウナ | 音街ウナSV | 狐子 | 羽累 | 裏命 | 星界",
            },
        ],
    },
    {
        slug: "provided-10",
        title: "ぜひ聴いてほしい提供曲10選",
        description:
            "MIMIさんが他の歌い手の方に提供した曲のうち、特におすすめの10曲をまとめました！",
        songs: [
            "5GUaMOpfmr8",
            "n6GVaJL_eeY",
            "x8yrI4_YULo",
            "coq4KE4zq1E",
            "SgRWRTE8s8E",
            "C-iWEe2-0MM",
            "o51I-_MrasQ",
            "5gIf0_xpFPI",
            "y8mcI03Wva0",
            "QjMCTZxkiNs",
        ],
        askForSuggestion: true,
    },
] as const;
