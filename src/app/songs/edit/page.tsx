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

function AddSongsPage() {
    const searchParams = useSearchParams();
    const paramID = searchParams.get("id");
    // console.log("paramID:", paramID);

    const { song: beforeSong } = useSong(paramID ?? null);
    // console.log("beforeSong:", beforeSong);

    const { user } = useAuth();
    const userRole = useUserRole();

    const [id, setID] = useState(paramID ?? "");
    const router = useRouter();

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            videoId: "",
            publishedType: "1",
            vocal: "",
            illustrations: "",
            movie: "",
            bpm: 120,
            mainKey: 60,
            chordRate6451: 0.5,
            chordRate4561: 0.5,
            mainChord: "",
            pianoRate: 3,
            modulationTimes: 0,
            comment: "",
        },

        validate: {},
    });

    // beforeSongが読み込まれたらフォームの値を更新
    useEffect(() => {
        if (beforeSong) {
            form.setValues({
                videoId: beforeSong.id,
                publishedType: beforeSong.publishedType.toString(),
                vocal: beforeSong.vocal,
                illustrations: beforeSong.illustrations,
                movie: beforeSong.movie,
                bpm: beforeSong.bpm,
                mainKey: beforeSong.mainKey,
                chordRate6451: beforeSong.chordRate6451,
                chordRate4561: beforeSong.chordRate4561,
                mainChord: beforeSong.mainChord,
                pianoRate: beforeSong.pianoRate,
                modulationTimes: beforeSong.modulationTimes,
                comment: beforeSong.comment,
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
            {
                // TODO: ボタンクリックで動画を表示するように変更
                id && (
                    <div
                        style={{
                            aspectRatio: "16/9",
                            maxHeight: 200,
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    >
                        <ReactPlayer
                            src={`https://www.youtube.com/watch?v=${id}`}
                            width="100%"
                            height="100%"
                            controls
                            fallback={<div style={{ aspectRatio: "16/9" }}>Loading...</div>}
                        />
                    </div>
                )
            }
            <form
                onSubmit={form.onSubmit(async (values) => {
                    await upsertSong(paramID, {
                        id: id,
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
                        comment: values.comment,
                    });
                    console.log(values);
                    router.push(`/songs/${id}`);
                })}
            >
                <TextInput
                    withAsterisk
                    label="曲の動画ID"
                    placeholder="id-test"
                    value={id}
                    onChange={(event) => setID(event.currentTarget.value)}
                    mb="sm"
                />

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

                <TextInput
                    label="ボーカル"
                    placeholder="初音ミク"
                    key={form.key("vocal")}
                    {...form.getInputProps("vocal")}
                    mb="sm"
                />

                <TextInput
                    label="イラスト等"
                    placeholder="ao"
                    key={form.key("illustrations")}
                    {...form.getInputProps("illustrations")}
                    mb="sm"
                />

                <TextInput
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
