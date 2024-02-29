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
import { Player } from '@/lib/types';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { revalidateTag } from '../actions';

export default function PlayerDataView() {
    const { mutate } = useSWRConfig();
    const [showFirstName, setShowFirstName] = useState<boolean>(true);
    const [showLastName, setShowLastName] = useState<boolean>(true);
    const [searchVal, setSearchVal] = useState<string>('');

    const { data, isLoading, isValidating } = useSWR<Player[]>(
        '/api/players',
        async () => {
            let url = '/api/players';
            const params: string[] = [];
            if (showFirstName) {
                params.push('firstName');
            }
            if (showLastName) {
                params.push('lastName');
            }
            url += `?filter=${params.join(',')}`;
            if (searchVal) {
                url += `&search=${searchVal}`;
            }
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error('Failed to fetch data');
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
            await fetch(`/api/players/${id}`, {
                method: 'DELETE',
            });
            mutate('/api/players');
            mutate('/api/rosters');
            revalidateTag('available');
        } catch (err) {
            console.error(err);
        }
    }

    function onClick() {
        mutate('/api/players');
    }

    useEffect(() => {
        mutate('/api/players');
    }, [showFirstName, showLastName, mutate]);

    if (isLoading || isValidating) return <div>Loading...</div>;

    return (
        <>
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
