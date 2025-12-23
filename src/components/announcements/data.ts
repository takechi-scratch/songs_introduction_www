import { AlertProps } from "@mantine/core";
import { NotificationData } from "@mantine/notifications";

interface Announcement {
    id: string;
    title: string;
    content: string;
    expiresDate: number;
    pinnedToTop: boolean;
    onlyInDev?: boolean;
    notificationProps?: Omit<NotificationData, "title" | "message">;
    alertProps?: AlertProps;
    // TODO: アイコンを文字列で指定できるようにする
}

export const data: Announcement[] = [
    {
        id: "test_001",
        title: "こんにちは！",
        content: "お知らせのテストです。",
        expiresDate: 1763265600,
        pinnedToTop: false,
        onlyInDev: true,
    },
    {
        id: "guide_001",
        title: "ようこそ！",
        content:
            "ぜひいろいろな機能を試してみてください！\n[利用規約](/docs/terms/)の確認もお願いします。",
        expiresDate: 4102412400,
        pinnedToTop: false,
    },
    {
        id: "feature_001",
        title: "ルーレット機能追加！",
        content:
            "[曲一覧](/songs/)の検索結果から、ランダムに曲を選べます。\nぜひ試してみてください！",
        expiresDate: 1764774000,
        pinnedToTop: true,
        notificationProps: {
            color: "cyan",
        },
        alertProps: {
            color: "cyan",
        },
    },
    {
        id: "feature_002",
        title: "再生リストの作成機能が使えるようになりました！",
        content:
            "[曲一覧](/songs/)で、検索結果や似ている曲の一覧から、YouTubeの再生リストを作れます！\nぜひ試してみてください！（利用には[ログイン](/login)が必要です）",
        expiresDate: 1766145600,
        pinnedToTop: true,
        notificationProps: {
            color: "pink",
        },
        alertProps: {
            color: "pink",
        },
    },
    {
        id: "feature_003",
        title: "歌詞の分析機能を追加しました！",
        content:
            "歌詞の類似度を「似ている曲」の算出に利用しています。\nもし似ている曲の提案に問題や不満点があれば、ぜひフィードバックをお寄せください！",
        expiresDate: 1766826000,
        pinnedToTop: false,
    },
    {
        id: "survey_001",
        title: "お知らせ",
        content:
            "現在、機械的に分析データを作成することについてご意見を募集しています。\n[ご意見はこちら(X)](https://x.com/takechi_scratch/status/1986981649213759768)",
        expiresDate: 1763910000,
        pinnedToTop: false,
    },
];
