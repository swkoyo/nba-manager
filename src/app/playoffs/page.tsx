'use client';

import { PlayoffRound } from '@/lib/types';
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
import PlayoffForm from './components/playoffForm';
import PlayoffRow from './components/playoffRow';

export default function Playoffs() {
    const [opened, { open, close }] = useDisclosure(false);
    const [currentRound, setCurrentRound] = useState<PlayoffRound | undefined>(
        undefined
    );
    const [rounds, setRounds] = useState<PlayoffRound[]>([]);

    async function getData() {
        try {
            let resp = await fetch('/api/playoffs', {
                method: 'GET',
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await resp.json();

            console.log('Recieved from API : ', data);

            setRounds(data);
        } catch (e) {
            throw new Error('Error occured while calling Location API');
        }
    }

    function closeModal() {
        setCurrentRound(undefined);
        close();
    }

    useEffect(() => {
        getData();
    });

    useEffect(() => {
        if (currentRound) {
            open();
        }
    }, [currentRound, open]);

    return (
        <>
            <Modal
                opened={opened}
                onClose={closeModal}
                title={`${currentRound ? 'Edit' : 'Add'} Playoff Round`}
            >
                <PlayoffForm close={closeModal} round={currentRound} />
            </Modal>
            <Flex align='center' justify='space-between'>
                <Title order={1}>Browse Playoff Rounds</Title>
                <Button onClick={open}>Add New Playoff Round</Button>
            </Flex>
            <Space h='md' />
            <Table>
                <TableThead>
                    <TableTr>
                        <TableTh>ID</TableTh>
                        <TableTh>Playoff Round</TableTh>
                        <TableTh>Actions</TableTh>
                    </TableTr>
                </TableThead>
                <TableTbody>
                    {rounds.map((d) => (
                        <PlayoffRow
                            key={d.playoffRoundID}
                            round={d}
                            setCurrentRound={setCurrentRound}
                        />
                    ))}
                </TableTbody>
            </Table>
        </>
    );
}
