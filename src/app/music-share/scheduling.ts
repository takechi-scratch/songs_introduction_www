import { Song } from "@/lib/songs/types";

export interface SharingSchedule {
    title: string;
    description: string;
    startDate: number;
    endDate: number;
    songs: SharingSong[];
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
    };
}

const description = `
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

- 不具合があったら[たーけ](https://x.com/takechi_scratch)まで教えてください。
`.trim();

export function createScheduleInSpecialEvent(allSongs: Song[]): SharingSchedule {
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
        description: description,
        startDate: startDate,
        endDate:
            songs[songs.length - 1].startDate +
            (songDurationMap.get(songs[songs.length - 1].id) || 0),
        songs: songs,
    };
}
