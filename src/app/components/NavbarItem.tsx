'use client';

import { Button } from '@mantine/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavbarItem({
    href,
    label,
}: {
    href: string;
    label: string;
}) {
    const pathname = usePathname();
    const isActive =
        href === '/' ? pathname === '/' : pathname.includes(href);
    return (
        <Button
            variant={isActive ? 'filled' : 'subtle'}
            component={Link}
            href={href}
        >
            {label}
        </Button>
    );
}
