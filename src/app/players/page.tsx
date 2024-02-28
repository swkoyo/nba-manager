'use client';

import { Player } from '@/lib/types';
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
import PlayerForm from './components/playerForm';
import PlayerRow from './components/playerRow';

export default function Players() {
    const [opened, { open, close }] = useDisclosure(false);
    const [currentPlayer, setCurrentPlayer] = useState<Player | undefined>(
        undefined
    );
    const [players, setPlayers] = useState<Player[]>([]);

    async function getData() {
        try {
            let resp = await fetch('/api/players', {
                method: 'GET',
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await resp.json();

            console.log('Recieved from API : ', data);

            setPlayers(data);
        } catch (e) {
            throw new Error('Error occured while calling Location API');
        }
    }

    function closeModal() {
        setCurrentPlayer(undefined);
        close();
    }

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        if (currentPlayer) {
            open();
        }
    }, [currentPlayer, open]);

    return (
        <>
            <Modal
                opened={opened}
                onClose={closeModal}
                title={`${currentPlayer ? 'Edit' : 'Add'} Player`}
            >
                <PlayerForm close={closeModal} player={currentPlayer} />
            </Modal>
            <Flex align='center' justify='space-between'>
                <Title order={1}>Browse Players</Title>
                <Button onClick={open}>Add New Player</Button>
            </Flex>
            <Space h='md' />
            <Table>
                <TableThead>
                    <TableTr>
                        <TableTh>ID</TableTh>
                        <TableTh>First Name</TableTh>
                        <TableTh>Last Name</TableTh>
                        <TableTh>Actions</TableTh>
                    </TableTr>
                </TableThead>
                <TableTbody>
                    {players.map((d) => (
                        <PlayerRow
                            key={d.playerID}
                            player={d}
                            setCurrentPlayer={setCurrentPlayer}
                        />
                    ))}
                </TableTbody>
            </Table>
        </>
    );
}
