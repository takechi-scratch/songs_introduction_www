"use client";

import { Flex, Title } from "@mantine/core";
import { motion } from "framer-motion";
import { useRef } from "react";

export function FadeInUp({ children, title }: { children: React.ReactNode; title: string }) {
    const ref = useRef<HTMLDivElement>(null);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="mb-16"
            style={{ height: 200 }}
        >
            <Flex align="center" direction="column" justify="center" style={{ height: "100%" }}>
                <Title order={2}>{title}</Title>
                {children}
            </Flex>
        </motion.div>
    );
}
