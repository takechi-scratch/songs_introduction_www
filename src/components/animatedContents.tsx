"use client";

import { alpha, Anchor, Box, Card, Group, Text, Title } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

export function FadeInUp({
    title,
    icon,
    description,
    backgroundColor,
    href,
}: {
    title: string;
    icon: React.ReactNode;
    description: string;
    backgroundColor?: string;
    href?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const { hovered, ref: hoverRef } = useHover();

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            style={{ flex: 1 }}
        >
            <Card
                shadow={href ? "sm" : undefined}
                withBorder={href ? undefined : true}
                p={0}
                radius="md"
                component={href ? Link : undefined}
                href={href || "#"}
                style={{ height: "100%" }}
            >
                <Box
                    ref={hoverRef}
                    w="100%"
                    h="100%"
                    bg={
                        backgroundColor
                            ? alpha(backgroundColor, href && hovered ? 0.4 : 0.2)
                            : undefined
                    }
                    p="lg"
                >
                    <Group mb="sm">
                        {icon}
                        {href ? (
                            <Anchor component={Title} order={2} style={{ flex: 1 }}>
                                {title}
                            </Anchor>
                        ) : (
                            <Title order={2} style={{ flex: 1 }}>
                                {title}
                            </Title>
                        )}
                    </Group>
                    {description.split(/\n/g).map((line, i) => (
                        <Text key={i} mb="xs">
                            {line}
                        </Text>
                    ))}
                </Box>
            </Card>
        </motion.div>
    );
}
