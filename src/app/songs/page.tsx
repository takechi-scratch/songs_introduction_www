"use client";

import MyAppShell from "@/components/appshell";
import CardsList from "@/components/songCards/cardsList";
import { useSongs } from "@/hooks/songs";
import { FilterableContents, SearchQuery, SortableKeys } from "@/lib/search/filter";
import { CustomParams, specifiableParams } from "@/lib/search/nearest";
import { Song, SongWithScore } from "@/lib/songs/types";
import {
    Title,
    Tabs,
    Accordion,
    Select,
    TextInput,
    Button,
    Text,
    SegmentedControl,
    Slider,
    Flex,
    NumberInput,
    Tooltip,
    Alert,
} from "@mantine/core";
import { IconZoomExclamation } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useUserRole } from "@/hooks/auth";

// Do this once in your application root file
import dayjs from "dayjs";
import "dayjs/locale/ja";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

// Date関連のモジュールを使用する際は忘れずに追加
import "@mantine/dates/styles.css";
import JapaneseDateInput from "@/components/dateInput";
import { confirmModal, playlistHandler } from "./playlistHandler";
import SongsSlot from "@/components/songCards/cardsSlot";

function FilterTab({
    searchQuery,
    setSearchType,
    setSearchQuery,
    refetch,
}: {
    searchQuery: SearchQuery;
    setSearchType: (type: "filter" | "nearest") => void;
    setSearchQuery: (query: SearchQuery) => void;
    refetch: () => void;
}) {
    return (
        <>
            {FilterableContents.map((content) => {
                if (content.selectLabel && content.selectValue) {
                    return (
                        <Select
                            key={content.key}
                            data={content.selectLabel}
                            label={
                                <Text size="sm" style={{ width: 100 }}>
                                    {content.displayName}
                                </Text>
                            }
                            placeholder={content.example}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                            }}
                            mb="xs"
                            styles={{ wrapper: { width: "100%", maxWidth: 300 } }}
                            onChange={(value) => {
                                if (content.selectValue && value) {
                                    setSearchQuery({
                                        ...searchQuery,
                                        [content.key]: content.selectValue[value],
                                    });
                                }
                            }}
                        />
                    );
                } else {
                    return (
                        <TextInput
                            key={content.key}
                            label={
                                <Text size="sm" style={{ width: 100 }}>
                                    {content.displayName}
                                </Text>
                            }
                            value={String(searchQuery[content.key])}
                            placeholder={content.example}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                            }}
                            mb="xs"
                            styles={{ wrapper: { width: "100%", maxWidth: 300 } }}
                            onChange={(e) =>
                                setSearchQuery({ ...searchQuery, [content.key]: e.target.value })
                            }
                        />
                    );
                }
            })}

            <Flex gap="md" mt="sm" align="center">
                <Text size="sm" style={{ width: 100 }}>
                    公開日時
                </Text>
                <Flex gap="sm" direction={{ base: "column", sm: "row" }} align="center">
                    <JapaneseDateInput
                        defaultValue={dayjs("2016/7/18").toDate()}
                        maxDate={
                            searchQuery.publishedBefore
                                ? dayjs.unix(searchQuery.publishedBefore).toDate()
                                : undefined
                        }
                        onChange={(date) =>
                            setSearchQuery({
                                ...searchQuery,
                                publishedAfter: date
                                    ? Math.floor(dayjs(date).valueOf() / 1000)
                                    : undefined,
                            })
                        }
                    />
                    ～
                    <JapaneseDateInput
                        defaultValue={dayjs().toDate()}
                        minDate={
                            searchQuery.publishedAfter
                                ? dayjs.unix(searchQuery.publishedAfter).toDate()
                                : undefined
                        }
                        onChange={(date) =>
                            setSearchQuery({
                                ...searchQuery,
                                publishedBefore: date
                                    ? Math.floor(dayjs(date).valueOf() / 1000) + 86400
                                    : undefined,
                            })
                        }
                    />
                </Flex>
            </Flex>

            <Select
                data={Object.keys(SortableKeys)}
                label="並び替え"
                defaultValue="公開日時"
                mt="md"
                onChange={(value) =>
                    setSearchQuery({
                        ...searchQuery,
                        order: value ? SortableKeys[value as keyof typeof SortableKeys] : "",
                    })
                }
            />
            <SegmentedControl
                data={["昇順", "降順"]}
                mt="sm"
                defaultValue="降順"
                onChange={(value) => setSearchQuery({ ...searchQuery, asc: value === "昇順" })}
            />
            <Button
                fullWidth
                mt="md"
                onClick={() => {
                    setSearchType("filter");
                    setSearchQuery(searchQuery);
                    refetch();
                }}
            >
                検索
            </Button>
        </>
    );
}

