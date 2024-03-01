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
import { useAllTeams } from '../swr';

export default function TeamDataView() {
    const [showName, setShowName] = useState<boolean>(true);
    const [showCity, setShowCity] = useState<boolean>(true);
    const [showState, setShowState] = useState<boolean>(true);
    const [searchVal, setSearchVal] = useState<string>('');
    const [inputVal, setInputVal] = useState<string>('');
    const { mutate } = useSWRConfig();

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
            await fetch(`/api/teams/${id}`, {
                method: 'DELETE',
            });
            dataMutate();
            mutate(`/api/teams/${id}`);
            mutate('/api/rosters');
            mutate('/api/available');
        } catch (err) {
            console.error(err);
        }
    }

    function onClick() {
        setSearchVal(inputVal);
    }

    useEffect(() => {
        dataMutate();
    }, [showName, showCity, showState, searchVal, dataMutate]);

    if (error) {
        return <div>Error</div>;
    }

    if (isLoading || !data) return <div>Loading...</div>;

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
