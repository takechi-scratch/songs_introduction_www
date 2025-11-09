interface FilterableContent {
    displayName: string;
    key: keyof import("../songs/types").Song;
    example: string;
    selectLabel?: string[];
    selectValue?: { [key: string]: string | number };
}

export const FilterableContents: FilterableContent[] = [
    { displayName: "動画のID", key: "id", example: "id-test" },
    { displayName: "タイトル", key: "title", example: "ハナタバ" },
    {
        displayName: "公開形式",
        key: "publishedType",
        selectLabel: ["すべて", "オリジナル曲", "提供曲"],
        selectValue: { すべて: "", オリジナル曲: 1, 提供曲: 0 },
        example: "すべて",
    },
    { displayName: "ボーカル", key: "vocal", example: "初音ミク" },
    { displayName: "イラスト等", key: "illustrations", example: "ao" },
    { displayName: "動画", key: "movie", example: "瀬戸わらび" },
    { displayName: "コメント", key: "comment", example: "ノリが良い" },
    { displayName: "主なコード進行", key: "mainChord", example: "6451" },
    { displayName: "主なキー", key: "mainKey", example: "60" },
];

export const SortableKeys = {
    動画のID: "id",
    タイトル: "title",
    公開日時: "publishedTimestamp",
    曲の長さ: "durationSeconds",
    BPM: "bpm",
    キー: "mainKey",
    "6451進行の割合": "chordRate6451",
    "4561進行の割合": "chordRate4561",
    ピアノの使用度: "pianoRate",
    転調回数: "modulationTimes",
};

export type SearchQuery = {
    [key in (typeof FilterableContents)[number]["key"]]?: string | number;
} & {
    publishedAfter?: number;
    publishedBefore?: number;
    order?: string;
    asc?: boolean;
};
