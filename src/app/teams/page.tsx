import { Team } from '@/lib/types';
import {
    Button,
    Center,
    Space,
    Table,
    TableTbody,
    TableTh,
    TableThead,
    TableTr,
    Title,
} from '@mantine/core';
import Link from 'next/link';
import TeamRow from './teamRow';

async function getData(): Promise<Team[]> {
    const res = await fetch('http://localhost:3000/api/teams', {
        next: { tags: ['teams'] },
    });
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }
    return res.json();
}

export default async function Teams() {
    const data = await getData();
    return (
        <>
            <Center>
                <Title order={1}>Browse Team</Title>
            </Center>
            <Space h='md' />
            <Button component={Link} href='/teams/new' w='100%'>
                Add New Team
            </Button>
            <Space h='md' />
            <Table>
                <TableThead>
                    <TableTr>
                        <TableTh>ID</TableTh>
                        <TableTh>Name</TableTh>
                        <TableTh>City</TableTh>
                        <TableTh>State (ABR)</TableTh>
                        <TableTh>Actions</TableTh>
                    </TableTr>
                </TableThead>
                <TableTbody>
                    {data.map((d) => (
                        <TeamRow key={d.teamID} team={d} />
                    ))}
                </TableTbody>
            </Table>
        </>
    );
}
