import { Center, Space, Title } from '@mantine/core';
import TeamForm from '../teamForm';

export default function AddNewTeam() {
    return (
        <>
            <Center>
                <Title order={1}>Add New Team</Title>
            </Center>
            <Space h='md' />
            <TeamForm />
        </>
    );
}
