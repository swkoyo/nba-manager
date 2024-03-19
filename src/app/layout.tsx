import '@mantine/core/styles.css';
import type { Metadata } from 'next';
import {
    AppShell,
    AppShellHeader,
    AppShellMain,
    Container,
    Flex,
    Title,
} from '@mantine/core';
import { ColorSchemeScript, MantineProvider, createTheme } from '@mantine/core';
import Navbar from './components/Navbar';
import { IconBallBasketball } from '@tabler/icons-react';

const theme = createTheme({
    fontFamily: 'Open Sans, sans-serif',
    primaryColor: 'cyan',
});

export const metadata: Metadata = {
    title: 'NBA Manager',
    description: 'An app that lets you keep track of NBA teams',
};

// NOTE: Citation
// Date: 03/17/2024
// The following code is based on the Mantine documentation and Next.js documentation
// RootLayout is a component that wraps the entire application. It provides a consistent layout for all pages.
// MantineProvider is a component that provides the Mantine theme and color scheme to the entire application.
// AppShellHeader is a component that provides a header section for the application.
// AppMain is a component that provides the main content area for the application.
// Next.js Source URL: https://nextjs.org/docs/getting-started/installation
// Mantine Source URL: https://mantine.dev/docs/getting-started/

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <head>
                <ColorSchemeScript />
            </head>
            <body>
                <MantineProvider defaultColorScheme='dark' theme={theme}>
                    <AppShell
                        header={{ height: 60 }}
                        navbar={{ width: 300, breakpoint: 'sm' }}
                        padding='md'
                    >
                        <AppShellHeader p='md'>
                            <Flex align='center'>
                                <IconBallBasketball />
                                <Title ml='xs' order={4}>
                                    NBA Manager
                                </Title>
                            </Flex>
                        </AppShellHeader>
                        <Navbar />
                        <AppShellMain>
                            <Container>{children}</Container>
                        </AppShellMain>
                    </AppShell>
                </MantineProvider>
            </body>
        </html>
    );
}
