"use client";

import {
    Anchor,
    AnchorProps,
    Badge,
    BadgeProps,
    Button,
    ButtonProps,
    Card,
    CardProps,
    MenuItem,
    MenuItemProps,
} from "@mantine/core";
import Link from "next/link";

export function NextAnchor({
    children,
    href,
    ...props
}: { children: React.ReactNode; href: string } & AnchorProps &
    React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    return (
        <Anchor href={href} component={Link} {...props}>
            {children}
        </Anchor>
    );
}

export function NextLinkedButton({
    children,
    href,
    ...props
}: { children: React.ReactNode; href: string } & ButtonProps &
    React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    return (
        <Button href={href} component={Link} {...props}>
            {children}
        </Button>
    );
}

export function NextLinkedBadge({
    children,
    href,
    ...props
}: { children: React.ReactNode; href: string } & BadgeProps &
    React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    return (
        <Badge component={Link} href={href} {...props}>
            {children}
        </Badge>
    );
}

export function NextLinkedMenuItem({
    children,
    href,
    ...props
}: { children: React.ReactNode; href: string } & MenuItemProps &
    React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    return (
        <MenuItem component={Link} href={href} {...props}>
            {children}
        </MenuItem>
    );
}

export function NextLinkedCard({
    children,
    href,
    ...props
}: { children: React.ReactNode; href: string } & CardProps &
    React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    return (
        <Card component={Link} href={href} {...props}>
            {children}
        </Card>
    );
}
