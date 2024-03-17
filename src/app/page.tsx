import { Stack, Text } from '@mantine/core';
import { IconPlayBasketball } from '@tabler/icons-react';

export default function Home() {
    return (
        <Stack>
            <IconPlayBasketball size={100} />
            <Text size='xl'>
                Welcome to NBA Manager! This app let&apos;s you keep track of all
                NBA teams, players, and rosters. Use the buttons on the left to
                navigate through the site.
            </Text>
        </Stack>
    );
}
