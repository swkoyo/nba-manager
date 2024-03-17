import { Skeleton, Stack } from '@mantine/core';

export default function EditPlayerLoading() {
    return (
        <Stack>
            <Skeleton height={40} radius='md' style={{ width: '100%' }} />
            <Skeleton height={40} radius='md' style={{ width: '100%' }} />
            <Skeleton height={40} radius='md' style={{ width: '100%' }} />
        </Stack>
    );
}
