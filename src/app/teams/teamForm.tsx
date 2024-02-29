'use client';

import { STATES } from '@/lib/constants';
import { Team } from '@/lib/types';
import { Box, Button, Group, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { z } from 'zod';
import { zodResolver } from '@mantine/form';
import { redirect, revalidateTag } from '../actions';
import Link from 'next/link';
import { useSWRConfig } from 'swr';

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
    const form = useForm({
        initialValues: {
            name: team?.name || '',
            city: team?.city || '',
            state: team?.state || '',
        },
        validate: zodResolver(schema),
    });

    async function post(data: Schema) {
        return fetch('/api/teams', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async function put(data: Schema) {
        return fetch(`/api/teams/${team?.teamID}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async function handleSubmit(data: Schema) {
        try {
            if (!team) {
                await post(data);
                mutate('/api/teams');
            } else {
                await put(data);
                mutate('/api/teams');
                mutate('/api/rosters');
            }
            revalidateTag('available');
            redirect('/teams');
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <Box mx='auto'>
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
                    <Button type='submit'>Apply</Button>
                </Group>
            </form>
        </Box>
    );
}
