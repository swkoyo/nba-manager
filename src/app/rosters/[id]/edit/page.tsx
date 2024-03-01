'use client';

import { Center, Space, Title } from '@mantine/core';
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
        return <div>Error</div>;
    }

    if (rosterIsLoading || availableIsLoading || !roster || !available) {
        return <div>Loading...</div>;
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
