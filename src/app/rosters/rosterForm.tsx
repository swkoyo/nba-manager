'use client';

import { YEARS } from '@/lib/constants';
import { FullRoster, Player, PlayoffRound, Team } from '@/lib/types';
import { Alert, Box, Button, Group, MultiSelect, Select } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import { redirect } from '../actions';
import Link from 'next/link';
import { useSWRConfig } from 'swr';
import { useState } from 'react';
import { poster, putter } from '../fetcher';

interface Props {
    roster?: FullRoster;
    players: Player[];
    teams: Team[];
    playoffRounds: PlayoffRound[];
}

export default function RosterForm({
    roster,
    players,
    teams,
    playoffRounds,
}: Props) {
    const { mutate } = useSWRConfig();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const schema = z.object({
        year: z
            .string()
            .length(4)
            .refine((data) => YEARS.includes(data), {
                message: 'Invalid year',
            }),
        team: z
            .string()
            .refine(
                (data) => teams.some((team) => team.teamID === parseInt(data)),
                {
                    message: 'Invalid team',
                }
            ),
        playoffRound: z
            .string()
            .refine(
                (data) =>
                    data === '' ||
                    playoffRounds.some(
                        (round) => round.playoffRoundID === parseInt(data)
                    ),
                {
                    message: 'Invalid Playoff Round',
                }
            ),
        players: z
            .string()
            .array()
            .max(5, { message: 'Five players allowed at maximum' })
            .refine(
                (data) => {
                    if (data.length === 0) return true;
                    for (const p of data) {
                        if (
                            players.some(
                                (player) => player.playerID !== parseInt(p)
                            )
                        ) {
                            return true;
                        }
                    }
                    return false;
                },
                { message: 'Invalid player given' }
            ),
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
                setIsLoading(false);
            } else {
                await put(data);
                setIsLoading(false);
                mutate(`/api/rosters/${roster.rosterID}`);
            }
            mutate('/api/rosters');
            redirect('/rosters');
        } catch (err) {
            setIsLoading(false);
            setError((err as any).message);
        }
    }

    const teamOption = teams.map((team) => ({
        value: team.teamID.toString(),
        label: `${team.city} ${team.name}`,
    }));

    const playoffRoundOption = [
        { value: '', label: '-' },
        ...playoffRounds.map((round) => ({
            value: round.playoffRoundID.toString(),
            label: round.name,
        })),
    ];

    const playerOption = players.map((player) => ({
        value: player.playerID.toString(),
        label: `${player.firstName} ${player.lastName}`,
    }));

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
                    data={teamOption}
                    searchable
                    {...form.getInputProps('team')}
                />
                <Select
                    label='Playoff Round'
                    placeholder='None'
                    data={playoffRoundOption}
                    searchable
                    {...form.getInputProps('playoffRound')}
                />
                <MultiSelect
                    label='Players'
                    withAsterisk
                    placeholder='Pick up to 5 players'
                    data={playerOption}
                    maxValues={5}
                    searchable
                    {...form.getInputProps('players')}
                />
                <Group justify='flex-end' mt='md'>
                    <Button component={Link} href='/rosters'>
                        Cancel
                    </Button>
                    <Button loading={isLoading} type='submit'>Apply</Button>
                </Group>
            </form>
        </Box>
    );
}
