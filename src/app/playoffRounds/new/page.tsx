import { Center, Space, Title } from '@mantine/core';
import PlayoffForm from '../playoffForm';

export default function AddNewPlayoffRound() {
    return (
        <>
            <Center>
                <Title order={1}>Add New Playoff Round</Title>
            </Center>
            <Space h='md' />
            <PlayoffForm />
        </>
    );
}
