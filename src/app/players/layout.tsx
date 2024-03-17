import { Center, Space, Title } from '@mantine/core';
import { Suspense } from 'react';
import PlayersLoading from './loading';

export default function PlayersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Center>
                <Title order={1}>Browse Players</Title>
            </Center>
            <Space h='md' />
            <Suspense fallback={<PlayersLoading />}>{children}</Suspense>
        </>
    );
}
