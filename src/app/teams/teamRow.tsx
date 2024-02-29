'use client';

import { revalidateTag } from '@/app/actions';
import { Team } from '@/lib/types';
import { Button, TableTd, TableTr } from '@mantine/core';
import Link from 'next/link';

interface Props {
    team: Team;
}

export default function TeamRow({ team }: Props) {
    async function deleteData() {
        try {
            await fetch(`/api/teams/${team.teamID}`, {
                method: 'DELETE',
            });
            revalidateTag('teams');
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <TableTr key={team.teamID}>
            <TableTd>{team.teamID}</TableTd>
            <TableTd>{team.name}</TableTd>
            <TableTd>{team.city}</TableTd>
            <TableTd>{team.state}</TableTd>
            <TableTd>
                <Button
                    size='xs'
                    radius='xl'
                    mr='xs'
                    component={Link}
                    href={`/teams/${team.teamID}/edit`}
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
