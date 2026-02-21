"use client";

import MyAppShell from "@/components/appshell";
import { useAuth } from "@/contexts/AuthContext";
import {
    Title,
    Text,
    Button,
    TextInput,
    SegmentedControl,
    NumberInput,
    Slider,
    Select,
    Rating,
    Textarea,
    TagsInput,
    Flex,
    Tabs,
    Switch,
    Anchor,
    Divider,
    Alert,
} from "@mantine/core";
import Link from "next/link";
import { useForm } from "@mantine/form";
import { useUserRole } from "@/hooks/auth";
import { upsertSong } from "@/lib/songs/api";
// app routerの際はuseRouterは`next/navigation`から
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { useSong } from "@/hooks/songs";
import { UpsertSong } from "@/lib/songs/types";
import { useDisclosure } from "@mantine/hooks";
import { IconInfoCircle } from "@tabler/icons-react";

function inputStylesProps({ example, displayName }: { example: string; displayName: string }) {
    return {
        label: (
            <Text size="sm" style={{ width: 100 }}>
                {displayName}
            </Text>
        ),
        placeholder: example,
        style: {
            display: "flex",
            alignItems: "center",
            gap: 10,
        },
        mb: "xs",
        styles: { wrapper: { width: "100%", maxWidth: 700 } },
    };
}

