'use client';

import {
    Alert,
    Button,
    Center,
    Flex,
    Group,
    Loader,
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
import { deleter } from '../fetcher';

export default function RosterDataView() {
    const { mutate } = useSWRConfig();
    const [showYear, setShowYear] = useState<boolean>(true);
    const [showTeam, setShowTeam] = useState<boolean>(true);
    const [showPlayoffRound, setShowPlayoffRound] = useState<boolean>(true);
    const [showPlayers, setShowPlayers] = useState<boolean>(true);
    const [searchVal, setSearchVal] = useState<string>('');
    const [inputVal, setInputVal] = useState<string>('');
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

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
            setDeletingId(id);
            await deleter(`/api/rosters/${id}`);
            dataMutate();
            mutate(`/api/rosters/${id}`);
            setDeletingId(null);
        } catch (err) {
            setDeletingId(null);
            setDeleteError((err as any).message);
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

    if (error) {
        return (
            <Center>
                <Alert color='red' title='Error' w='100%'>
                    An error occured while retrieving data: {error.message}
                </Alert>
            </Center>
        );
    }

    if (isLoading || !data) {
        return (
            <Center>
                <Loader />
            </Center>
        );
    }

    return (
        <>
            {deleteError && (
                <Alert
                    withCloseButton
                    w='100%'
                    onClose={() => setDeleteError(null)}
                    color='red'
                >
                    {deleteError}
                </Alert>
            )}
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
                                /* eslint-disable */
                                <TableTd>
                                    {roster.players.length > 0
                                        ? roster.players
                                              .map(
                                                  (player) =>
                                                      `${player.firstName} ${player.lastName}`
                                              )
                                              .join(', ')
                                        : '-'}
                                </TableTd>
                                /* eslint-enable */
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
                                    loading={deletingId === roster.rosterID}
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
