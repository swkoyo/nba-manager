import { Player } from '@/lib/types';
import { Box, Button, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

interface Props {
    player?: Player;
    close: () => void;
}

export default function PlayerForm({ player, close }: Props) {
    const form = useForm({
        initialValues: {
            firstName: player?.firstName || '',
            lastName: player?.lastName || '',
        },
        validate: {
            firstName: (value) =>
                value.length >= 3 ? null : 'Invalid first name',
            lastName: (value) =>
                value.length >= 3 ? null : 'Invalid last name',
        },
    });

    function handleSubmit() {
        close();
    }

    return (
        <Box mx='auto'>
            <form onSubmit={form.onSubmit(() => handleSubmit)}>
                <TextInput
                    withAsterisk
                    label='First Name'
                    placeholder='John'
                    {...form.getInputProps('firstName')}
                />
                <TextInput
                    withAsterisk
                    label='Last Name'
                    placeholder='Doe'
                    {...form.getInputProps('lastName')}
                />
                <Group justify='flex-end' mt='md'>
                    <Button type='submit'>Apply</Button>
                </Group>
            </form>
        </Box>
    );
}
