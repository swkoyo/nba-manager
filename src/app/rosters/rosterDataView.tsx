'use client';

import {
    Button,
    Flex,
    Group,
    Stack,
    Switch,
    Table,
    TableTbody,
    TableTd,
    TableTh,
    TableThead,
    TableTr,
    TextInput,
} from '@mantine/core';
import { useSWRConfig } from 'swr';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAllRosters } from '../swr';

export default function RosterDataView() {
    const { mutate } = useSWRConfig();
    const [showYear, setShowYear] = useState<boolean>(true);
    const [showTeam, setShowTeam] = useState<boolean>(true);
    const [showPlayoffRound, setShowPlayoffRound] = useState<boolean>(true);
    const [showPlayers, setShowPlayers] = useState<boolean>(true);
    const [searchVal, setSearchVal] = useState<string>('');
    const [inputVal, setInputVal] = useState<string>('');

    const {
        data,
        isLoading,
        error,
        mutate: dataMutate,
    } = useAllRosters({
        showYear,
        showTeam,
        showPlayoffRound,
        showPlayers,
        searchVal,
    });

    async function deleteData(id: number) {
        try {
            await fetch(`/api/rosters/${id}`, {
                method: 'DELETE',
            });
            dataMutate();
            mutate(`/api/rosters/${id}`);
        } catch (err) {
            console.error(err);
        }
    }

    function onClick() {
        setSearchVal(inputVal);
    }

    useEffect(() => {
        dataMutate();
    }, [
        showPlayers,
        showPlayoffRound,
        showTeam,
        showYear,
        searchVal,
        dataMutate,
    ]);

    if (error) return <div>Error</div>;

    if (isLoading || !data) return <div>Loading...</div>;

    return (
        <>
            <Flex w='100%' justify='space-evenly'>
                <Switch
                    checked={showYear}
                    onChange={(event) =>
                        setShowYear(event.currentTarget.checked)
                    }
                    label='Show Year'
                />
                <Switch
                    checked={showTeam}
                    onChange={(event) =>
                        setShowTeam(event.currentTarget.checked)
                    }
                    label='Show Team'
                />
                <Switch
                    checked={showPlayoffRound}
                    onChange={(event) =>
                        setShowPlayoffRound(event.currentTarget.checked)
                    }
                    label='Show Playoff Round'
                />
                <Switch
                    checked={showPlayers}
                    onChange={(event) =>
                        setShowPlayers(event.currentTarget.checked)
                    }
                    label='Show Players'
                />
            </Flex>
            <Stack>
                <TextInput
                    label='Search by value'
                    placeholder='Lakers, Lebron, 2024, etc'
                    value={inputVal}
                    onChange={(event) => setInputVal(event.currentTarget.value)}
                />
                <Group justify='end'>
                    <Button onClick={() => onClick()} size='xs'>
                        Search
                    </Button>
                </Group>
            </Stack>
            <Table>
                <TableThead>
                    <TableTr>
                        <TableTh>ID</TableTh>
                        {showYear && <TableTh>Year</TableTh>}
                        {showTeam && <TableTh>Team</TableTh>}
                        {showPlayoffRound && <TableTh>Playoff Round</TableTh>}
                        {showPlayers && <TableTh>Players</TableTh>}
                        <TableTh>Actions</TableTh>
                    </TableTr>
                </TableThead>
                <TableTbody>
                    {data?.map((roster) => (
                        <TableTr key={roster.rosterID}>
                            <TableTd>{roster.rosterID}</TableTd>
                            {showYear && <TableTd>{roster.year}</TableTd>}
                            {showTeam && (
                                <TableTd>{`${roster.team.city} ${roster.team.name}`}</TableTd>
                            )}
                            {showPlayoffRound && (
                                <TableTd>
                                    {roster.playoffRound?.name || '-'}
                                </TableTd>
                            )}
                            {showPlayers && (
                                <TableTd>
                                    {roster.players
                                        .map(
                                            (player) =>
                                                `${player.firstName} ${player.lastName}`
                                        )
                                        .join(', ')}
                                </TableTd>
                            )}
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
                                    onClick={() => deleteData(roster.rosterID)}
                                >
                                    Delete
                                </Button>
                            </TableTd>
                        </TableTr>
                    ))}
                </TableTbody>
            </Table>
        </>
    );
}
