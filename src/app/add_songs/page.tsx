"use client";

import MyAppShell from "@/components/appshell";
import { useAuth } from "@/contexts/AuthContext";
import { Title, Text, Button, Group, TextInput, SegmentedControl, Divider } from "@mantine/core";
import Link from "next/link";
import { useForm } from "@mantine/form";

// useを使えーって出るときは、引数部分をPromiseで囲む！
export default function DocsPage() {
    const { user } = useAuth();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            email: "",
            termsOfService: false,
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
        },
    });

    if (!user) {
        return (
            <MyAppShell>
                <Title mb="lg">曲の追加</Title>
                <Text mb="md">曲の追加は現在管理者のみが行えます。</Text>
                <Link href="/">トップページへ</Link>
            </MyAppShell>
        );
    }

    return (
        <MyAppShell>
            <Title mb="lg">曲の追加</Title>
            <form onSubmit={form.onSubmit((values) => console.log(values))}>
                <TextInput
                    withAsterisk
                    label="曲の動画ID"
                    placeholder="id-test"
                    key={form.key("videoId")}
                    mb="sm"
                    {...form.getInputProps("videoId")}
                />

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

                {/* <TextInput
                    withAsterisk
                    label="Email"
                    placeholder="your@email.com"
                    key={form.key("email")}
                    {...form.getInputProps("email")}
                />

                <Checkbox
                    mt="md"
                    label="I agree to sell my privacy"
                    key={form.key("termsOfService")}
                    {...form.getInputProps("termsOfService", { type: "checkbox" })}
                /> */}

                <Group justify="flex-end" mt="md">
                    <Button type="submit">Submit</Button>
                </Group>
            </form>
        </MyAppShell>
    );
}
