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
import { useAllPlayers } from '../swr';
import { deleter } from '../fetcher';

export default function PlayerDataView() {
    const { mutate } = useSWRConfig();
    const [showFirstName, setShowFirstName] = useState<boolean>(true);
    const [showLastName, setShowLastName] = useState<boolean>(true);
    const [searchVal, setSearchVal] = useState<string>('');
    const [inputVal, setInputVal] = useState<string>('');
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const {
        data,
        isLoading,
        error,
        mutate: dataMutate,
    } = useAllPlayers({ showFirstName, showLastName, searchVal });

    async function deleteData(id: number) {
        try {
            setDeletingId(id);
            await deleter(`/api/players/${id}`);
            dataMutate();
            mutate(`/api/player/${id}`);
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
    }, [showFirstName, showLastName, searchVal, dataMutate]);

    if (error) {
        return (
            <Center>
                <Alert color='red'>
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
                    checked={showFirstName}
                    onChange={(event) =>
                        setShowFirstName(event.currentTarget.checked)
                    }
                    label='Show First Name'
                />
                <Switch
                    checked={showLastName}
                    onChange={(event) =>
                        setShowLastName(event.currentTarget.checked)
                    }
                    label='Show Last Name'
                />
            </Flex>
            <Stack>
                <TextInput
                    label='Search by value'
                    placeholder='LeBron, Jordan, etc'
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
                        {showFirstName && <TableTh>First Name</TableTh>}
                        {showLastName && <TableTh>Last Name</TableTh>}
                        <TableTh>Actions</TableTh>
                    </TableTr>
                </TableThead>
                <TableTbody>
                    {data?.map((player) => (
                        <TableTr key={player.playerID}>
                            <TableTd>{player.playerID}</TableTd>
                            {showFirstName && (
                                <TableTd>{player.firstName}</TableTd>
                            )}
                            {showLastName && (
                                <TableTd>{player.lastName}</TableTd>
                            )}
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
                                    loading={deletingId === player.playerID}
                                    onClick={() => deleteData(player.playerID)}
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
