import { Center, Space, Title } from '@mantine/core';
import PlayerForm from '../../playerForm';
import { Player } from '@/lib/types';

async function getData(id: number): Promise<Player> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/players/${id}`,
        {
            next: { tags: ['players'] },
        }
    );
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }
    return res.json();
}

export default async function EditPlayerPage({
    params,
}: {
    params: { id: number };
}) {
    const data = await getData(params.id);
    return (
        <>
            <Center>
                <Title order={1}>Edit Player</Title>
            </Center>
            <Space h='md' />
            <PlayerForm player={data} />
        </>
    );
}
