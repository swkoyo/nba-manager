import { PlayoffRound } from '@/lib/types';
import { Button, TableTd, TableTr } from '@mantine/core';

interface Props {
    round: PlayoffRound;
    setCurrentRound: (round?: PlayoffRound) => void;
}

export default function PlayoffRow({ round, setCurrentRound }: Props) {
    return (
        <TableTr key={round.playoffRoundID}>
            <TableTd>{round.playoffRoundID}</TableTd>
            <TableTd>{round.name}</TableTd>
            <TableTd>
                <Button
                    size='xs'
                    radius='xl'
                    mr='xs'
                    onClick={() => setCurrentRound(round)}
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
