import { Center, Space, Title } from '@mantine/core';
import { Suspense } from 'react';
import EditRosterLoading from './loading';

export default function EditRosterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Center>
                <Title order={2}>Edit Roster</Title>
            </Center>
            <Space h='md' />
            <Suspense fallback={<EditRosterLoading />}>{children}</Suspense>
        </>
    );
}
