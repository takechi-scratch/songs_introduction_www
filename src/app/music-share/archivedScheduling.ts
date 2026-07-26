import { Song } from "@/lib/songs/types";
import { SharingSchedule, SharingSong } from "./scheduling";

export function createScheduleForAlbumShareing(allSongs: Song[]): SharingSchedule {
    const songsID = [
        "SBlkzGiM5uE",
        "QJaY60vjSxw",
        "rzamOqbbBfQ",
        "fztKqreP1pk",
        "qtuX4cHk-vE",
        "pPy1m0P3Uvg",
        "vLigCJOcHOE",
        "f6TytcA47rI",
        "1gSMjPLRJik",
        "7xht3kQO_TM",
        "340OXvocRMM",
        "ioW9iGDpQyw",
        "YN6c7v9Mr1I",
        "6Qy0Xw_wR0M",
        "Mb9TWJm_5L4",
        "Lah9p6KokM8",
        "m-bvW4pKT68",
        "TC80uw4HgCw",
        "hMZOgUJwK_8",
        "IxVFW1XIW7Q",
        "jJh0o5KyH8w",
        "2zyZqXvrIpk",
    ];

    const startDate = new Date("2026-06-12T21:30:00+09:00").getTime() / 1000;
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
        title: "10周年記念アルバムを一緒に聴く会",
        description: [
            "タイトルの通り、アルバムの曲を順番に再生します！一緒に聴いて、イチオシの曲を見つけましょう！",
            "不具合があったら[@takechi_scratch](https://x.com/takechi_scratch)まで。",
            "※開始1時間前～終了30分後の間は、イベント用スケジュールでの再生になっています。その後は、通常のランダム再生スケジュールに切り替わります。",
        ].join("\n"),
        startDate: startDate,
        endDate: currentTime,
        songs: songs,
        chatEnabled: true,
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

export function createScheduleForSpecialEvent(allSongs: Song[]): SharingSchedule {
    allSongs.sort((a, b) => a.publishedTimestamp - b.publishedTimestamp);
    const songDurationMap = new Map(allSongs.map((s) => [s.id, s.durationSeconds || 0]));
    const songTitleMap = new Map(allSongs.map((s) => [s.id, s.title]));

    const randomIndex = [
        121, 152, 84, 50, 45, 67, 11, 105, 0, 75, 26, 56, 151, 36, 161, 147, 166, 145, 109, 8, 162,
        80, 154, 58, 35, 157, 61, 118, 42, 108, 62, 110, 167, 112, 138, 102, 122, 141, 150, 95, 114,
        131, 103, 10, 51, 43, 101, 1, 63, 24, 74, 39, 40, 116, 77, 83, 6, 132, 130, 100, 5, 81, 137,
        104, 136,
    ];
    const releaseDate = new Date("2026-06-09T21:00:00+09:00").getTime() / 1000;
    const timeForOneLap = allSongs.reduce((a, b) => a + (b.durationSeconds || 0), 0);
    const startDate = releaseDate - timeForOneLap * 3;

    const songs: SharingSong[] = [];
    let currentTime = startDate;
    for (let i = 0; i < 3; i++) {
        for (const song of allSongs) {
            songs.push({
                id: song.id,
                title: song.title,
                startDate: currentTime,
            });
            currentTime += song.durationSeconds || 0;
        }
    }

    songs.push({
        id: "SBlkzGiM5uE",
        title: songTitleMap.get("SBlkzGiM5uE") || "",
        startDate: currentTime,
    });
    currentTime += songDurationMap.get("SBlkzGiM5uE") || 0;

    for (const idx of randomIndex) {
        const song = allSongs[idx];
        songs.push({
            id: song.id,
            title: song.title,
            startDate: currentTime,
        });
        currentTime += song.durationSeconds || 0;
    }

    return {
        title: "MIMIさん活動開始10周年記念！同時視聴会",
        description: specialEventDescription,
        startDate: startDate,
        endDate:
            songs[songs.length - 1].startDate +
            (songDurationMap.get(songs[songs.length - 1].id) || 0),
        songs: songs,
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
