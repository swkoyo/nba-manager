import { Center, Space, Title } from '@mantine/core';
import { Suspense } from 'react';
import EditPlayoffRoundLoading from './loading';

export default function EditPlayoffRoundLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Center>
                <Title order={2}>Edit Playoff Round</Title>
            </Center>
            <Space h='md' />
            <Suspense fallback={<EditPlayoffRoundLoading />}>
                {children}
            </Suspense>
        </>
    );
}
