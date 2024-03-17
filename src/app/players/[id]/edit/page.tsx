'use client';

import { Alert, Center, Loader, Space, Title } from '@mantine/core';
import PlayerForm from '../../playerForm';
import { usePlayer } from '@/app/swr';

export default function EditPlayerPage({ params }: { params: { id: number } }) {
    const { data, isLoading, error } = usePlayer(params.id);

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
                <Title order={2}>Edit Player</Title>
            </Center>
            <Space h='md' />
            <PlayerForm player={data} />
        </>
    );
}
