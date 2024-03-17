import { Center, Space, Title } from '@mantine/core';
import { Suspense } from 'react';
import NewPlayerLoading from './loading';

export default function NewPlayerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Center>
                <Title order={2}>Add New Player</Title>
            </Center>
            <Space h='md' />
            <Suspense fallback={<NewPlayerLoading />}>{children}</Suspense>
        </>
    );
}
