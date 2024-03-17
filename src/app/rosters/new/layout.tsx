import { Center, Space, Title } from '@mantine/core';
import { Suspense } from 'react';
import NewRosterLoading from './loading';

export default function NewRosterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Center>
                <Title order={2}>Add New Roster</Title>
            </Center>
            <Space h='md' />
            <Suspense fallback={<NewRosterLoading />}>{children}</Suspense>
        </>
    );
}
