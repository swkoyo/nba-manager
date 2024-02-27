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

const data: FullRoster[] = [
    {
        rosterID: 1,
        year: '2024',
        team: 'Los Angeles Lakers',
        playoffRound: 'Conference Finals',
        players: [
            'LeBron James',
            'Anthony Davis',
            "D'Angelo Russell",
            'Austin Reaves',
            'Jaxson Hayes',
        ],
    },
    {
        rosterID: 2,
        year: '2023',
        team: 'Los Angeles Lakers',
        playoffRound: '',
        players: [
            'LeBron James',
            'Anthony Davis',
            "D'Angelo Russell",
            'Russell Westbrook',
            'Rajon Rondo',
        ],
    },
];

export default function Rosters() {
    const [opened, { open, close }] = useDisclosure(false);
    const [currentRoster, setCurrentRoster] = useState<FullRoster | undefined>(
        undefined
    );

    function closeModal() {
        setCurrentRoster(undefined);
        close();
    }

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
                    {data.map((d) => (
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
