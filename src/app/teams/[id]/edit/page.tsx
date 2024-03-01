'use client';

import { Center, Space, Title } from '@mantine/core';
import TeamForm from '../../teamForm';
import { useTeam } from '@/app/swr';

export default function EditTeamPage({ params }: { params: { id: number } }) {
    const { data, isLoading, error } = useTeam(params.id);

    if (error) {
        return <div>Error</div>;
    }

    if (isLoading || !data) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Center>
                <Title order={1}>Edit Team</Title>
            </Center>
            <Space h='md' />
            <TeamForm team={data} />
        </>
    );
}
