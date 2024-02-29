'use client';

import { Player } from '@/lib/types';
import { Box, Button, Group, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import { redirect, revalidateTag } from '../actions';
import { useSWRConfig } from 'swr';

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
    const form = useForm({
        initialValues: {
            firstName: player?.firstName || '',
            lastName: player?.lastName || '',
        },
        validate: zodResolver(schema),
    });

    async function post(data: Schema) {
        return fetch('/api/players', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async function put(data: Schema) {
        return fetch(`/api/players/${player?.playerID}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async function handleSubmit(data: Schema) {
        try {
            if (!player) {
                await post(data);
                mutate('/api/players');
            } else {
                await put(data);
                mutate('/api/players');
                mutate('/api/rosters');
            }
            revalidateTag('available');
            redirect('/players');
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <Box mx='auto'>
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
                    <Button type='submit'>Apply</Button>
                </Group>
            </form>
        </Box>
    );
}
