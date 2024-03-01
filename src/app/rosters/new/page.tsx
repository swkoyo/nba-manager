'use client';

import { Center, Space, Title } from '@mantine/core';
import RosterForm from '../rosterForm';
import { useAvailable } from '@/app/swr';

export default function AddNewRoster() {
    const { data, isLoading, error } = useAvailable();

    if (error) return <div>Error</div>;

    if (isLoading || !data) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Center>
                <Title order={1}>Add New Roster</Title>
            </Center>
            <Space h='md' />
            <RosterForm
                players={data.players}
                teams={data.teams}
                playoffRounds={data.playoffRounds}
            />
        </>
    );
}
