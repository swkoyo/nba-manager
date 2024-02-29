import { Center, Space, Title } from '@mantine/core';
import RosterForm from '../rosterForm';
import { AvailableData } from '@/lib/types';

async function getData(): Promise<AvailableData> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/available`, {
        next: { tags: ['teams', 'players', 'playoffRounds'] },
    });
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }
    return res.json();
}

export default async function AddNewRoster() {
    const { players, teams, playoffRounds } = await getData();
    return (
        <>
            <Center>
                <Title order={1}>Add New Roster</Title>
            </Center>
            <Space h='md' />
            <RosterForm
                players={players}
                teams={teams}
                playoffRounds={playoffRounds}
            />
        </>
    );
}
