import { Center, Space, Title } from '@mantine/core';
import { Suspense } from 'react';
import TeamsLoading from './loading';

export default function TeamsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Center>
                <Title order={1}>Browse Teams</Title>
            </Center>
            <Space h='md' />
            <Suspense fallback={<TeamsLoading />}>{children}</Suspense>
        </>
    );
}