function SearchWarningTip({
    warning,
    children,
}: {
    warning: string | null;
    children: React.ReactNode;
}) {
    if (!warning) return children;

    return (
        <Tooltip label={warning}>
            <div>{children}</div>
        </Tooltip>
    );
}

function NearestTab({
    customParams,
    setSearchType,
    setCustomParams,
    refetch,
}: {
    customParams: CustomParams;
    setSearchType: (type: "filter" | "nearest") => void;
    setCustomParams: (params: CustomParams) => void;
    refetch: () => void;
}) {
    return (
        <>
            <TextInput
                label="基準曲の動画のID"
                placeholder="7xht3kQO_TM"
                defaultValue={customParams.target_song_id}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                }}
                mb="lg"
                onChange={(e) =>
                    setCustomParams({ ...customParams, target_song_id: e.target.value })
                }
            />
            <Title order={3} mb="md">
                各スコアの重要度
            </Title>
            {specifiableParams.map((param) => (
                <Flex key={param.key} gap="md" mb="md">
                    {/* style={{ maxWidth: "60%", minWidth: 20 }} */}
                    <Text size="sm" style={{ width: 120 }}>
                        {param.displayName}
                    </Text>
                    <Slider
                        key={param.key}
                        label={(value) => `${(value * 100).toFixed(0)}%`}
                        min={0}
                        max={2}
                        step={0.0005}
                        value={customParams.parameters?.[param.key] ?? param.default}
                        onChange={(value) =>
                            setCustomParams({
                                ...customParams,
                                parameters: {
                                    ...customParams.parameters,
                                    [param.key]: value,
                                },
                            })
                        }
                        marks={[{ value: param.default }]}
                        style={{ flex: 1, maxWidth: "60%" }}
                    />
                </Flex>
            ))}
            {/* <NumberInput
                label="ゲイン(a)"
                /> */}

            <Flex gap="md" mb="lg">
                <Button
                    onClick={() => {
                        setCustomParams({
                            ...customParams,
                            parameters: specifiableParams.reduce((acc, content) => {
                                acc[content.key] = content.default;
                                return acc;
                            }, {} as CustomParams["parameters"]),
                        });
                    }}
                >
                    デフォルト値
                </Button>
                <Button
                    onClick={() => {
                        setCustomParams({
                            ...customParams,
                            parameters: specifiableParams.reduce((acc, content) => {
                                acc[content.key] = 0;
                                return acc;
                            }, {} as CustomParams["parameters"]),
                        });
                    }}
                >
                    すべて0
                </Button>
            </Flex>
            <NumberInput
                label="結果の件数"
                value={customParams.limit}
                onChange={(value) =>
                    setCustomParams({ ...customParams, limit: Number(value || 0) })
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
            <SegmentedControl
                data={["昇順", "降順"]}
                mt="sm"
                defaultValue="降順"
                onChange={(value) =>
                    setCustomParams({ ...customParams, is_reversed: value === "昇順" })
                }
            />
            <SearchWarningTip
                warning={!customParams.target_song_id ? "IDを入力してください" : null}
            >
                <Button
                    fullWidth
                    data-disabled={!customParams.target_song_id}
                    mt="md"
                    onClick={(event) => {
                        if (!customParams.target_song_id) {
                            event.preventDefault();
                            return;
                        }
                        setSearchType("nearest");
                        setCustomParams(customParams);
                        refetch();
                    }}
                >
                    検索
                </Button>
            </SearchWarningTip>
        </>
    );
}

