'use client';

import { YEARS } from '@/lib/constants';
import { FullRoster } from '@/lib/types';
import {
    Alert,
    Box,
    Button,
    Center,
    Group,
    Loader,
    MultiSelect,
    Select,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import { redirect } from '../actions';
import Link from 'next/link';
import { useSWRConfig } from 'swr';
import { useState } from 'react';
import { poster, putter } from '../fetcher';
import { useAllPlayers, useAllPlayoffRounds, useAllTeams } from '../swr';

interface Props {
    roster?: FullRoster;
}

export default function RosterForm({ roster }: Props) {
    const { mutate } = useSWRConfig();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {
        data: playerData,
        isLoading: playerIsLoading,
        error: playerError,
    } = useAllPlayers({
        showFirstName: true,
        showLastName: true,
        searchVal: '',
    });
    const {
        data: playoffData,
        isLoading: playoffIsLoading,
        error: playoffError,
    } = useAllPlayoffRounds({ showName: true, searchVal: '' });
    const {
        data: teamData,
        isLoading: teamIsLoading,
        error: teamError,
    } = useAllTeams({
        showCity: true,
        showName: true,
        showState: true,
        searchVal: '',
    });

    const schema = z.object({
        year: z
            .string()
            .length(4)
            .refine((data) => YEARS.includes(data), {
                message: 'Invalid year',
            }),
        team: z.string(),
        playoffRound: z.string(),
        players: z
            .string()
            .array()
            .max(5, { message: 'Five players allowed at maximum' }),
    });

    type Schema = z.infer<typeof schema>;

    const form = useForm({
        initialValues: {
            year: roster?.year || '',
            team: roster?.teamID.toString() || '',
            playoffRound: roster?.playoffRoundID?.toString() || '',
            players: roster?.players.map((p) => p.playerID.toString()) || [],
        },
        validate: zodResolver(schema),
    });

    function post(data: Schema) {
        return poster('/api/rosters', {
            year: data.year,
            teamID: parseInt(data.team),
            playoffRoundID: data.playoffRound
                ? parseInt(data.playoffRound)
                : null,
            playerIDs: data.players.map((p) => parseInt(p)),
        });
    }

    function put(data: Schema) {
        return putter(`/api/rosters/${roster?.rosterID}`, {
            year: data.year,
            teamID: parseInt(data.team),
            playoffRoundID: data.playoffRound
                ? parseInt(data.playoffRound)
                : null,
            playerIDs: data.players.map((p) => parseInt(p)),
        });
    }

    async function handleSubmit(data: Schema) {
        setIsLoading(true);
        try {
            if (!roster) {
                await post(data);
            } else {
                await put(data);
                mutate(`/api/rosters/${roster.rosterID}`);
            }
            mutate('/api/rosters');
            setIsLoading(false);
            redirect('/rosters');
        } catch (err) {
            setIsLoading(false);
            setError((err as any).message);
        }
    }

    if (playerError || playoffError || teamError) {
        return (
            <Center>
                <Alert color='red' title='Error'>
                    An error occured while retrieving data.
                </Alert>
            </Center>
        );
    }

    if (
        playerIsLoading ||
        playoffIsLoading ||
        teamIsLoading ||
        !playerData ||
        !playoffData ||
        !teamData
    ) {
        return (
            <Center>
                <Loader />
            </Center>
        );
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
            <form
                onSubmit={form.onSubmit((values) =>
                    handleSubmit(values as unknown as Schema)
                )}
            >
                <Select
                    withAsterisk
                    label='Year'
                    placeholder='Select year'
                    data={YEARS}
                    searchable
                    {...form.getInputProps('year')}
                />
                <Select
                    withAsterisk
                    label='Team'
                    placeholder='Harlem Globetrotters'
                    data={teamData.map((team) => ({
                        value: team.teamID.toString(),
                        label: `${team.city} ${team.name}`,
                    }))}
                    searchable
                    {...form.getInputProps('team')}
                />
                <Select
                    label='Playoff Round'
                    placeholder='None'
                    data={[
                        { value: '', label: '-' },
                        ...playoffData.map((round) => ({
                            value: round.playoffRoundID.toString(),
                            label: round.name,
                        })),
                    ]}
                    searchable
                    {...form.getInputProps('playoffRound')}
                />
                <MultiSelect
                    label='Players'
                    withAsterisk
                    placeholder='Pick up to 5 players'
                    data={playerData.map((player) => ({
                        value: player.playerID.toString(),
                        label: `${player.firstName} ${player.lastName}`,
                    }))}
                    maxValues={5}
                    searchable
                    {...form.getInputProps('players')}
                />
                <Group justify='flex-end' mt='md'>
                    <Button component={Link} href='/rosters'>
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
