import {
    Button,
    Space,
    Center,
    Title,
    Table,
    TableTbody,
    TableTh,
    TableThead,
    TableTr,
} from '@mantine/core';
import { PlayoffRound } from '@/lib/types';
import Link from 'next/link';
import PlayoffRow from './playoffRow';

async function getData(): Promise<PlayoffRound[]> {
    const res = await fetch('http://localhost:3000/api/playoffRounds', {
        next: { tags: ['playoffRounds'] },
    });
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }
    return res.json();
}

export default async function Playoffs() {
    const data = await getData();

    return (
        <>
            <Center>
                <Title order={1}>Browse Playoff Rounds</Title>
            </Center>
            <Space h='md' />
            <Button w='100%' component={Link} href='/playoffRounds/new'>
                Add New Playoff Round
            </Button>
            <Space h='md' />
            <Table>
                <TableThead>
                    <TableTr>
                        <TableTh>ID</TableTh>
                        <TableTh>Playoff Round</TableTh>
                        <TableTh>Actions</TableTh>
                    </TableTr>
                </TableThead>
                <TableTbody>
                    {data.map((d) => (
                        <PlayoffRow key={d.playoffRoundID} playoffRound={d} />
                    ))}
                </TableTbody>
            </Table>
        </>
    );
}
