import {
    DUMMY_PLAYERS,
    DUMMY_PLAYOFF_ROUNDS,
    DUMMY_TEAMS,
    YEARS,
} from '@/lib/constants';
import { FullRoster } from '@/lib/types';
import {
    Box,
    Button,
    Group,
    MultiSelect,
    Select,
    TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';

interface Props {
    roster?: FullRoster;
    close: () => void;
}

export default function RosterForm({ roster, close }: Props) {
    const form = useForm({
        initialValues: {
            year: roster?.year || '',
            team: roster?.team || '',
            players: roster?.players || [],
            playoffRound: roster?.playoffRound || '',
        },
        validate: {
            year: (value) => (YEARS.includes(value) ? null : 'Invalid year'),
            team: (value) =>
                DUMMY_TEAMS.includes(value) ? null : 'Invalid team',
            players: (value) => {
                if (value.length < 5) {
                    return 'Invalid players';
                }
                for (const player of value) {
                    if (!DUMMY_PLAYERS.includes(player)) {
                        return 'Invalid players';
                    }
                }
                return null;
            },
            playoffRound: (value) =>
                !!DUMMY_PLAYOFF_ROUNDS.filter((round) => round.value == value)
                    ? null
                    : 'Invalid playoff round',
        },
    });

    function handleSubmit() {
        close();
    }

    return (
        <Box mx='auto'>
            <form onSubmit={form.onSubmit(() => handleSubmit())}>
                <Select
                    withAsterisk
                    label='Year'
                    placeholder='2020'
                    data={YEARS}
                    {...form.getInputProps('year')}
                />
                <Select
                    withAsterisk
                    label='Team'
                    placeholder='Harlem Globetrotters'
                    data={DUMMY_TEAMS}
                    {...form.getInputProps('team')}
                />
                <Select
                    label='Playoff Round'
                    placeholder='None'
                    data={DUMMY_PLAYOFF_ROUNDS}
                    {...form.getInputProps('playoffRound')}
                />
                <MultiSelect
                    label='Players'
                    withAsterisk
                    placeholder='Pick player'
                    data={DUMMY_PLAYERS}
                    {...form.getInputProps('players')}
                />
                <Group justify='flex-end' mt='md'>
                    <Button type='submit'>Apply</Button>
                </Group>
            </form>
        </Box>
    );
}
