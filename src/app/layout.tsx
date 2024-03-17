import '@mantine/core/styles.css';
import type { Metadata } from 'next';
import {
    AppShell,
    AppShellHeader,
    AppShellNavbar,
    AppShellMain,
    Container,
    Button,
} from '@mantine/core';
import { ColorSchemeScript, MantineProvider, createTheme } from '@mantine/core';
import Link from 'next/link';
import Navbar from './components/Navbar';

const theme = createTheme({
    fontFamily: 'Open Sans, sans-serif',
    primaryColor: 'cyan',
});

export const metadata: Metadata = {
    title: 'NBA Manager',
    description: 'An app that lets you keep track of NBA teams',
};

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
                            <div>NBA MANAGER</div>
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
