import { Button, Space } from '@mantine/core';
import Link from 'next/link';
import TeamDataView from './teamDataView';

export default function Teams() {
    return (
        <>
            <Button component={Link} href='/teams/new' w='100%'>
                Add New Team
            </Button>
            <Space h='md' />
            <TeamDataView />
        </>
    );
}
