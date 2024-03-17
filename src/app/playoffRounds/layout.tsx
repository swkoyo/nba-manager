import { Center, Space, Title } from '@mantine/core';
import { Suspense } from 'react';
import PlayoffRoundsLoading from './loading';

export default function PlayoffRoundsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Center>
                <Title order={1}>Browse Playoff Rounds</Title>
            </Center>
            <Space h='md' />
            <Suspense fallback={<PlayoffRoundsLoading />}>{children}</Suspense>
        </>
    );
}
