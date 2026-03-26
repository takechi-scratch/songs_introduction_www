import { Tooltip } from "@mantine/core";

export default function WarningTip({
    warning,
    children,
}: {
    warning: string | null;
    children: React.ReactNode;
}) {
    if (!warning) return children;

    return (
        <Tooltip label={warning} events={{ hover: true, focus: true, touch: true }}>
            <div>{children}</div>
        </Tooltip>
    );
}
