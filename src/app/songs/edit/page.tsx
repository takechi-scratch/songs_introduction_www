"use client";

import MyAppShell from "@/components/appshell";
import { useAuth } from "@/contexts/AuthContext";
import {
    Title,
    Text,
    Button,
    Group,
    TextInput,
    SegmentedControl,
    Divider,
    NumberInput,
    Slider,
    Select,
    Rating,
    Textarea,
    TagsInput,
    Flex,
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

function AddSongsPage() {
    const searchParams = useSearchParams();
    const paramID = searchParams.get("id");
    // console.log("paramID:", paramID);

    const { song: beforeSong } = useSong(paramID ?? null);
    // console.log("beforeSong:", beforeSong);

    const { user } = useAuth();
    const userRole = useUserRole();

    const [playerID, setPlayerID] = useState(paramID ?? "");
    const router = useRouter();

    const form = useForm<Omit<UpsertSong, "publishedType"> & { publishedType: string }>({
        mode: "uncontrolled",
        initialValues: {
            id: "",
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
            comment: "",
        },

        validate: {},
    });

    // beforeSongが読み込まれたらフォームの値を更新
    useEffect(() => {
        if (beforeSong) {
            form.setValues({
                id: beforeSong.id,
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
        <>
            {playerID && (
                <div
                    style={{
                        aspectRatio: "16/9",
                        maxHeight: 200,
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                >
                    <ReactPlayer
                        src={`https://www.youtube.com/watch?v=${playerID}`}
                        width="100%"
                        height="100%"
                        controls
                        fallback={<div style={{ aspectRatio: "16/9" }}>Loading...</div>}
                    />
                </div>
            )}
            <form
                onSubmit={form.onSubmit(async (values) => {
                    await upsertSong(paramID, {
                        id: values.id,
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

                        // その他のフィールド（TEXTAREA以外）でEnterが押された場合
                        if (target.tagName !== "TEXTAREA") {
                            e.preventDefault();
                        }
                    }
                }}
            >
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

                {/* TODO: YouTubeから自動fetchしない（タイトル・公開日時の入力もする）モード */}
                <Text size="sm">公開形式</Text>
                <SegmentedControl
                    defaultValue="1"
                    data={[
                        { value: "-1", label: "仮掲載" },
                        { value: "0", label: "提供曲" },
                        { value: "1", label: "オリジナル曲" },
                    ]}
                    mb="sm"
                    key={form.key("publishedType")}
                    {...form.getInputProps("publishedType")}
                />

                <TagsInput
                    label="ボーカル"
                    placeholder="初音ミク"
                    key={form.key("vocal")}
                    {...form.getInputProps("vocal")}
                    mb="sm"
                />

                <TagsInput
                    label="イラスト等"
                    placeholder="ao"
                    key={form.key("illustrations")}
                    {...form.getInputProps("illustrations")}
                    mb="sm"
                />

                <TagsInput
                    label="動画"
                    placeholder="瀬戸わらび"
                    key={form.key("movie")}
                    {...form.getInputProps("movie")}
                />

                <Divider my="xl" />

                <NumberInput
                    withAsterisk
                    label="bpm"
                    placeholder="120"
                    key={form.key("bpm")}
                    {...form.getInputProps("bpm")}
                    mb="sm"
                />

                <NumberInput
                    withAsterisk
                    label="主なキー"
                    placeholder="60"
                    key={form.key("mainKey")}
                    {...form.getInputProps("mainKey")}
                    mb="sm"
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

                <Select
                    label="主なコード"
                    placeholder="6451"
                    data={["6451", "61451", "4561", "4536", "4361", "6系他", "4系他"]}
                    key={form.key("mainChord")}
                    {...form.getInputProps("mainChord")}
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

                <NumberInput
                    withAsterisk
                    label="転調回数"
                    defaultValue="0"
                    placeholder="0"
                    key={form.key("modulationTimes")}
                    {...form.getInputProps("modulationTimes")}
                />

                <Divider my="xl" />

                <Textarea
                    label="コメント"
                    placeholder="気づいた点など"
                    key={form.key("comment")}
                    {...form.getInputProps("comment")}
                />

                <Group justify="space-between" mt="md">
                    <Button type="button" color="gray" onClick={() => router.back()}>
                        戻る
                    </Button>
                    <Button type="submit">公開する</Button>
                </Group>
            </form>
        </>
    );
}

export default function Page() {
    return (
        <MyAppShell>
            <Title mb="lg">曲の追加・編集</Title>
            <Suspense fallback={<>loading params...</>}>
                <AddSongsPage />
            </Suspense>
        </MyAppShell>
    );
}
