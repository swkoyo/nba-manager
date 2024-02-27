import { Team } from '@/lib/types';
import { Button, TableTd, TableTr } from '@mantine/core';

interface Props {
    team: Team;
    setCurrentTeam: (team?: Team) => void;
}

export default function TeamRow({ team, setCurrentTeam }: Props) {
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
                    onClick={() => setCurrentTeam(team)}
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
