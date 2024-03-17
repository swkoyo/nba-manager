import { Button, Space } from '@mantine/core';
import Link from 'next/link';
import RosterDataView from './rosterDataView';

export default function Rosters() {
    return (
        <>
            <Button component={Link} href='/rosters/new' w='100%'>
                Add New Roster
            </Button>
            <Space h='md' />
            <RosterDataView />
        </>
    );
}
