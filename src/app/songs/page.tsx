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
    Alert,
    Group,
} from "@mantine/core";
import { IconZoomExclamation } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useRef, useState } from "react";
import { useUserRole } from "@/hooks/auth";

// Do this once in your application root file
import dayjs from "dayjs";
import "dayjs/locale/ja";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

// Date関連のモジュールを使用する際は忘れずに追加
import "@mantine/dates/styles.css";
import JapaneseDateInput from "@/components/dateInput";
import { confirmModal, fallbackNotifications } from "@/components/playlistHandler";
import SongsSlot from "@/components/songCards/cardsSlot";
import { usePlaylistManager } from "@/hooks/playlist";
import { notifications } from "@mantine/notifications";
import WarningTip from "@/components/warningTip";

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

            <Group gap="md" mt="sm" align="center">
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
            </Group>

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
                <Group key={param.key} gap="md" mb="md">
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
                </Group>
            ))}
            {/* <NumberInput
                label="ゲイン(a)"
                /> */}

            <Group mb="lg">
                <Button
                    onClick={() => {
                        setCustomParams({
                            ...customParams,
                            parameters: specifiableParams.reduce(
                                (acc, content) => {
                                    acc[content.key] = content.default;
                                    return acc;
                                },
                                {} as CustomParams["parameters"]
                            ),
                        });
                    }}
                >
                    デフォルト値
                </Button>
                <Button
                    onClick={() => {
                        setCustomParams({
                            ...customParams,
                            parameters: specifiableParams.reduce(
                                (acc, content) => {
                                    acc[content.key] = 0;
                                    return acc;
                                },
                                {} as CustomParams["parameters"]
                            ),
                        });
                    }}
                >
                    すべて0
                </Button>
            </Group>
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
            <WarningTip warning={!customParams.target_song_id ? "IDを入力してください" : null}>
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
            </WarningTip>
        </>
    );
}

function ActionButtons({
    songs,
    slotsActive,
    setSlotsActive,
    searchType,
    searchQuery,
    customParams,
}: {
    songs: (Song | SongWithScore | null)[];
    slotsActive: boolean;
    setSlotsActive: React.Dispatch<React.SetStateAction<boolean>>;
    searchType: "filter" | "nearest";
    searchQuery: SearchQuery;
    customParams: CustomParams;
}) {
    const userRole = useUserRole();

    const notificationID = useRef<string | null>(null);
    const { loadingPlaylist, validSongs, createFromSearchQuery } = usePlaylistManager(
        songs,
        async () => await confirmModal(validSongs.length > 30),
        () => {
            const id = notifications.show({
                loading: true,
                title: "再生リストを作成中...",
                message: "作成完了まで数秒～数十秒かかります。しばらくお待ちください。",
                autoClose: false,
                withCloseButton: false,
            });
            notificationID.current = id;
        },
        (result) => {
            if (notificationID.current) fallbackNotifications(result, notificationID.current);
        }
    );

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
            <WarningTip warning={userRole === "guest" ? "ログインすると利用できます" : null}>
                <Button
                    fullWidth
                    color="red"
                    variant="light"
                    loading={loadingPlaylist}
                    disabled={userRole === "guest"}
                    onClick={() => createFromSearchQuery(searchType, searchQuery, customParams)}
                >
                    検索結果から再生リストを作成
                </Button>
            </WarningTip>
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
        limit: 30,
        parameters: specifiableParams.reduce(
            (acc, content) => {
                acc[content.key as keyof Song] = content.default;
                return acc;
            },
            {} as CustomParams["parameters"]
        ),
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
                            slotsActive={slotsActive}
                            setSlotsActive={setSlotsActive}
                            searchType={searchType}
                            searchQuery={searchQuery}
                            customParams={customParams}
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
