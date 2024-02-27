import { FullRoster } from '@/lib/types';
import { Button, TableTd, TableTr } from '@mantine/core';

interface Props {
    roster: FullRoster;
    setCurrentRoster: (roster?: FullRoster) => void;
}

export default function RosterRow({ roster, setCurrentRoster }: Props) {
    return (
        <TableTr key={roster.rosterID}>
            <TableTd>{roster.rosterID}</TableTd>
            <TableTd>{roster.year}</TableTd>
            <TableTd>{roster.team}</TableTd>
            <TableTd>{roster.playoffRound || '-'}</TableTd>
            <TableTd>{roster.players.join(', ')}</TableTd>
            <TableTd>
                <Button
                    size='xs'
                    radius='xl'
                    mr='xs'
                    onClick={() => setCurrentRoster(roster)}
                >
                    Edit
                </Button>
                <Button size='xs' radius='xl' color='red'>
                    Delete
                </Button>
            </TableTd>
        </TableTr>
    );
}
