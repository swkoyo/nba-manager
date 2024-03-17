import { Button, Space } from '@mantine/core';
import Link from 'next/link';
import PlayoffDataView from './playoffDataView';

export default function Playoffs() {
    return (
        <>
            <Button w='100%' component={Link} href='/playoffRounds/new'>
                Add New Playoff Round
            </Button>
            <Space h='md' />
            <PlayoffDataView />
        </>
    );
}
