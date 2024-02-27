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

const data: PlayoffRound[] = [
    {
        playoffRoundID: 1,
        name: 'Conference Finals',
    },
];

export default function Playoffs() {
    const [opened, { open, close }] = useDisclosure(false);
    const [currentRound, setCurrentRound] = useState<PlayoffRound | undefined>(
        undefined
    );

    function closeModal() {
        setCurrentRound(undefined);
        close();
    }

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
                    {data.map((d) => (
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