function InfoTabs() {
    const searchParams = useSearchParams();
    const paramID = searchParams.get("id");
    // console.log("paramID:", paramID);

    const { song: beforeSong } = useSong(paramID ?? null);
    // console.log("beforeSong:", beforeSong);

    const { user } = useAuth();
    const userRole = useUserRole();

    const [playerID, setPlayerID] = useState(paramID ?? "");
    const [autoFetchVideoData, { toggle: toggleAutoFetchVideoData }] = useDisclosure(true);
    const router = useRouter();

    const form = useForm<
        Omit<UpsertSong, "publishedType" | "lyricsVector"> & {
            publishedType: string;
            lyricsVector: string;
        }
    >({
        mode: "uncontrolled",
        initialValues: {
            id: "",
            title: "",
            publishedTimestamp: Date.now(),
            durationSeconds: 0,
            publishedType: "1",
            vocal: [],
            illustrations: [],
            movie: [],
            bpm: 120,
            mainKey: 60,
            chordRate6451: 0.5,
            chordRate4561: 0.5,
            mainChord: "",
            pianoRate: 3,
            modulationTimes: 0,
            lyricsOfficiallyReleased: false,
            lyricsVector: "",
            comment: "",
        },

        validate: {},
    });

    // beforeSongが読み込まれたらフォームの値を更新
    useEffect(() => {
        if (beforeSong) {
            form.setValues({
                id: beforeSong.id,
                title: beforeSong.title ?? "",
                publishedTimestamp: beforeSong.publishedTimestamp ?? Date.now(),
                durationSeconds: beforeSong.durationSeconds ?? 0,
                publishedType: beforeSong.publishedType.toString(),
                vocal: beforeSong.vocal ?? [],
                illustrations: beforeSong.illustrations ?? [],
                movie: beforeSong.movie ?? [],
                bpm: beforeSong.bpm ?? 120,
                mainKey: beforeSong.mainKey ?? 60,
                chordRate6451: beforeSong.chordRate6451 ?? 0.5,
                chordRate4561: beforeSong.chordRate4561 ?? 0.5,
                mainChord: beforeSong.mainChord ?? "",
                pianoRate: beforeSong.pianoRate ?? 3,
                modulationTimes: beforeSong.modulationTimes ?? 0,
                lyricsOfficiallyReleased: beforeSong.lyricsOfficiallyReleased ?? false,
                lyricsVector: beforeSong.lyricsVector
                    ? JSON.stringify(beforeSong.lyricsVector)
                    : "",
                comment: beforeSong.comment ?? "",
            });
        }
        // formは含める必要なし
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [beforeSong]);

    if (!user || userRole === "user") {
        return (
            <>
                <Text mb="md">曲の追加・編集は現在編集者のみが行えます。</Text>
                <Link href="/">トップページへ</Link>
            </>
        );
    }

    return (
        <form
            onSubmit={form.onSubmit(async (values) => {
                await upsertSong(paramID, {
                    id: values.id,
                    title: autoFetchVideoData ? undefined : values.title,
                    publishedTimestamp: autoFetchVideoData ? undefined : values.publishedTimestamp,
                    durationSeconds: autoFetchVideoData ? undefined : values.durationSeconds,
                    vocal: values.vocal,
                    illustrations: values.illustrations,
                    movie: values.movie,
                    publishedType: parseInt(values.publishedType),
                    bpm: values.bpm,
                    mainKey: values.mainKey,
                    chordRate6451: values.chordRate6451,
                    chordRate4561: values.chordRate4561,
                    mainChord: values.mainChord,
                    pianoRate: values.pianoRate,
                    modulationTimes: values.modulationTimes,
                    lyricsOfficiallyReleased: values.lyricsOfficiallyReleased,
                    lyricsVector:
                        values.lyricsVector !== "" ? JSON.parse(values.lyricsVector) : undefined,
                    comment: values.comment,
                });
                console.log(values);
                router.push(`/songs/${values.id}`);
            })}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    const target = e.target as HTMLElement;

                    if (target.getAttribute("data-video-id-input") !== null) {
                        // 動画ID入力欄でEnterが押された場合
                        e.preventDefault();
                        setPlayerID(form.values.id);
                        return;
                    }

                    // その他のフィールド（コメント以外）でEnterが押された場合
                    if (target.tagName !== "TEXTAREA") {
                        e.preventDefault();
                    }
                }
            }}
        >
            <Flex direction={{ base: "column", md: "row" }} gap="md">
                <div style={{ width: "100%", maxWidth: "480px" }}>
                    <div
                        style={{
                            width: "100%",
                            aspectRatio: "16/9",
                        }}
                    >
                        <Suspense>
                            <ReactPlayer
                                src={`https://www.youtube.com/watch?v=${playerID}`}
                                width="100%"
                                height="100%"
                                controls
                                fallback={
                                    <div style={{ width: "100%", aspectRatio: "16/9" }}>
                                        Loading...
                                    </div>
                                }
                            />
                        </Suspense>
                    </div>
                    <Flex m="md" gap="md" align="center" direction={{ base: "column", sm: "row" }}>
                        <Button
                            component="a"
                            href={`https://www.youtube.com/watch?v=${playerID}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="filled"
                            color="red"
                        >
                            YouTubeで聴く
                        </Button>
                        <Button
                            component="a"
                            href={`https://open.spotify.com/search/${encodeURIComponent(form.values.title ?? "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="filled"
                            color="teal"
                        >
                            Spotifyで検索
                        </Button>
                        <Anchor onClick={() => router.back()} style={{ cursor: "pointer" }}>
                            前のページに戻る
                        </Anchor>
                    </Flex>
                </div>

                <Tabs defaultValue="basicInfo" style={{ flex: 1 }}>
                    <Tabs.List mb="md">
                        <Tabs.Tab value="basicInfo" color="red">
                            概要
                        </Tabs.Tab>
                        <Tabs.Tab value="analysis" color="blue">
                            分析情報
                        </Tabs.Tab>
                        <Tabs.Tab value="lyrics" color="cyan">
                            歌詞
                        </Tabs.Tab>
                        <Tabs.Tab value="others" color="teal">
                            その他
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="basicInfo">
                        <Title order={4} mb="lg">
                            動画データ
                        </Title>
                        {beforeSong && (
                            <Text size="sm" mb="xs">
                                更新前の動画ID: {beforeSong.id}
                            </Text>
                        )}
                        <Flex align="flex-end" gap="lg" mb="md">
                            <TextInput
                                withAsterisk
                                label="曲の動画ID"
                                placeholder="id-test"
                                key={form.key("id")}
                                {...form.getInputProps("id")}
                                data-video-id-input
                            />
                            <Button onClick={() => setPlayerID(form.values.id)}>動画を表示</Button>
                        </Flex>

                        <Switch
                            label="動画データを自動取得"
                            mb="md"
                            checked={autoFetchVideoData}
                            onChange={toggleAutoFetchVideoData}
                        />
                        <TextInput
                            disabled={autoFetchVideoData}
                            key={form.key("title")}
                            {...form.getInputProps("title")}
                            {...inputStylesProps({ example: "ハナタバ", displayName: "タイトル" })}
                        />
                        <Flex gap="md">
                            <NumberInput
                                disabled={autoFetchVideoData}
                                key={form.key("publishedTimestamp")}
                                {...form.getInputProps("publishedTimestamp")}
                                {...inputStylesProps({
                                    example: "1771650763",
                                    displayName: "公開日時",
                                })}
                            />
                            <Link
                                href="https://begoodtool.com/timestamp/jp"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                タイムスタンプ取得
                            </Link>
                        </Flex>
                        <NumberInput
                            disabled={autoFetchVideoData}
                            key={form.key("durationSeconds")}
                            {...form.getInputProps("durationSeconds")}
                            {...inputStylesProps({ example: "210", displayName: "長さ（秒）" })}
                        />

                        <Divider my="lg" />

                        <Title order={4} mb="sm">
                            曲に関するデータ
                        </Title>
                        <Flex gap={10} align="center" mb="xs">
                            <Text size="sm" w={100}>
                                公開形式
                            </Text>
                            <SegmentedControl
                                defaultValue="1"
                                data={[
                                    { value: "-1", label: "仮掲載" },
                                    { value: "0", label: "提供曲" },
                                    { value: "1", label: "オリジナル曲" },
                                ]}
                                key={form.key("publishedType")}
                                {...form.getInputProps("publishedType")}
                            />
                        </Flex>
                        <TagsInput
                            key={form.key("vocal")}
                            {...form.getInputProps("vocal")}
                            {...inputStylesProps({ example: "初音ミク", displayName: "ボーカル" })}
                        />
                        <TagsInput
                            key={form.key("illustrations")}
                            {...form.getInputProps("illustrations")}
                            {...inputStylesProps({ example: "ao", displayName: "イラスト等" })}
                        />
                        <TagsInput
                            key={form.key("movie")}
                            {...form.getInputProps("movie")}
                            {...inputStylesProps({ example: "瀬戸わらび", displayName: "動画" })}
                        />
                    </Tabs.Panel>

                    <Tabs.Panel value="analysis">
                        <Title order={4} mb="sm">
                            基本データ
                        </Title>
                        <NumberInput
                            key={form.key("bpm")}
                            {...form.getInputProps("bpm")}
                            {...inputStylesProps({ example: "120", displayName: "BPM" })}
                        />{" "}
                        <Link
                            href="https://bpm.mononichi.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            BPMカウンター
                        </Link>
                        <NumberInput
                            mt="xs"
                            key={form.key("mainKey")}
                            {...form.getInputProps("mainKey")}
                            {...inputStylesProps({ example: "60", displayName: "主なキー" })}
                        />
                        <Select
                            data={["6451", "61451", "4561", "4536", "4361", "6系他", "4系他"]}
                            key={form.key("mainChord")}
                            {...form.getInputProps("mainChord")}
                            {...inputStylesProps({ example: "6451", displayName: "主なコード" })}
                        />
                        <NumberInput
                            defaultValue="0"
                            key={form.key("modulationTimes")}
                            {...form.getInputProps("modulationTimes")}
                            {...inputStylesProps({ example: "0", displayName: "転調回数" })}
                        />
                        <Text size="sm" mb="xs">
                            6451進行の割合
                        </Text>
                        <Slider
                            label={(value) => `${(value * 100).toFixed(0)}%`}
                            defaultValue={beforeSong?.chordRate6451 ?? 0.5}
                            key={form.key("chordRate6451")}
                            min={0}
                            max={1}
                            step={0.05}
                            {...form.getInputProps("chordRate6451")}
                            mb="sm"
                        />
                        <Text size="sm" mb="xs">
                            4561進行の割合
                        </Text>
                        <Slider
                            label={(value) => `${(value * 100).toFixed(0)}%`}
                            defaultValue={beforeSong?.chordRate4561 ?? 0.5}
                            key={form.key("chordRate4561")}
                            min={0}
                            max={1}
                            step={0.05}
                            {...form.getInputProps("chordRate4561")}
                            mb="sm"
                        />
                        <Text size="sm" mb="xs">
                            ピアノの使用度
                        </Text>
                        <Rating
                            defaultValue={3}
                            size={30}
                            key={form.key("pianoRate")}
                            {...form.getInputProps("pianoRate")}
                            mb="md"
                        />
                    </Tabs.Panel>

                    <Tabs.Panel value="lyrics">
                        <Alert mb="md" icon={<IconInfoCircle />} color="cyan">
                            歌詞ベクトルはローカルのLyrics2Vecで生成したものをコピーしてください。
                        </Alert>
                        <TextInput
                            key={form.key("lyricsVector")}
                            {...form.getInputProps("lyricsVector")}
                            {...inputStylesProps({
                                example: "[0.1, -0.2, ...]",
                                displayName: "歌詞ベクトル",
                            })}
                            mb="md"
                        />
                        <Switch
                            label="公式の歌詞"
                            mb="xs"
                            key={form.key("lyricsOfficiallyReleased")}
                            {...form.getInputProps("lyricsOfficiallyReleased")}
                        />
                    </Tabs.Panel>

                    <Tabs.Panel value="others">
                        <Title order={4} mb="sm">
                            コメント
                        </Title>
                        <Textarea
                            placeholder="気づいた点など"
                            autosize
                            key={form.key("comment")}
                            {...form.getInputProps("comment")}
                        />
                    </Tabs.Panel>
                </Tabs>
            </Flex>
            <Button type="submit">公開する</Button>
        </form>
    );
}

export default function Page() {
    return (
        <MyAppShell>
            <Title mb="lg">曲の追加・編集</Title>
            <Suspense fallback={<>loading params...</>}>
                <InfoTabs />
            </Suspense>
        </MyAppShell>
    );
}
