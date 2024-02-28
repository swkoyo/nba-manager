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

export default function Teams() {
    const [opened, { open, close }] = useDisclosure(false);
    const [currentTeam, setCurrentTeam] = useState<Team | undefined>(undefined);
    const [teams, setTeams] = useState<Team[]>([]);

    function closeModal() {
        setCurrentTeam(undefined);
        close();
    }

    async function getData() {
        try {
            let resp = await fetch('/api/teams', {
                method: 'GET',
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await resp.json();

            console.log('Recieved from API : ', data);

            setTeams(data);
        } catch (e) {
            throw new Error('Error occured while calling Location API');
        }
    }

    useEffect(() => {
        getData();
    });

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
                    {teams.map((d) => (
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
