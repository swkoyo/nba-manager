'use client';

import { PlayoffRound } from '@/lib/types';
import { Button, TableTd, TableTr } from '@mantine/core';
import Link from 'next/link';
import { revalidateTag } from '../actions';

export default function PlayoffRow({
    playoffRound,
}: {
    playoffRound: PlayoffRound;
}) {
    async function deleteData() {
        try {
            await fetch(`/api/playoffRounds/${playoffRound.playoffRoundID}`, {
                method: 'DELETE',
            });
            revalidateTag('playoffRounds')
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <TableTr key={playoffRound.playoffRoundID}>
            <TableTd>{playoffRound.playoffRoundID}</TableTd>
            <TableTd>{playoffRound.name}</TableTd>
            <TableTd>
                <Button
                    size='xs'
                    radius='xl'
                    mr={10}
                    component={Link}
                    href={`/playoffRounds/${playoffRound.playoffRoundID}/edit`}
                >
                    Edit
                </Button>
                <Button
                    onClick={() => deleteData()}
                    size='xs'
                    radius='xl'
                    color='red'
                >
                    Delete
                </Button>
            </TableTd>
        </TableTr>
    );
}
