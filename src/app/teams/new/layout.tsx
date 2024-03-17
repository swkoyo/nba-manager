import { Center, Space, Title } from '@mantine/core';
import { Suspense } from 'react';
import NewTeamLoading from './loading';

export default function NewTeamLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Center>
                <Title order={2}>Add New Team</Title>
            </Center>
            <Space h='md' />
            <Suspense fallback={<NewTeamLoading />}>{children}</Suspense>
        </>
    );
}
