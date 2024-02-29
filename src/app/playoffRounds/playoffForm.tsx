'use client';

import { PlayoffRound } from '@/lib/types';
import { Box, Button, Group, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import Link from 'next/link';
import { z } from 'zod';
import { redirect, revalidateTag } from '../actions';
import { useSWRConfig } from 'swr';

const schema = z.object({
    name: z
        .string()
        .min(3, { message: 'Name should have at least 3 characters' })
        .max(20, { message: 'Name should have at most 20 characters' }),
});

type Schema = z.infer<typeof schema>;

export default function PlayoffForm({
    playoffRound,
}: {
    playoffRound?: PlayoffRound;
}) {
    const { mutate } = useSWRConfig();
    const form = useForm({
        initialValues: {
            name: playoffRound?.name || '',
        },
        validate: zodResolver(schema),
    });

    async function post(data: Schema) {
        return fetch('/api/playoffRounds', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async function put(data: Schema) {
        return fetch(`/api/playoffRounds/${playoffRound?.playoffRoundID}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async function handleSubmit(data: Schema) {
        try {
            if (!playoffRound) {
                await post(data);
            } else {
                await put(data);
                mutate('/api/rosters');
                revalidateTag('rosters');
            }
            mutate('/api/playoffRounds');
            revalidateTag('playoffRounds');
            redirect('/playoffRounds');
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
                    placeholder='Championship'
                    {...form.getInputProps('name')}
                />
                <Group justify='flex-end' mt='md'>
                    <Button component={Link} href='/playoffRounds'>
                        Cancel
                    </Button>
                    <Button type='submit'>Apply</Button>
                </Group>
            </form>
        </Box>
    );
}
