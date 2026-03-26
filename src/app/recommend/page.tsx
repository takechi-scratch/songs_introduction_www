"use client";

import MyAppShell from "@/components/appshell/myAppshell";
import { useSampleSongs } from "@/hooks/songs";
import {
    Button,
    Center,
    Checkbox,
    Divider,
    Flex,
    Paper,
    Radio,
    SegmentedControl,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import SongPreferenceQuestion from "@/components/songPreferenceQuestion";
import Link from "next/link";

type status = "start" | "prepare" | "choice";
const songsPeriod = {
    "2016年～（ラピスラズリ・マシュマリーなど）": 1468774540,
    "2021年～（よるつむぎ・もでらーとなど）": 1627722009,
    "2022年～（ハナタバ・ポシェットなど）": 1668852009,
    "2023年～（妄想哀歌・はぐなど）": 1686481225,
    "2025年～（サイエンス・恋しくなったら手を叩こうなど）": 1734168615,
};

interface TestSettings {
    name: string;
    limit: number;
    includeRequestedSongs?: boolean;
    publishedAfter?: number;
}

function Start({ startCallback }: { startCallback?: () => void }) {
    return (
        <Flex direction="column" gap="lg" align="center">
            <Text>質問の結果をもとに、あなたへおすすめの曲を紹介します！</Text>
            <Button size="lg" radius="md" onClick={startCallback}>
                診断を始める
            </Button>
            <Button component={Link} href="/recommend/all-ranking" variant="subtle" color="gray">
                あなたの全曲ランキングを作る
            </Button>
        </Flex>
    );
}

function Prepare({
    proceedCallback,
    settings,
    setSettings,
}: {
    proceedCallback?: () => void;
    settings: TestSettings;
    setSettings: (settings: TestSettings) => void;
}) {
    return (
        <Flex direction="column" gap="lg" align="center">
            <Text>まず、いくつかの質問に答えてください。</Text>
            <Stack gap="lg">
                <TextInput
                    label="ニックネーム（結果を共有するときに公開されます）"
                    placeholder="ゲスト"
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.currentTarget.value })}
                />

                <Stack gap={0}>
                    <Text size="sm">診断の質問数</Text>
                    <Text size="xs" opacity={0.6} mb="xs">
                        右に行くほど正確に診断できますが、時間がかかります。
                    </Text>
                    <SegmentedControl
                        data={[
                            { label: "少なめ", value: "5" },
                            { label: "普通", value: "8" },
                            { label: "多め", value: "15" },
                            { label: "さらに多め", value: "20" },
                        ]}
                        defaultValue="8"
                        value={String(settings.limit)}
                        onChange={(value) => setSettings({ ...settings, limit: Number(value) })}
                    />
                </Stack>

                <Radio.Group
                    name="startFrom"
                    label="MIMIさんの楽曲で、知っているのはいつ頃からですか？"
                    value={String(settings.publishedAfter || "")}
                    onChange={(value) =>
                        setSettings({
                            ...settings,
                            publishedAfter: value ? Number(value) : undefined,
                        })
                    }
                >
                    <Stack gap="xs" mt="xs">
                        {Object.entries(songsPeriod).map(([label, timestamp]) => (
                            <Radio key={timestamp} value={String(timestamp)} label={label} />
                        ))}
                    </Stack>
                </Radio.Group>
                <Divider />
                <Checkbox
                    label="提供曲も質問に含める"
                    checked={settings.includeRequestedSongs}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            includeRequestedSongs: e.currentTarget.checked,
                        })
                    }
                />
            </Stack>
            <Button size="lg" radius="md" onClick={proceedCallback}>
                質問へ進む
            </Button>
        </Flex>
    );
}

function Choice({
    settings,
    backToPrepare,
}: {
    settings: TestSettings;
    backToPrepare: () => void;
}) {
    const songSearchParams = useMemo(() => {
        return {
            filter: {
                publishedAfter: settings?.publishedAfter,
                publishedType: settings?.includeRequestedSongs ? undefined : 1,
            },
            limit: settings.limit,
        };
    }, [settings]);
    const { songs } = useSampleSongs(songSearchParams);
    const router = useRouter();

    function navigateToResults(sortedSongIDs: string[]) {
        router.push(
            `/recommend/result?name=${encodeURIComponent(
                settings.name
            )}&timestamp=${Date.now()}&preferenceRanking=${sortedSongIDs.join(",")}`
        );
    }

    return (
        <>
            <SongPreferenceQuestion
                songs={songs}
                completedCallback={(sortedSongs) =>
                    navigateToResults(sortedSongs.map((song) => song.id))
                }
            />

            <Center>
                <Button mt="lg" variant="subtle" onClick={backToPrepare} color="orange">
                    設定に戻る
                </Button>
            </Center>
        </>
    );
}

export default function RecommendPage() {
    const [settings, setSettings] = useState<TestSettings>({
        name: "ゲスト",
        limit: 8,
        publishedAfter: Math.min(...Object.values(songsPeriod)),
        includeRequestedSongs: false,
    });
    const [status, setStatus] = useState<status>("start");

    return (
        <MyAppShell>
            <Title mb="xl">おすすめ曲診断</Title>
            <Paper shadow="md" radius="md" p="lg">
                {status === "start" && <Start startCallback={() => setStatus("prepare")} />}
                {status === "prepare" && (
                    <Prepare
                        proceedCallback={() => {
                            setStatus("choice");
                        }}
                        settings={settings}
                        setSettings={setSettings}
                    />
                )}
                {status === "choice" && (
                    <Choice settings={settings} backToPrepare={() => setStatus("prepare")} />
                )}
            </Paper>
        </MyAppShell>
    );
}
