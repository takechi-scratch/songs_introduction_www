import { DateInput } from "@mantine/dates";

export default function JapaneseDateInput({ ...props }: React.ComponentProps<typeof DateInput>) {
    return (
        <DateInput
            valueFormat="YYYY/MM/DD"
            monthLabelFormat="YYYY年 M月"
            styles={{ weekday: { fontSize: "80%" } }}
            locale="ja"
            firstDayOfWeek={0}
            {...props}
        />
    );
}
