'use client';

import { STATES } from '@/lib/constants';
import { Team } from '@/lib/types';
import { Alert, Box, Button, Group, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { z } from 'zod';
import { zodResolver } from '@mantine/form';
import { redirect } from '../actions';
import Link from 'next/link';
import { useSWRConfig } from 'swr';
import { useState } from 'react';
import { poster, putter } from '../fetcher';

const schema = z.object({
    name: z
        .string()
        .min(3, { message: 'Name should have at least 3 characters' })
        .max(20, { message: 'Name should have at most 20 characters' }),
    city: z
        .string()
        .min(3, { message: 'City should have at least 3 characters' })
        .max(20, { message: 'City should have at most 20 characters' }),
    state: z
        .string()
        .length(2)
        .refine((data) => STATES.includes(data), { message: 'Invalid state' }),
});

type Schema = z.infer<typeof schema>;

interface Props {
    team?: Team;
}

export default function TeamForm({ team }: Props) {
    const { mutate } = useSWRConfig();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const form = useForm({
        initialValues: {
            name: team?.name || '',
            city: team?.city || '',
            state: team?.state || '',
        },
        validate: zodResolver(schema),
    });

    function post(data: Schema) {
        return poster('/api/teams', data);
    }

    function put(data: Schema) {
        return putter(`/api/teams/${team?.teamID}`, data);
    }

    async function handleSubmit(data: Schema) {
        try {
            setIsLoading(true);
            if (!team) {
                await post(data);
            } else {
                await put(data);
                mutate('/api/rosters', true);
                mutate(`/api/teams/${team.teamID}`, true);
            }
            mutate('/api/teams', true);
            mutate('/api/available', true);
            setIsLoading(false);
            redirect('/teams');
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
                    label='Name'
                    placeholder='Globetrotters'
                    {...form.getInputProps('name')}
                />
                <TextInput
                    withAsterisk
                    label='City'
                    placeholder='Harlem'
                    {...form.getInputProps('city')}
                />
                <Select
                    withAsterisk
                    label='State'
                    placeholder='NY'
                    data={STATES}
                    {...form.getInputProps('state')}
                />
                <Group justify='flex-end' mt='md'>
                    <Button component={Link} href='/teams'>
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
