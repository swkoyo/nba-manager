import { STATES } from '@/lib/constants';
import { Team } from '@/lib/types';
import { Box, Button, Group, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

interface Props {
    team?: Team;
    close: () => void;
}

export default function TeamForm({ team, close }: Props) {
    const form = useForm({
        initialValues: {
            name: team?.name || '',
            city: team?.city || '',
            state: team?.state || '',
        },
        validate: {
            name: (value) =>
                value.length >= 3 ? null : 'Invalid playoff round name',
            city: (value) => (value.length >= 3 ? null : 'Invalid team city'),
            state: (value) =>
                STATES.includes(value) ? null : 'Invalid team state',
        },
    });

    function handleSubmit() {
        close();
    }

    return (
        <Box mx='auto'>
            <form onSubmit={form.onSubmit(() => handleSubmit())}>
                <TextInput
                    withAsterisk
                    label='Name'
                    placeholder='Globetrotters'
                    {...form.getInputProps('name')}
                />
                <TextInput
                    withAsterisk
                    label='City'
                    placeholder='Harlem'
                    {...form.getInputProps('city')}
                />
                <Select
                    withAsterisk
                    label='State'
                    placeholder='NY'
                    data={STATES}
                    {...form.getInputProps('state')}
                />
                <Group justify='flex-end' mt='md'>
                    <Button type='submit'>Apply</Button>
                </Group>
            </form>
        </Box>
    );
}
