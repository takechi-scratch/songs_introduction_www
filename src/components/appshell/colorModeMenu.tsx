import { useColorMode } from "@/contexts/ThemeContext";
import { ColorMode, ColorThemes } from "@/lib/themes";
import { Menu } from "@mantine/core";
import { IconCheck, IconPalette } from "@tabler/icons-react";

function ColorModeItem({
    theme,
    colorMode,
    setColorMode,
}: {
    theme: (typeof ColorThemes)[keyof typeof ColorThemes];
    colorMode: ColorMode;
    setColorMode: (value: ColorMode) => void;
}) {
    return (
        <Menu.Item
            key={theme.value}
            onClick={() => setColorMode(theme.value)}
            rightSection={colorMode === theme.value ? <IconCheck size={14} /> : null}
        >
            {theme.label}
        </Menu.Item>
    );
}

export default function ColorModeMenu({ submenu = false }: { submenu?: boolean }) {
    const { colorMode, setColorMode } = useColorMode();

    const lightThemes = Object.values(ColorThemes)
        .filter((theme) => theme.mantineScheme === "light")
        .map((theme) => (
            <ColorModeItem
                key={theme.value}
                theme={theme}
                colorMode={colorMode}
                setColorMode={setColorMode}
            />
        ));
    const DarkThemes = Object.values(ColorThemes)
        .filter((theme) => theme.mantineScheme === "dark")
        .map((theme) => (
            <ColorModeItem
                key={theme.value}
                theme={theme}
                colorMode={colorMode}
                setColorMode={setColorMode}
            />
        ));

    // TODO: 実機環境でちゃんと開けるか確認
    if (submenu) {
        return (
            <Menu.Sub shadow="md" width={200} onOpen={() => console.log("opened")}>
                <Menu.Sub.Target>
                    <Menu.Sub.Item hiddenFrom="sm">テーマを変更</Menu.Sub.Item>
                </Menu.Sub.Target>

                <Menu.Sub.Dropdown>
                    <ColorModeItem
                        theme={ColorThemes.auto}
                        colorMode={colorMode}
                        setColorMode={setColorMode}
                    />
                    <Menu.Divider />
                    <Menu.Label>ライトテーマ</Menu.Label>
                    {lightThemes}
                    <Menu.Divider />
                    <Menu.Label>ダークテーマ</Menu.Label>
                    {DarkThemes}
                </Menu.Sub.Dropdown>
            </Menu.Sub>
        );
    }

    return (
        <Menu shadow="md" width={200} closeOnItemClick={false}>
            <Menu.Target>
                <IconPalette color="#be4bdb" />
            </Menu.Target>

            <Menu.Dropdown>
                <ColorModeItem
                    theme={ColorThemes.auto}
                    colorMode={colorMode}
                    setColorMode={setColorMode}
                />
                <Menu.Divider />
                <Menu.Label>ライトテーマ</Menu.Label>
                {lightThemes}
                <Menu.Divider />
                <Menu.Label>ダークテーマ</Menu.Label>
                {DarkThemes}
            </Menu.Dropdown>
        </Menu>
    );
}
