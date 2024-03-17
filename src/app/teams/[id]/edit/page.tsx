'use client';

import { Alert, Center, Loader } from '@mantine/core';
import TeamForm from '../../teamForm';
import { useTeam } from '@/app/swr';

export default function EditTeamPage({ params }: { params: { id: number } }) {
    const { data, isLoading, error } = useTeam(params.id);

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

    return <TeamForm team={data} />;
}
