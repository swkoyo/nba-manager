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
import { useAllPlayoffRounds } from '../swr';
import { deleter } from '../fetcher';

export default function PlayoffDataView() {
    const { mutate } = useSWRConfig();
    const [showName, setShowName] = useState<boolean>(true);
    const [searchVal, setSearchVal] = useState<string>('');
    const [inputVal, setInputVal] = useState<string>('');
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const {
        data,
        isLoading,
        error,
        mutate: dataMutate,
    } = useAllPlayoffRounds({ showName, searchVal });

    async function deleteData(id: number) {
        try {
            setDeletingId(id);
            await deleter(`/api/playoffRounds/${id}`);
            dataMutate();
            mutate(`/api/playoffRounds/${id}`);
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
    }, [showName, searchVal, dataMutate]);

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
                    checked={showName}
                    onChange={(event) =>
                        setShowName(event.currentTarget.checked)
                    }
                    label='Show Name'
                />
            </Flex>
            <Stack>
                <TextInput
                    label='Search by value'
                    placeholder='NBA Finals, Finals, etc'
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
                        <TableTh>Actions</TableTh>
                    </TableTr>
                </TableThead>
                <TableTbody>
                    {data?.map((playoffRound) => (
                        <TableTr key={playoffRound.playoffRoundID}>
                            <TableTd>{playoffRound.playoffRoundID}</TableTd>
                            <TableTd>{playoffRound.name}</TableTd>
                            <TableTd>
                                <Button
                                    size='xs'
                                    radius='xl'
                                    mr={10}
                                    component={Link}
                                    href={`/playoffRounds/${playoffRound.playoffRoundID}/edit`}
                                >
                                    Edit
                                </Button>
                                <Button
                                    onClick={() =>
                                        deleteData(playoffRound.playoffRoundID)
                                    }
                                    loading={deletingId === playoffRound.playoffRoundID}
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
