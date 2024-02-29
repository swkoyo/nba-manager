import { Button, Center, Space, Title } from '@mantine/core';
import Link from 'next/link';
import RosterDataView from './rosterDataView';

export default function Rosters() {
    return (
        <>
            <Center>
                <Title order={1}>Browse Rosters</Title>
            </Center>
            <Space h='md' />
            <Button component={Link} href='/rosters/new' w='100%'>
                Add New Roster
            </Button>
            <Space h='md' />
            <RosterDataView />
        </>
    );
}
