import MyAppShell from "@/components/appshell/myAppshell";
import { NextAnchor } from "@/components/nextLink";
import { Card, Grid, GridCol, Text, Title } from "@mantine/core";
import { CollectionsData } from "./collections";

export default function CollectionsList() {
    return (
        <MyAppShell>
            <Title order={2} mb="md">
                コレクション一覧
            </Title>
            <Grid gap="md">
                {CollectionsData.map((collection) => (
                    <GridCol key={collection.slug} span={{ base: 12, sm: 6, lg: 4 }}>
                        <Card
                            shadow="sm"
                            p="lg"
                            radius="sm"
                            component={NextAnchor}
                            href={`/collections/${collection.slug}`}
                        >
                            <Text fw={500} size="lg" mb="xs">
                                {collection.title}
                            </Text>
                            <Text lineClamp={1} size="sm" opacity={0.6}>
                                {collection.description}
                            </Text>
                        </Card>
                    </GridCol>
                ))}
            </Grid>
        </MyAppShell>
    );
}
