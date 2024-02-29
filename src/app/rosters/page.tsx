'use client';

import { FullRoster } from '@/lib/types';
import {
    Button,
    Flex,
    Modal,
    Space,
    Table,
    TableTbody,
    TableTh,
    TableThead,
    TableTr,
    Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import RosterForm from './components/rosterForm';
import RosterRow from './components/rosterRow';

export default function Rosters() {
    const [opened, { open, close }] = useDisclosure(false);
    const [currentRoster, setCurrentRoster] = useState<FullRoster | undefined>(
        undefined
    );
    const [rosters, setRosters] = useState<FullRoster[]>([]);

    async function getData() {
        try {
            let resp = await fetch('/api/rosters', {
                method: 'GET',
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await resp.json();

            console.log('Recieved from API : ', data);

            setRosters(data);
        } catch (e) {
            throw new Error('Error occured while calling Location API');
        }
    }

    function closeModal() {
        setCurrentRoster(undefined);
        close();
    }

    useEffect(() => {
        getData();
    });

    useEffect(() => {
        if (currentRoster) {
            open();
        }
    }, [currentRoster, open]);
    return (
        <>
            <Modal
                opened={opened}
                onClose={closeModal}
                title={`${currentRoster ? 'Edit' : 'Add'} Roster`}
            >
                <RosterForm close={closeModal} roster={currentRoster} />
            </Modal>
            <Flex align='center' justify='space-between'>
                <Title order={1}>Browse Roster</Title>
                <Button onClick={open}>Add New Roster</Button>
            </Flex>
            <Space h='md' />
            <Table>
                <TableThead>
                    <TableTr>
                        <TableTh>ID</TableTh>
                        <TableTh>Year</TableTh>
                        <TableTh>Team</TableTh>
                        <TableTh>Playoff Round</TableTh>
                        <TableTh>Players</TableTh>
                        <TableTh>Actions</TableTh>
                    </TableTr>
                </TableThead>
                <TableTbody>
                    {rosters.map((d) => (
                        <RosterRow
                            key={d.rosterID}
                            roster={d}
                            setCurrentRoster={setCurrentRoster}
                        />
                    ))}
                </TableTbody>
            </Table>
        </>
    );
}
