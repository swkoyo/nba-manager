import { Team } from '@/lib/types';
import { Center, Space, Title } from '@mantine/core';
import TeamForm from '../../teamForm';
import { BASE_URL } from '@/lib/constants';

async function getData(id: number): Promise<Team> {
    const res = await fetch(`${BASE_URL}/api/teams/${id}`, {
        next: { tags: ['teams'] },
    });
    if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
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
