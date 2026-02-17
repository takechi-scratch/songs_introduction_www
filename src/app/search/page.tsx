"use client";

import MyAppShell from "@/components/appshell";
import { SortableKeys } from "@/lib/search/filter";
import { CustomParams, specifiableParams } from "@/lib/search/nearest";
import {
    Title,
    Select,
    TextInput,
    Button,
    Text,
    SegmentedControl,
    Slider,
    Flex,
    NumberInput,
    Group,
    Accordion,
    Alert,
    Switch,
    Anchor,
} from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

// Do this once in your application root file
import dayjs from "dayjs";
import "dayjs/locale/ja";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

// Date関連のモジュールを使用する際は忘れずに追加
import "@mantine/dates/styles.css";
import JapaneseDateInput from "@/components/dateInput";
import WarningTip from "@/components/warningTip";
import { IconDatabaseStar, IconExclamationCircle, IconFilter } from "@tabler/icons-react";
import { SongFilters, SongSearchParams } from "@/lib/search/search";
import rison from "rison";
import Link from "next/link";

function FilterTextInput({
    filterableKey: key,
    example,
    displayName,
    searchParams,
    setSearchParams,
}: {
    filterableKey: keyof SongFilters;
    example: string;
    displayName: string;
    searchParams: SongSearchParams;
    setSearchParams: (params: SongSearchParams) => void;
}) {
    return (
        <TextInput
            key={key}
            label={
                <Text size="sm" style={{ width: 100 }}>
                    {displayName}
                </Text>
            }
            value={String(searchParams.filter?.[key] ?? "")}
            placeholder={example}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
            }}
            mb="xs"
            styles={{ wrapper: { width: "100%", maxWidth: 300 } }}
            onChange={(e) =>
                setSearchParams({
                    ...searchParams,
                    filter: {
                        ...searchParams.filter,
                        [key]: e.target.value !== "" ? e.target.value : undefined,
                    },
                })
            }
        />
    );
}

function FilterNumberInput({
    filterableKey: key,
    example,
    displayName,
    searchParams,
    setSearchParams,
}: {
    filterableKey: keyof SongFilters;
    example: string;
    displayName: string;
    searchParams: SongSearchParams;
    setSearchParams: (params: SongSearchParams) => void;
}) {
    return (
        <NumberInput
            key={key}
            label={
                <Text size="sm" style={{ width: 100 }}>
                    {displayName}
                </Text>
            }
            value={Number(searchParams.filter?.[key] ?? "")}
            placeholder={example}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
            }}
            mb="xs"
            styles={{ wrapper: { width: "100%", maxWidth: 300 } }}
            onChange={(e) =>
                setSearchParams({
                    ...searchParams,
                    filter: {
                        ...searchParams.filter,
                        [key]: e !== "" ? Number(e) : undefined,
                    },
                })
            }
        />
    );
}

function FilterTab({
    searchParams,
    setSearchParams,
}: {
    searchParams: SongSearchParams;
    setSearchParams: (params: SongSearchParams) => void;
}) {
    if (!searchParams.filter) {
        return (
            <Alert color="red" icon={<IconExclamationCircle />}>
                絞り込み条件が初期化されていません
            </Alert>
        );
    }

    return (
        <>
            <FilterTextInput
                filterableKey="id"
                displayName="動画のID"
                example="7xht3kQO_TM"
                searchParams={searchParams}
                setSearchParams={setSearchParams}
            />
            <FilterTextInput
                filterableKey="title"
                displayName="タイトル"
                example="ハナタバ"
                searchParams={searchParams}
                setSearchParams={setSearchParams}
            />
            <Select
                data={["すべて", "オリジナル曲", "提供曲"]}
                label={
                    <Text size="sm" style={{ width: 100 }}>
                        公開形式
                    </Text>
                }
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                }}
                mb="xs"
                styles={{ wrapper: { width: "100%", maxWidth: 300 } }}
                value={
                    searchParams.filter.publishedType !== undefined
                        ? { 1: "オリジナル曲", 0: "提供曲" }[searchParams.filter.publishedType]
                        : "すべて"
                }
                onChange={(value) => {
                    setSearchParams({
                        ...searchParams,
                        filter: {
                            ...searchParams.filter,
                            publishedType:
                                value !== null
                                    ? { すべて: undefined, オリジナル曲: 1, 提供曲: 0 }[value]
                                    : undefined,
                        },
                    });
                }}
            />
            <FilterTextInput
                filterableKey="vocal"
                displayName="ボーカル"
                example="初音ミク"
                searchParams={searchParams}
                setSearchParams={setSearchParams}
            />
            <FilterTextInput
                filterableKey="illustrations"
                displayName="イラスト等"
                example="ao"
                searchParams={searchParams}
                setSearchParams={setSearchParams}
            />
            <FilterTextInput
                filterableKey="movie"
                displayName="動画"
                example="瀬戸わらび"
                searchParams={searchParams}
                setSearchParams={setSearchParams}
            />
            <FilterTextInput
                filterableKey="comment"
                displayName="コメント"
                example="ノリが良い"
                searchParams={searchParams}
                setSearchParams={setSearchParams}
            />
            <FilterTextInput
                filterableKey="mainChord"
                displayName="主なコード進行"
                example="6451"
                searchParams={searchParams}
                setSearchParams={setSearchParams}
            />
            <FilterNumberInput
                filterableKey="mainKey"
                displayName="主なキー"
                example="60"
                searchParams={searchParams}
                setSearchParams={setSearchParams}
            />

            <Group gap="md" mt="sm" align="center" mb="md">
                <Text size="sm" style={{ width: 100 }}>
                    公開日時
                </Text>
                <Flex gap="sm" direction={{ base: "column", sm: "row" }} align="center">
                    <JapaneseDateInput
                        defaultValue={dayjs("2016/7/18").toDate()}
                        maxDate={
                            searchParams.filter.publishedBefore
                                ? dayjs.unix(searchParams.filter.publishedBefore).toDate()
                                : undefined
                        }
                        onChange={(date) =>
                            setSearchParams({
                                ...searchParams,
                                filter: {
                                    ...searchParams.filter,
                                    publishedAfter: date
                                        ? Math.floor(dayjs(date).valueOf() / 1000)
                                        : undefined,
                                },
                            })
                        }
                    />
                    ～
                    <JapaneseDateInput
                        defaultValue={dayjs().toDate()}
                        minDate={
                            searchParams.filter.publishedAfter
                                ? dayjs.unix(searchParams.filter.publishedAfter).toDate()
                                : undefined
                        }
                        onChange={(date) =>
                            setSearchParams({
                                ...searchParams,
                                filter: {
                                    ...searchParams.filter,
                                    publishedBefore: date
                                        ? Math.floor(dayjs(date).valueOf() / 1000) + 86400
                                        : undefined,
                                },
                            })
                        }
                    />
                </Flex>
            </Group>
            <Button
                color="red"
                onClick={() => {
                    setSearchParams({
                        ...searchParams,
                        filter: {},
                    });
                }}
            >
                絞り込み条件をクリア
            </Button>
        </>
    );
}

