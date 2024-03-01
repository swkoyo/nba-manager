'use client';

import { Center, Space, Title } from '@mantine/core';
import PlayerForm from '../../playerForm';
import { usePlayer } from '@/app/swr';

export default function EditPlayerPage({ params }: { params: { id: number } }) {
    const { data, isLoading, error } = usePlayer(params.id);

    if (error) {
        return <div>Error</div>;
    }

    if (isLoading || !data) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Center>
                <Title order={1}>Edit Player</Title>
            </Center>
            <Space h='md' />
            <PlayerForm player={data} />
        </>
    );
}
