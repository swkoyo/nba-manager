import { Center, Space, Title } from '@mantine/core';
import { Suspense } from 'react';
import RostersLoading from './loading';

export default function RostersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Center>
                <Title order={1}>Browse Rosters</Title>
            </Center>
            <Space h='md' />
            <Suspense fallback={<RostersLoading />}>{children}</Suspense>
        </>
    );
}
