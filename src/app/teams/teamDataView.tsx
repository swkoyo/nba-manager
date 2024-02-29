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
import { Team } from '@/lib/types';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function TeamDataView() {
    const { mutate } = useSWRConfig();
    const [showName, setShowName] = useState<boolean>(true);
    const [showCity, setShowCity] = useState<boolean>(true);
    const [showState, setShowState] = useState<boolean>(true);
    const [searchVal, setSearchVal] = useState<string>('');

    const { data, isLoading, isValidating } = useSWR<Team[]>(
        '/api/teams',
        async () => {
            let url = '/api/teams';
            const params: string[] = [];
            if (showName) {
                params.push('name');
            }
            if (showCity) {
                params.push('city');
            }
            if (showState) {
                params.push('state');
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
            await fetch(`/api/teams/${id}`, {
                method: 'DELETE',
            });
            mutate('/api/teams');
        } catch (err) {
            console.error(err);
        }
    }

    function onClick() {
        mutate('/api/teams');
    }

    useEffect(() => {
        mutate('/api/teams');
    }, [showName, showCity, showState, mutate]);

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
