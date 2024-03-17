import { Button, Space } from '@mantine/core';
import Link from 'next/link';
import PlayerDataView from './playerDataView';

export default function Players() {
    return (
        <>
            <Button component={Link} href='/players/new' w='100%'>
                Add New Players
            </Button>
            <Space h='md' />
            <PlayerDataView />
        </>
    );
}
