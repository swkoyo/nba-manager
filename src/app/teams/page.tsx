'use client';

import { Team } from '@/lib/types';
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
import TeamForm from './components/teamForm';
import TeamRow from './components/teamRow';

const data: Team[] = [
    {
        teamID: 1,
        city: 'Miami',
        name: 'Heat',
        state: 'FL',
    },
    {
        teamID: 2,
        city: 'Phoenix',
        name: 'Suns',
        state: 'AZ',
    },
    {
        teamID: 3,
        city: 'Los Angeles',
        name: 'Lakers',
        state: 'CA',
    },
];

export default function Teams() {
    const [opened, { open, close }] = useDisclosure(false);
    const [currentTeam, setCurrentTeam] = useState<Team | undefined>(undefined);

    function closeModal() {
        setCurrentTeam(undefined);
        close();
    }

    useEffect(() => {
        if (currentTeam) {
            open();
        }
    }, [currentTeam, open]);
    return (
        <>
            <Modal
                opened={opened}
                onClose={closeModal}
                title={`${currentTeam ? 'Edit' : 'Add'} Team`}
            >
                <TeamForm close={closeModal} team={currentTeam} />
            </Modal>
            <Flex align='center' justify='space-between'>
                <Title order={1}>Browse Team</Title>
                <Button onClick={open}>Add New Team</Button>
            </Flex>
            <Space h='md' />
            <Table>
                <TableThead>
                    <TableTr>
                        <TableTh>ID</TableTh>
                        <TableTh>Name</TableTh>
                        <TableTh>City</TableTh>
                        <TableTh>State (ABR)</TableTh>
                        <TableTh>Actions</TableTh>
                    </TableTr>
                </TableThead>
                <TableTbody>
                    {data.map((d) => (
                        <TeamRow
                            key={d.teamID}
                            team={d}
                            setCurrentTeam={setCurrentTeam}
                        />
                    ))}
                </TableTbody>
            </Table>
        </>
    );
}
