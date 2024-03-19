import { Center, Space, Title } from '@mantine/core';
import { Suspense } from 'react';
import NewPlayerLoading from './loading';

// NOTE: Citation
// Date: 03/18/24
// The Suspense component used here is reference from the official Next.js documentation
// It is a component that lets you “wait” for some code to load and declaratively specify a loading state (like a spinner) to show while the code is loading.
// Source URL: https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming

export default function NewPlayerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Center>
                <Title order={2}>Add New Player</Title>
            </Center>
            <Space h='md' />
            <Suspense fallback={<NewPlayerLoading />}>{children}</Suspense>
        </>
    );
}
