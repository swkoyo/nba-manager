import { Button, Center, Space, Title } from '@mantine/core';
import Link from 'next/link';
import PlayerDataView from './playerDataView';

export default function Players() {
    return (
        <>
            <Center>
                <Title order={1}>Browse Players</Title>
            </Center>
            <Space h='md' />
            <Button component={Link} href='/players/new' w='100%'>
                Add New Players
            </Button>
            <Space h='md' />
            <PlayerDataView />
        </>
    );
}
