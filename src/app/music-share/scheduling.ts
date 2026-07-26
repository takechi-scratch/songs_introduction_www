import { formatDate } from "@/lib/date";
import { Song } from "@/lib/songs/types";
import seedrandom from "seedrandom";

export interface SharingSchedule {
    title: string;
    description: string;
    startDate: number;
    endDate: number;
    songs: SharingSong[];
    chatEnabled?: boolean;
}

export interface SharingSong {
    id: string;
    title: string;
    startDate: number;
}

export function createTestSchedule(allSongs: Song[]): SharingSchedule {
    const startDate = new Date("2026-06-07T18:30:00+09:00").getTime() / 1000;
    let currentTime = startDate;
    const songs: SharingSong[] = [];
    for (const song of allSongs.slice(0, 10)) {
        songs.push({
            id: song.id,
            title: song.title,
            startDate: currentTime,
        });
        currentTime += song.durationSeconds || 0;
    }

    return {
        title: "同時視聴会のテスト",
        description: "イベントに向けた**テスト中**です！不具合があったら教えてください。",
        startDate: startDate,
        endDate: currentTime,
        songs: songs,
        chatEnabled: true,
    };
}

export function createScheduleForThemedParty(allSongs: Song[]): SharingSchedule {
    // 所要時間: 01:05:16
    const sources = [
        "ioW9iGDpQyw",
        "Wiz0Ap2ge5U",
        "HkTihNKCWFA",
        "LKyLOLosp54",
        "IxVFW1XIW7Q",
        "YN6c7v9Mr1I",
    ];

    const songsID = [...sources, ...sources, ...sources, ...sources];

    const startDate = new Date("2026-07-01T21:00:00+09:00").getTime() / 1000;
    let currentTime = startDate;

    const songs: SharingSong[] = [];
    for (const id of songsID) {
        const song = allSongs.find((s) => s.id === id);
        if (!song) {
            continue;
        }

        songs.push({
            id: song.id,
            title: song.title,
            startDate: currentTime,
        });
        currentTime += song.durationSeconds || 0;
    }

    return {
        title: "哀歌シリーズ！",
        description: [
            "哀歌シリーズだけの1時間！初公開が昔の曲から、順番に4周流します！",
            "一緒に聴いて、イチオシの曲を見つけましょう！",
            "",
            "不具合があったら[@takechi_scratch](https://x.com/takechi_scratch)まで。",
            "※開始1時間前～終了10分後の間は、イベント用スケジュールでの再生になっています。その後は、通常のランダム再生スケジュールに切り替わります。",
        ].join("\n"),
        startDate: startDate,
        endDate: currentTime,
        songs: songs,
        chatEnabled: true,
    };
}

export function createDailySchedule(allSongs: Song[]): SharingSchedule {
    const today = Math.floor((Date.now() / 1000 + 3600 * 9) / 86400);
    const startDate = today * 86400 - 3600 * 9;
    let currentTime = startDate;

    const rng = seedrandom(today.toString());
    const songs: SharingSong[] = [];
    while (currentTime < startDate + 86400) {
        const song = allSongs[Math.floor(rng() * allSongs.length)];
        if (song.publishedTimestamp > startDate) {
            // 当日に公開された曲でスケジュールがずれるのを防ぐ
            continue;
        }

        if (currentTime + (song.durationSeconds || 0) > startDate + 86400) {
            break;
        }

        songs.push({
            id: song.id,
            title: song.title,
            startDate: currentTime,
        });
        currentTime += song.durationSeconds || 0;
    }

    const description = [
        "毎日、提供曲も含めた全曲からランダムに再生しています。朝活や寝る前、いろんな曲を聴きたいときにぜひご利用ください！",
        "## 注意事項",
        "- スケジュールは毎日0時（日本時間）に更新されます。0:00直前の数分間は、スケジュール入れ替えのため再生が止まります。",
        "- 同時視聴イベントを開催する際は、スケジュールが変更になることがあります！",
    ].join("\n");

    return {
        title: `音楽シェア ${formatDate(Date.now() / 1000)}`,
        description: description,
        startDate: startDate,
        endDate: currentTime,
        songs: songs,
        chatEnabled: false,
    };
}

const specialEventDescription = `
【※非公式のイベントです！】
MIMIさんの初投稿から10周年を記念して、みんなで一緒に曲を聴こうという会です。
調べてみたら全曲合わせて8時間弱かかるみたいなので、前日から全曲を3周流すことにしました！

## スケジュール
MIMIさんのオリジナル曲&提供曲を古い順に再生
- 6月8日(月)21:12～  1周目
- 6月9日(火)05:08～  2周目
- 6月9日(火)13:14～  3周目

- 6月9日(火)21:00～  ラピスラズリを同時視聴！（10年前の公開時刻と同じ！）
- 終了後、翌0時まではランダムに選んだ曲を流します。

## 注意事項
- 途中参加・途中退出OKです！お好きなタイミングでご参加ください。
- スケジュールは変更になる場合があります、ご了承ください。

- 再生時間は自動で調整されます。
- YouTubeの仕様上、再生リストを150曲（数時間）ごとに区切っています。リストが止まったら、「再生位置を合わせる」ボタンを押すと、続きが再生されます。

- チャットでは、曲の感想・バグ報告など自由に書き込んでください！ただし、他の参加者が不快になるような内容や、個人情報、勧誘を送信することはお控えください。

- 不具合があったら[たーけ](https://x.com/takechi_scratch)まで教えてください。
`.trim();

export const pastEvents = [
    {
        title: "MIMIさん活動開始10周年記念！同時視聴会",
        description: specialEventDescription,
        startDate: new Date("2026-06-08T21:12:27+09:00").getTime() / 1000,
        endDate: new Date("2026-06-10T00:00:05+09:00").getTime() / 1000,
    },
    {
        title: "10周年記念アルバムを一緒に聴く会",
        description: [
            "タイトルの通り、アルバムの曲を順番に再生します！一緒に聴いて、イチオシの曲を見つけましょう！",
            "不具合があったら[@takechi_scratch](https://x.com/takechi_scratch)まで。",
            "※開始1時間前～終了30分後の間は、イベント用スケジュールでの再生になっています。その後は、通常のランダム再生スケジュールに切り替わります。",
        ].join("\n"),
        startDate: 1781267400,
        endDate: 1781271269,
    },
    {
        title: "哀歌シリーズ！",
        description: [
            "哀歌シリーズだけの1時間！初公開が昔の曲から、順番に4周流します！",
            "一緒に聴いて、イチオシの曲を見つけましょう！",
            "",
            "不具合があったら[@takechi_scratch](https://x.com/takechi_scratch)まで。",
            "※開始1時間前～終了10分後の間は、イベント用スケジュールでの再生になっています。その後は、通常のランダム再生スケジュールに切り替わります。",
        ].join("\n"),
        startDate: new Date("2026-07-01T21:00:00+09:00").getTime() / 1000,
        endDate: new Date("2026-07-01T22:05:56+09:00").getTime() / 1000,
    },
] as const;