function ActionButtons({
    songs,
    playlistHandler,
    slotsActive,
    setSlotsActive,
}: {
    songs: (Song | SongWithScore | null)[];
    playlistHandler: (setLoadingPlaylist: React.Dispatch<React.SetStateAction<boolean>>) => void;
    slotsActive: boolean;
    setSlotsActive: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const userRole = useUserRole();
    const [loadingPlaylist, setLoadingPlaylist] = useState(false);

    return (
        <Flex
            direction={{ base: "column", sm: "row" }}
            justify="center"
            m="md"
            gap={{ base: "sm", sm: "lg" }}
        >
            <Button
                fullWidth
                color="cyan"
                variant="light"
                onClick={() => {
                    setSlotsActive(() => !slotsActive);
                }}
            >
                {slotsActive ? "ルーレットを閉じる" : "検索結果でルーレットを回す"}
            </Button>
            {userRole === "admin" && (
                <Button
                    fullWidth
                    color="red"
                    variant="light"
                    loading={loadingPlaylist}
                    onClick={() =>
                        confirmModal(() => playlistHandler(setLoadingPlaylist), songs.length > 30)
                    }
                >
                    検索結果から再生リストを作成
                </Button>
            )}
        </Flex>
    );
}

function MainPage() {
    const searchParams = useSearchParams();
    const searchTypeInParams = searchParams.get("type");
    const targetSongIDInParams = searchParams.get("targetSongID");

    const [searchType, setSearchType] = useState<"filter" | "nearest">(
        searchTypeInParams === "nearest" && targetSongIDInParams ? "nearest" : "filter"
    );
    const [searchQuery, setSearchQuery] = useState<SearchQuery>(
        Object.fromEntries(
            FilterableContents.map((content) => [content.key, searchParams.get(content.key) ?? ""])
        )
    );
    const [customParams, setCustomParams] = useState<CustomParams>({
        target_song_id: searchParams.get("targetSongID") || undefined,
        limit: 10,
        parameters: specifiableParams.reduce((acc, content) => {
            acc[content.key as keyof Song] = content.default;
            return acc;
        }, {} as CustomParams["parameters"]),
    });
    const { songs, loading, error, refetch } = useSongs(searchType, searchQuery, customParams);
    const [slotsActive, setSlotsActive] = useState(false);

    return (
        <>
            <Accordion variant="separated" m="md" defaultValue={searchTypeInParams ? "検索" : null}>
                <Accordion.Item key="検索" value="検索">
                    <Accordion.Control icon="🔍">検索</Accordion.Control>
                    <Accordion.Panel>
                        <Tabs defaultValue={searchType}>
                            <Tabs.List grow justify="center" mb="md">
                                <Tabs.Tab value="filter">絞り込み</Tabs.Tab>
                                <Tabs.Tab value="nearest">似ている曲</Tabs.Tab>
                            </Tabs.List>
                            <Tabs.Panel value="filter">
                                <FilterTab
                                    searchQuery={searchQuery}
                                    setSearchType={setSearchType}
                                    setSearchQuery={setSearchQuery}
                                    refetch={refetch}
                                />
                            </Tabs.Panel>
                            <Tabs.Panel value="nearest">
                                <NearestTab
                                    customParams={customParams}
                                    setSearchType={setSearchType}
                                    setCustomParams={setCustomParams}
                                    refetch={refetch}
                                />
                            </Tabs.Panel>
                        </Tabs>
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
            {!error ? (
                <>
                    {songs !== null && songs.length > 0 && (
                        <ActionButtons
                            songs={songs}
                            playlistHandler={(setLoadingPlaylist) =>
                                playlistHandler(
                                    songs,
                                    searchType,
                                    searchQuery,
                                    customParams,
                                    setLoadingPlaylist
                                )
                            }
                            slotsActive={slotsActive}
                            setSlotsActive={setSlotsActive}
                        />
                    )}
                    {!loading && searchType === "filter" && (
                        <Text size="sm" ta="right" m="md">
                            検索結果: {songs.length}曲
                        </Text>
                    )}
                    {slotsActive ? <SongsSlot songs={songs} /> : <CardsList songs={songs} />}
                </>
            ) : (
                <Alert
                    icon={<IconZoomExclamation />}
                    title="エラーが発生しました"
                    color="red"
                    m="md"
                >
                    {error}
                </Alert>
            )}
        </>
    );
}

export default function Page() {
    return (
        <MyAppShell>
            <Title order={2} mb="md">
                曲一覧
            </Title>
            <Suspense fallback={<>loading params...</>}>
                <MainPage />
            </Suspense>
        </MyAppShell>
    );
}
