import { Player } from '@/lib/types';
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
import PlayerRow from './playerRow';
import Link from 'next/link';

async function getData(): Promise<Player[]> {
    const res = await fetch('http://localhost:3000/api/players', {
        next: { tags: ['players'] },
    });
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }
    return res.json();
}

export default async function Players() {
    const data = await getData();
    return (
        <>
            <Center>
                <Title order={1}>Browse Players</Title>
            </Center>
            <Space h='md' />
            <Button component={Link} href='/players/new' w='100%'>
                Add New Players
            </Button>
            <Space h='md' />
            <Table>
                <TableThead>
                    <TableTr>
                        <TableTh>ID</TableTh>
                        <TableTh>First Name</TableTh>
                        <TableTh>Last Name</TableTh>
                        <TableTh>Actions</TableTh>
                    </TableTr>
                </TableThead>
                <TableTbody>
                    {data.map((d) => (
                        <PlayerRow key={d.playerID} player={d} />
                    ))}
                </TableTbody>
            </Table>
        </>
    );
}
