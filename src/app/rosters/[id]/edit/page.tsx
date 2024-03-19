'use client';

import { Alert, Center, Loader } from '@mantine/core';
import RosterForm from '../../rosterForm';
import { useRoster } from '@/app/swr';

export default function EditRosterPage({ params }: { params: { id: number } }) {
    const {
        data: roster,
        isLoading: rosterIsLoading,
        error: rosterError,
    } = useRoster(params.id);

    if (rosterError) {
        return (
            <Center>
                <Alert color='red' title='Error'>
                    An error occured while retrieving data:{' '}
                    {rosterError.message}
                </Alert>
            </Center>
        );
    }

    if (rosterIsLoading || !roster) {
        return (
            <Center>
                <Loader />
            </Center>
        );
    }

    return <RosterForm roster={roster} />;
}
