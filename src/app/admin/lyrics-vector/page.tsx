"use client";

import AdminOnlyComponent from "@/components/adminOnly";
import MyAppShell from "@/components/appshell";
import { upsertLyricsVector } from "@/lib/songs/api";
import { UpsertLyricsVec } from "@/lib/songs/types";
import { Alert, Anchor, Button, JsonInput, TextInput, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconAlertTriangle } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function parseLyricsData(data: string): UpsertLyricsVec[] | null {
    let parsedData;
    try {
        parsedData = JSON.parse(data);
    } catch {
        return null;
    }

    if (!Array.isArray(parsedData)) return null;
    for (const item of parsedData as UpsertLyricsVec[]) {
        if (
            typeof item !== "object" ||
            item === null ||
            typeof item.id !== "string" ||
            !Array.isArray(item.lyricsVector) ||
            typeof item.lyricsOfficiallyReleased !== "boolean"
        ) {
            return null;
        }
    }
    return parsedData;
}

function UpdateLyricsVectorPage() {
    const [inputJson, setInputJson] = useState<string>("");
    const parsedData = parseLyricsData(inputJson);

    const router = useRouter();

    return (
        <>
            <Title mb="xl">歌詞ベクトル情報の更新</Title>
            <TextInput
                label="歌詞ベクトル情報"
                placeholder="ツールで生成されたJSONをここに貼り付けてください"
                value={inputJson}
                onChange={(e) => setInputJson(e.currentTarget.value || "")}
                mb="md"
            />
            {!parsedData && (
                <Alert mb="md" color="orange" icon={<IconAlertTriangle />}>
                    入力形式が正しくありません。
                </Alert>
            )}
            {parsedData && parsedData.length === 0 && (
                <Alert mb="md" color="orange" icon={<IconAlertTriangle />}>
                    データが入力されていません。
                </Alert>
            )}
            <Button
                disabled={!parsedData || parsedData.length === 0}
                color="blue"
                onClick={async () => {
                    try {
                        await upsertLyricsVector(parsedData ?? []);
                        showNotification({
                            title: "更新完了",
                            message: `${
                                parsedData?.length ?? 0
                            } 件の歌詞ベクトル情報を更新しました。`,
                            color: "green",
                        });
                        router.push("/");
                    } catch {
                        showNotification({
                            title: "更新失敗",
                            message: "歌詞ベクトル情報の更新に失敗しました。",
                            color: "red",
                        });
                    }
                }}
            >
                更新
            </Button>
        </>
    );
}

export default function Page() {
    return (
        <MyAppShell>
            <AdminOnlyComponent>
                <UpdateLyricsVectorPage />
                <Anchor
                    mt="lg"
                    component={Link}
                    href="/"
                    style={{ clear: "both", display: "block" }}
                >
                    ホームに戻る
                </Anchor>
            </AdminOnlyComponent>
        </MyAppShell>
    );
}
