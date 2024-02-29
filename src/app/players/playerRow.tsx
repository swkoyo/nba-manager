'use client';

import { Player } from '@/lib/types';
import { Button, TableTd, TableTr } from '@mantine/core';
import Link from 'next/link';
import { revalidateTag } from '../actions';

interface Props {
    player: Player;
}

export default function PlayerRow({ player }: Props) {
    async function deleteData() {
        try {
            await fetch(`/api/players/${player.playerID}`, {
                method: 'DELETE',
            });
            revalidateTag('players');
        } catch (err) {
            console.error(err);
        }
    }
    return (
        <TableTr key={player.playerID}>
            <TableTd>{player.playerID}</TableTd>
            <TableTd>{player.firstName}</TableTd>
            <TableTd>{player.lastName}</TableTd>
            <TableTd>
                <Button
                    size='xs'
                    radius='xl'
                    mr='xs'
                    component={Link}
                    href={`/players/${player.playerID}/edit`}
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