function NearestTab({
    searchParams,
    setSearchParams,
    enabled,
    setEnabled,
}: {
    searchParams: SongSearchParams;
    setSearchParams: (params: SongSearchParams) => void;
    enabled: boolean;
    setEnabled: (enabled: boolean) => void;
}) {
    return (
        <>
            <Switch
                label="類似度検索を有効にする"
                checked={enabled}
                onChange={(e) => {
                    setEnabled(e.currentTarget.checked);
                    if (e.currentTarget.checked && !searchParams.limit) searchParams.limit = 10;
                }}
                mb="lg"
            />
            <TextInput
                label="基準曲の動画のID"
                placeholder="7xht3kQO_TM"
                disabled={!enabled}
                defaultValue={searchParams.nearest?.targetSongID || ""}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                }}
                mb="lg"
                onChange={(e) =>
                    setSearchParams({
                        ...searchParams,
                        nearest: {
                            ...searchParams.nearest,
                            targetSongID: e.target.value,
                        },
                    })
                }
            />
            <Title order={3} mb="md">
                各スコアの重要度
            </Title>
            {specifiableParams.map((param) => (
                <Group key={param.key} gap="md" mb="md">
                    <Text size="sm" style={{ width: 120 }}>
                        {param.displayName}
                    </Text>
                    <Slider
                        key={param.key}
                        disabled={!enabled}
                        label={(value) => `${(value * 100).toFixed(0)}%`}
                        min={0}
                        max={2}
                        step={0.0005}
                        value={searchParams.nearest?.parameters?.[param.key] ?? param.default}
                        onChange={(value) =>
                            setSearchParams({
                                ...searchParams,
                                nearest: {
                                    targetSongID: searchParams.nearest?.targetSongID || "",
                                    parameters: {
                                        ...searchParams.nearest?.parameters,
                                        [param.key]: value,
                                    },
                                },
                            })
                        }
                        marks={[{ value: param.default }]}
                        style={{ flex: 1, maxWidth: "60%" }}
                    />
                </Group>
            ))}
            {/* <NumberInput
                label="ゲイン(a)"
                /> */}

            <Group mb="lg">
                <Button
                    disabled={!enabled}
                    onClick={() => {
                        setSearchParams({
                            ...searchParams,
                            nearest: {
                                targetSongID: searchParams.nearest?.targetSongID || "",
                                parameters: specifiableParams.reduce(
                                    (acc, content) => {
                                        acc[content.key] = content.default;
                                        return acc;
                                    },
                                    {} as CustomParams["parameters"]
                                ),
                            },
                        });
                    }}
                >
                    デフォルト値
                </Button>
                <Button
                    disabled={!enabled}
                    onClick={() => {
                        setSearchParams({
                            ...searchParams,
                            nearest: {
                                targetSongID: searchParams.nearest?.targetSongID || "",
                                parameters: specifiableParams.reduce(
                                    (acc, content) => {
                                        acc[content.key] = 0;
                                        return acc;
                                    },
                                    {} as CustomParams["parameters"]
                                ),
                            },
                        });
                    }}
                >
                    すべて0
                </Button>
            </Group>
        </>
    );
}

