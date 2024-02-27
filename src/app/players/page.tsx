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

const data: Player[] = [
    {
        playerID: 1,
        firstName: 'LeBron',
        lastName: 'James',
    },
    { playerID: 2, firstName: 'Kevin', lastName: 'Durant' },
];

export default function Players() {
    const [opened, { open, close }] = useDisclosure(false);
    const [currentPlayer, setCurrentPlayer] = useState<Player | undefined>(
        undefined
    );

    function closeModal() {
        setCurrentPlayer(undefined);
        close();
    }

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
                    {data.map((d) => (
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
