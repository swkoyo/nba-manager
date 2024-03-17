import { Center, Space, Title } from '@mantine/core';
import { Suspense } from 'react';
import NewPlayoffRoundLoading from './loading';

export default function NewPlayoffRoundLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Center>
                <Title order={2}>Add New Playoff Round</Title>
            </Center>
            <Space h='md' />
            <Suspense fallback={<NewPlayoffRoundLoading />}>
                {children}
            </Suspense>
        </>
    );
}
