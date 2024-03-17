'use client';

import { Alert, Center, Loader, Space, Title } from '@mantine/core';
import RosterForm from '../../rosterForm';
import { useAvailable, useRoster } from '@/app/swr';

export default function EditRosterPage({ params }: { params: { id: number } }) {
    const {
        data: roster,
        isLoading: rosterIsLoading,
        error: rosterError,
    } = useRoster(params.id);
    const {
        data: available,
        isLoading: availableIsLoading,
        error: availableError,
    } = useAvailable();

    if (rosterError || availableError) {
        return (
            <Center>
                <Alert color='red' title='Error'>
                    An error occured while retrieving data:{' '}
                    {rosterError ? rosterError.message : availableError.message}
                </Alert>
            </Center>
        );
    }

    if (rosterIsLoading || availableIsLoading || !roster || !available) {
        return (
            <Center>
                <Loader />
            </Center>
        );
    }

    return (
        <>
            <Center>
                <Title order={1}>Edit Roster</Title>
            </Center>
            <Space h='md' />
            <RosterForm
                roster={roster}
                teams={available.teams}
                players={available.players}
                playoffRounds={available.playoffRounds}
            />
        </>
    );
}