function AdvancedSearch() {
    const params = useSearchParams();
    const router = useRouter();

    const [songSearchParams, setSongSearchParams] = useState<SongSearchParams>(() => {
        const paramsText = params.get("params");
        const songSearchParams: SongSearchParams = {
            filter: {},
            limit: undefined,
            order: "publishedTimestamp",
            asc: false,
        };
        if (paramsText) {
            try {
                return {
                    ...songSearchParams,
                    ...rison.decode_object(paramsText),
                };
            } catch (e) {
                console.warn("Failed to decode search params from URL. Error:", e);
            }
        }
        return songSearchParams;
    });

    const [nearestEnabled, setNearestEnabled] = useState(!!songSearchParams.nearest);

    return (
        <>
            <TextInput
                label={
                    <Text size="sm" style={{ width: 100 }}>
                        キーワード
                    </Text>
                }
                placeholder="まころん 桜 | 星"
                value={songSearchParams.q || ""}
                onChange={(e) =>
                    setSongSearchParams({ ...songSearchParams, q: e.target.value || undefined })
                }
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                }}
                styles={{ wrapper: { width: "100%", maxWidth: 500 } }}
                ml="md"
                mb="md"
            />
            <Accordion multiple defaultValue={["filter", "nearest"]} mb="xl">
                <Accordion.Item value="filter">
                    <Accordion.Control icon={<IconFilter color="#82c91e" />}>
                        <Title order={3} fw={300}>
                            絞り込み
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <FilterTab
                            searchParams={songSearchParams}
                            setSearchParams={setSongSearchParams}
                        />
                    </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item value="nearest">
                    <Accordion.Control icon={<IconDatabaseStar color="#228be6" />}>
                        <Title order={3} fw={300}>
                            似ている曲
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <NearestTab
                            searchParams={songSearchParams}
                            setSearchParams={setSongSearchParams}
                            enabled={nearestEnabled}
                            setEnabled={setNearestEnabled}
                        />
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
            <NumberInput
                label="結果の曲数"
                defaultValue={
                    !songSearchParams.limit && nearestEnabled ? 10 : songSearchParams.limit
                }
                value={songSearchParams.limit}
                onChange={(value) =>
                    setSongSearchParams({
                        ...songSearchParams,
                        limit: value !== "" ? Number(value) : undefined,
                    })
                }
                min={1}
                step={1}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                }}
                mb="md"
            />
            <Select
                data={nearestEnabled ? ["類似度順"] : Object.keys(SortableKeys)}
                disabled={nearestEnabled}
                value={nearestEnabled ? "類似度順" : undefined}
                label="並び替え"
                defaultValue="公開日時"
                mt="md"
                onChange={(value) => {
                    if (nearestEnabled) return;
                    setSongSearchParams({
                        ...songSearchParams,
                        order: value ? SortableKeys[value as keyof typeof SortableKeys] : "",
                    });
                }}
            />
            <SegmentedControl
                data={["昇順", "降順"]}
                mt="sm"
                defaultValue="降順"
                onChange={(value) =>
                    setSongSearchParams({ ...songSearchParams, asc: value === "昇順" })
                }
            />
            <WarningTip
                warning={
                    nearestEnabled && !songSearchParams.nearest?.targetSongID
                        ? "基準曲のIDを入力してください"
                        : null
                }
            >
                <Button
                    fullWidth
                    data-disabled={!songSearchParams.nearest?.targetSongID && nearestEnabled}
                    mt="md"
                    onClick={() => {
                        if (
                            // 0が入力になることもあるので厳密にチェック
                            Object.values(songSearchParams.filter || {}).filter(
                                (v) => v !== undefined && v !== null && v !== ""
                            ).length === 0
                        ) {
                            delete songSearchParams.filter;
                        }
                        if (!nearestEnabled) delete songSearchParams.nearest;
                        if (!songSearchParams.asc) delete songSearchParams.asc;
                        if (
                            !songSearchParams.order ||
                            songSearchParams.order === "publishedTimestamp" ||
                            nearestEnabled
                        )
                            delete songSearchParams.order;
                        // undefinedのプロパティを削除
                        const cleanParams = JSON.parse(JSON.stringify(songSearchParams));
                        const encodedParams = rison.encode_object(cleanParams);
                        router.push(`/songs/?params=${encodedParams}`);
                    }}
                >
                    検索
                </Button>
            </WarningTip>
        </>
    );
}

export default function Page() {
    return (
        <MyAppShell>
            <Title order={2} mb="md">
                詳細検索
            </Title>
            <Suspense fallback={<Text>読み込み中...</Text>}>
                <AdvancedSearch />
            </Suspense>
            <Group mt="xl" gap="xl">
                <Anchor component={Link} href="/search/">
                    すべての条件をクリア
                </Anchor>
                <Anchor component={Link} href="/songs/">
                    曲一覧に戻る
                </Anchor>
            </Group>
        </MyAppShell>
    );
}
