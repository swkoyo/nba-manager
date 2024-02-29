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
import useSWR, { useSWRConfig } from 'swr';
import { PlayoffRound } from '@/lib/types';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { revalidateTag } from '../actions';

export default function PlayoffDataView() {
    const { mutate } = useSWRConfig();
    const [showName, setShowName] = useState<boolean>(true);
    const [searchVal, setSearchVal] = useState<string>('');

    const { data, isLoading, isValidating } = useSWR<PlayoffRound[]>(
        '/api/playoffRounds',
        async () => {
            let url = '/api/playoffRounds';
            const params: string[] = [];
            if (showName) {
                params.push('name');
            }
            url += `?filter=${params.join(',')}`;
            if (searchVal) {
                url += `&search=${searchVal}`;
            }
            const res = await fetch(url);
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text);
            }
            return res.json();
        },
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateOnMount: false,
        }
    );

    async function deleteData(id: number) {
        try {
            await fetch(`/api/playoffRounds/${id}`, {
                method: 'DELETE',
            });
            mutate('/api/playoffRounds');
            mutate('/api/rosters');
            revalidateTag('playoffRounds');
            revalidateTag('rosters');
        } catch (err) {
            console.error(err);
        }
    }

    function onClick() {
        mutate('/api/playoffRounds');
    }

    useEffect(() => {
        mutate('/api/playoffRounds');
    }, [showName, mutate]);

    if (isLoading || isValidating) return <div>Loading...</div>;

    return (
        <>
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
                    value={searchVal}
                    onChange={(event) =>
                        setSearchVal(event.currentTarget.value)
                    }
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
