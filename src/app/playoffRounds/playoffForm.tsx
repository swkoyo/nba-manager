'use client';

import { PlayoffRound } from '@/lib/types';
import { Alert, Box, Button, Group, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import Link from 'next/link';
import { z } from 'zod';
import { redirect } from '../actions';
import { useSWRConfig } from 'swr';
import { useState } from 'react';
import { poster, putter } from '../fetcher';

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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const form = useForm({
        initialValues: {
            name: playoffRound?.name || '',
        },
        validate: zodResolver(schema),
    });

    function post(data: Schema) {
        return poster('/api/playoffRounds', data);
    }

    function put(data: Schema) {
        return putter(
            `/api/playoffRounds/${playoffRound?.playoffRoundID}`,
            data
        );
    }

    async function handleSubmit(data: Schema) {
        try {
            setIsLoading(true);
            if (!playoffRound) {
                await post(data);
            } else {
                await put(data);
                mutate('/api/rosters', true);
                mutate(`/api/playoffRounds/${playoffRound.playoffRoundID}`, true);
            }
            mutate('/api/playoffRounds', true);
            mutate('/api/available', true);
            setIsLoading(false);
            redirect('/playoffRounds');
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
                    placeholder='Championship'
                    {...form.getInputProps('name')}
                />
                <Group justify='flex-end' mt='md'>
                    <Button component={Link} href='/playoffRounds'>
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
