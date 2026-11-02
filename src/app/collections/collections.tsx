import { SongSearchParams } from "@/lib/search/search";
import { Song } from "@/lib/songs/types";

export type CollectionCategory = "profile" | "theory" | "recommendation" | "other";
export type Collection = {
    slug: string;
    title: string;
    description: string;
    searchParams?: SongSearchParams[];
    searchFunction?: (song: Song) => boolean;
    songs?: string[];
    askForSuggestion?: boolean;
    category?: CollectionCategory;
};

// ここにあるコレクションはすべて、たーけが手作業でタイトル・説明文・曲選を作成しています。
// 一部AIと議論し、表現を改善した部分があります。

export const CollectionsData: Collection[] = [
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
        category: "theory",
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
        category: "profile",
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
        category: "recommendation",
    },
    {
        slug: "modulation",
        title: "転調する曲",
        description: [
            "曲の途中で転調すると、盛り上がりが高まったり、雰囲気がガラッと変わったりします。",
            "転調する曲をいろいろ聴いてみると、それぞれに込められた思いの違いを感じることができるかもしれません！",
        ].join("\n"),
        searchFunction: (song: Song) => {
            const hasKeyChange =
                typeof song.modulationTimes === "number" && song.modulationTimes > 0;
            return hasKeyChange;
        },
        category: "theory",
    },
    {
        slug: "illustrator-Driedflower",
        title: "ドライフラワーさんのイラストの曲",
        description: [
            "MVに[ドライフラワーさん](https://x.com/Driedflower6)のイラストが使われている曲をまとめました！",
            "怖くて眠れない夜や、ちょっと疲れたときに、そっと心に寄り添ってくれる曲たちです。",
        ].join("\n"),
        searchParams: [
            {
                filter: { illustrations: "ドライフラワー" },
            },
        ],
        category: "profile",
    },
    {
        slug: "piano-max",
        title: "ピアノが綺麗な曲",
        description: [
            "特にピアノが多く使われている曲をまとめました！",
            "優しいボーカルが引き立つ曲から、駆け回るようなピアノソロまで、さまざまなピアノの音色を聴き比べてみてください！",
        ].join("\n"),
        searchFunction: (song: Song) => song.pianoRate === 5,
        category: "theory",
    },
] as const;
