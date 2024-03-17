'use client';

import { Alert, Center, Loader, Space, Title } from '@mantine/core';
import RosterForm from '../rosterForm';
import { useAvailable } from '@/app/swr';

export default function AddNewRoster() {
    const { data, isLoading, error } = useAvailable();

    if (error) {
        return (
            <Center>
                <Alert color='red' title='Error'>
                    An error occured while retrieving data: {error.message}
                </Alert>
            </Center>
        );
    }

    if (isLoading || !data) {
        return (
            <Center>
                <Loader />
            </Center>
        );
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
