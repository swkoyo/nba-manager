'use client';

import { Player } from '@/lib/types';
import { Alert, Box, Button, Group, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import { redirect } from '../actions';
import { useSWRConfig } from 'swr';
import { useState } from 'react';
import { poster, putter } from '../fetcher';
import Link from 'next/link';

interface Props {
    player?: Player;
}

const schema = z.object({
    firstName: z
        .string()
        .min(2, { message: 'First name should have at least 2 characters' })
        .max(20, { message: 'First name should have at most 20 characters' }),
    lastName: z
        .string()
        .min(2, { message: 'Last name should have at least 2 characters' })
        .max(20, { message: 'Last name should have at most 20 characters' }),
});

type Schema = z.infer<typeof schema>;

export default function PlayerForm({ player }: Props) {
    const { mutate } = useSWRConfig();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const form = useForm({
        initialValues: {
            firstName: player?.firstName || '',
            lastName: player?.lastName || '',
        },
        validate: zodResolver(schema),
    });

    function post(data: Schema) {
        return poster('/api/players', data);
    }

    function put(data: Schema) {
        return putter(`/api/players/${player?.playerID}`, data);
    }

    async function handleSubmit(data: Schema) {
        setIsLoading(true);
        try {
            if (!player) {
                await post(data);
            } else {
                await put(data);
                mutate('/api/rosters', true);
                mutate(`/api/players/${player.playerID}`, true);
            }
            mutate('/api/players', true);
            mutate('/api/available', true);
            setIsLoading(false);
            redirect('/players');
        } catch (err) {
            setIsLoading(false);
            setError((err as any).message);
        }
    }

    return (
        <Box mx='auto'>
            {error && (
                <Alert
                    withCloseButton
                    onClose={() => setError(null)}
                    color='red'
                >
                    {error}
                </Alert>
            )}
            <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                <TextInput
                    withAsterisk
                    label='First Name'
                    placeholder='John'
                    {...form.getInputProps('firstName')}
                />
                <TextInput
                    withAsterisk
                    label='Last Name'
                    placeholder='Doe'
                    {...form.getInputProps('lastName')}
                />
                <Group justify='flex-end' mt='md'>
                    <Button component={Link} href='/players'>
                        Cancel
                    </Button>
                    <Button loading={isLoading} type='submit'>
                        Apply
                    </Button>
                </Group>
            </form>
        </Box>
    );
}
