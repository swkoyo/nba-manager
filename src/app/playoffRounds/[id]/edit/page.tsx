import { PlayoffRound } from '@/lib/types';
import { Center, Space, Title } from '@mantine/core';
import PlayoffForm from '../../playoffForm';

async function getData(id: number): Promise<PlayoffRound> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/playoffRounds/${id}`,
        {
            next: { tags: ['playoffRounds'] },
        }
    );
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }
    return res.json();
}

export default async function EditPlayoffRoundPage({
    params,
}: {
    params: { id: number };
}) {
    const data = await getData(params.id);
    return (
        <>
            <Center>
                <Title order={1}>Edit Playoff Round</Title>
            </Center>
            <Space h='md' />
            <PlayoffForm playoffRound={data} />
        </>
    );
}
