import { Skeleton, Stack } from '@mantine/core';

export default function EditPlayoffRoundLoading() {
    return (
        <Stack>
            <Skeleton height={40} radius='md' style={{ width: '100%' }} />
            <Skeleton height={40} radius='md' style={{ width: '100%' }} />
            <Skeleton height={40} radius='md' style={{ width: '100%' }} />
        </Stack>
    );
}
