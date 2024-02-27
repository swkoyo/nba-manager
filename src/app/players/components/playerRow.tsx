import { Player } from '@/lib/types';
import { Button, TableTd, TableTr } from '@mantine/core';

interface Props {
    player: Player;
    setCurrentPlayer: (player?: Player) => void;
}

export default function PlayerRow({ player, setCurrentPlayer }: Props) {
    return (
        <TableTr key={player.playerID}>
            <TableTd>{player.playerID}</TableTd>
            <TableTd>{player.firstName}</TableTd>
            <TableTd>{player.lastName}</TableTd>
            <TableTd>
                <Button
                    size='xs'
                    radius='xl'
                    mr="xs"
                    onClick={() => setCurrentPlayer(player)}
                >
                    Edit
                </Button>
                <Button size='xs' radius='xl' color="red">
                    Delete
                </Button>
            </TableTd>
        </TableTr>
    );
}
