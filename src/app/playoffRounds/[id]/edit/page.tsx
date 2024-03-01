'use client';

import { Center, Space, Title } from '@mantine/core';
import PlayoffForm from '../../playoffForm';
import { usePlayoffRound } from '@/app/swr';

export default function EditPlayoffRoundPage({
    params,
}: {
    params: { id: number };
}) {
    const { data, error, isLoading } = usePlayoffRound(params.id);

    if (error) {
        return <div>Error</div>;
    }

    if (isLoading || !data) {
        return <div>Loading...</div>;
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
