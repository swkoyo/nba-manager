import { AvailableData, FullRoster } from '@/lib/types';
import { Center, Space, Title } from '@mantine/core';
import RosterForm from '../../rosterForm';

async function getData(
    id: number
): Promise<{ roster: FullRoster; available: AvailableData }> {
    const res = await fetch(
        `${process.env.VERCEL_URL}/api/rosters/${id}`,
        {
            next: { tags: ['rosters'] },
        }
    );
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }
    const availableRes = await fetch(
        `${process.env.VERCEL_URL}/api/available`,
        {
            next: { tags: ['teams', 'players', 'playoffRounds'] },
        }
    );
    return {
        roster: await res.json(),
        available: await availableRes.json(),
    };
}

export default async function EditRosterPage({
    params,
}: {
    params: { id: number };
}) {
    const { roster, available } = await getData(params.id);
    return (
        <>
            <Center>
                <Title order={1}>Edit Roster</Title>
            </Center>
            <Space h='md' />
            <RosterForm
                roster={roster}
                teams={available.teams}
                players={available.players}
                playoffRounds={available.playoffRounds}
            />
        </>
    );
}
