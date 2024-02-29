'use client';

import { FullRoster } from '@/lib/types';
import { Button, TableTd, TableTr } from '@mantine/core';
import Link from 'next/link';
import { revalidateTag } from '../actions';

interface Props {
    roster: FullRoster;
}

export default function RosterRow({ roster }: Props) {
    async function deleteData() {
        try {
            await fetch(`/api/rosters/${roster.rosterID}`, {
                method: 'DELETE',
            });
            revalidateTag('rosters');
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <TableTr key={roster.rosterID}>
            <TableTd>{roster.rosterID}</TableTd>
            <TableTd>{roster.year}</TableTd>
            <TableTd>{`${roster.team.city} ${roster.team.name}`}</TableTd>
            <TableTd>{roster.playoffRound?.name || '-'}</TableTd>
            <TableTd>
                {roster.players
                    .map((player) => `${player.firstName} ${player.lastName}`)
                    .join(', ')}
            </TableTd>
            <TableTd>
                <Button
                    size='xs'
                    radius='xl'
                    mr='xs'
                    component={Link}
                    href={`/rosters/${roster.rosterID}/edit`}
                >
                    Edit
                </Button>
                <Button
                    size='xs'
                    radius='xl'
                    color='red'
                    onClick={() => deleteData()}
                >
                    Delete
                </Button>
            </TableTd>
        </TableTr>
    );
}
