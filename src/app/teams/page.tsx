import { Button, Center, Space, Title } from '@mantine/core';
import Link from 'next/link';
import TeamDataView from './teamDataView';

export default function Teams() {
    return (
        <>
            <Center>
                <Title order={1}>Browse Team</Title>
            </Center>
            <Space h='md' />
            <Button component={Link} href='/teams/new' w='100%'>
                Add New Team
            </Button>
            <Space h='md' />
            <TeamDataView />
        </>
    );
}
