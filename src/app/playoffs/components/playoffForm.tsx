import { PlayoffRound } from '@/lib/types';
import { Box, Button, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

interface Props {
    round?: PlayoffRound;
    close: () => void;
}

export default function PlayoffForm({ round, close }: Props) {
    const form = useForm({
        initialValues: {
            name: round?.name || '',
        },
        validate: {
            name: (value) =>
                value.length >= 3 ? null : 'Invalid playoff round name',
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
                    placeholder='Championship'
                    {...form.getInputProps('name')}
                />
                <Group justify='flex-end' mt='md'>
                    <Button type='submit'>Apply</Button>
                </Group>
            </form>
        </Box>
    );
}
