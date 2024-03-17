'use client';

import { Alert, Center, Loader, Space, Title } from '@mantine/core';
import PlayoffForm from '../../playoffForm';
import { usePlayoffRound } from '@/app/swr';

export default function EditPlayoffRoundPage({
    params,
}: {
    params: { id: number };
}) {
    const { data, error, isLoading } = usePlayoffRound(params.id);

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
                <Title order={1}>Edit Playoff Round</Title>
            </Center>
            <Space h='md' />
            <PlayoffForm playoffRound={data} />
        </>
    );
}
