import { specifiableParams } from "./nearest";
import { SortableKeys } from "./filter";

export interface SongFilters {
    title?: string;
    comment?: string;
    vocal?: string;
    illustrations?: string;
    movie?: string;
    id?: string;
    mainChord?: string;
    mainKey?: number;
    publishedType?: number;
    publishedAfter?: number;
    publishedBefore?: number;
}

export const FilterableLabels: { [key in keyof SongFilters]: string } = {
    title: "タイトル",
    comment: "コメント",
    vocal: "ボーカル",
    illustrations: "イラスト等",
    movie: "動画",
    id: "動画のID",
    mainChord: "主なコード進行",
    mainKey: "主なキー",
    publishedType: "公開形式",
    publishedAfter: "～以降に公開",
    publishedBefore: "～以前に公開",
};

export interface SongNearestQuery {
    targetSongID: string;
    parameters?: {
        [K in (typeof specifiableParams)[number]["key"]]?: number;
    } & {
        a?: number;
    };
}

export interface SongSearchParams {
    q?: string;
    filter?: SongFilters;
    nearest?: SongNearestQuery;
    limit?: number;
    // TODO: ランダムを抜く
    order?: (typeof SortableKeys)[keyof typeof SortableKeys];
    asc?: boolean;
}
