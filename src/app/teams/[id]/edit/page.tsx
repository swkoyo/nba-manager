import { Team } from '@/lib/types';
import { Center, Space, Title } from '@mantine/core';
import TeamForm from '../../teamForm';

async function getData(id: number): Promise<Team> {
    const res = await fetch(`${process.env.VERCEL_URL}/api/teams/${id}`, {
        next: { tags: ['teams'] },
    });
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }
    return res.json();
}

export default async function EditTeamPage({
    params,
}: {
    params: { id: number };
}) {
    const data = await getData(params.id);
    return (
        <>
            <Center>
                <Title order={1}>Edit Team</Title>
            </Center>
            <Space h='md' />
            <TeamForm team={data} />
        </>
    );
}
