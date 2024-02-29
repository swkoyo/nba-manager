import { FullRoster } from '@/lib/types';
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
import RosterRow from './rosterRow';
import Link from 'next/link';

async function getData(): Promise<FullRoster[]> {
    const res = await fetch('http://localhost:3000/api/rosters', {
        next: { tags: ['rosters'] },
    });
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }
    return res.json();
}

export default async function Rosters() {
    const data = await getData();
    return (
        <>
            <Center>
                <Title order={1}>Browse Rosters</Title>
            </Center>
            <Space h='md' />
            <Button component={Link} href='/rosters/new' w='100%'>
                Add New Roster
            </Button>
            <Space h='md' />
            <Table>
                <TableThead>
                    <TableTr>
                        <TableTh>ID</TableTh>
                        <TableTh>Year</TableTh>
                        <TableTh>Team</TableTh>
                        <TableTh>Playoff Round</TableTh>
                        <TableTh>Players</TableTh>
                        <TableTh>Actions</TableTh>
                    </TableTr>
                </TableThead>
                <TableTbody>
                    {data.map((d) => (
                        <RosterRow key={d.rosterID} roster={d} />
                    ))}
                </TableTbody>
            </Table>
        </>
    );
}
