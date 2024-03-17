import { Center, Space, Title } from '@mantine/core';
import { Suspense } from 'react';
import EditTeamLoading from './loading';

export default function EditTeamLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Center>
                <Title order={2}>Edit Team</Title>
            </Center>
            <Space h='md' />
            <Suspense fallback={<EditTeamLoading />}>{children}</Suspense>
        </>
    );
}
