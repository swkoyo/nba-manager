import { Button, Space, Center, Title } from '@mantine/core';
import Link from 'next/link';
import PlayoffDataView from './playoffDataView';

export default function Playoffs() {
    return (
        <>
            <Center>
                <Title order={1}>Browse Playoff Rounds</Title>
            </Center>
            <Space h='md' />
            <Button w='100%' component={Link} href='/playoffRounds/new'>
                Add New Playoff Round
            </Button>
            <Space h='md' />
            <PlayoffDataView />
        </>
    );
}
