import { Center, Space, Title } from '@mantine/core';
import PlayerForm from '../playerForm';

export default function AddNewPlayerPage() {
    return (
        <>
            <Center>
                <Title order={1}>Add New Player</Title>
            </Center>
            <Space h='md' />
            <PlayerForm />
        </>
    );
}
