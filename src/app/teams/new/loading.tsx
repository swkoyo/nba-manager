import { Skeleton, Stack } from '@mantine/core';

export default function NewTeamLoading() {
    return (
        <Stack>
            <Skeleton height={40} radius='md' style={{ width: '100%' }} />
            <Skeleton height={40} radius='md' style={{ width: '100%' }} />
            <Skeleton height={40} radius='md' style={{ width: '100%' }} />
        </Stack>
    );
}
