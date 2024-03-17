import { Center, Space, Title } from '@mantine/core';
import { Suspense } from 'react';
import EditPlayerLoading from './loading';

export default function EditPlayerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Center>
                <Title order={2}>Edit Player</Title>
            </Center>
            <Space h='md' />
            <Suspense fallback={<EditPlayerLoading />}>{children}</Suspense>
        </>
    );
}
