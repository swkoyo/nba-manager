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
import { useAllTeams } from '../swr';
import { deleter } from '../fetcher';

export default function TeamDataView() {
    const [showName, setShowName] = useState<boolean>(true);
    const [showCity, setShowCity] = useState<boolean>(true);
    const [showState, setShowState] = useState<boolean>(true);
    const [searchVal, setSearchVal] = useState<string>('');
    const [inputVal, setInputVal] = useState<string>('');
    const { mutate } = useSWRConfig();
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const {
        data,
        isLoading,
        error,
        mutate: dataMutate,
    } = useAllTeams({
        showName,
        showCity,
        showState,
        searchVal,
    });

    async function deleteData(id: number) {
        try {
            setDeletingId(id);
            await deleter(`/api/teams/${id}`);
            dataMutate();
            mutate(`/api/teams/${id}`);
            mutate('/api/rosters');
            mutate('/api/available');
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
    }, [showName, showCity, showState, searchVal, dataMutate]);

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
                    checked={showName}
                    onChange={(event) =>
                        setShowName(event.currentTarget.checked)
                    }
                    label='Show Name'
                />
                <Switch
                    checked={showCity}
                    onChange={(event) =>
                        setShowCity(event.currentTarget.checked)
                    }
                    label='Show City'
                />
                <Switch
                    checked={showState}
                    onChange={(event) =>
                        setShowState(event.currentTarget.checked)
                    }
                    label='Show State'
                />
            </Flex>
            <Stack>
                <TextInput
                    label='Search by value'
                    placeholder='Lakers, Los Angeles, etc'
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
                        {showName && <TableTh>Name</TableTh>}
                        {showCity && <TableTh>City</TableTh>}
                        {showState && <TableTh>State (ABR)</TableTh>}
                        <TableTh>Actions</TableTh>
                    </TableTr>
                </TableThead>
                <TableTbody>
                    {data?.map((team) => (
                        <TableTr key={team.teamID}>
                            <TableTd>{team.teamID}</TableTd>
                            {showName && <TableTd>{team.name}</TableTd>}
                            {showCity && <TableTd>{team.city}</TableTd>}
                            {showState && <TableTd>{team.state}</TableTd>}
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
                                    loading={deletingId === team.teamID}
                                    onClick={() => deleteData(team.teamID)}
                                    size='xs'
                                    radius='xl'
                                    color='red'
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
