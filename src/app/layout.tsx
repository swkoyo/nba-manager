import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
// import './globals.css';
import '@mantine/core/styles.css';

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

// const inter = Inter({ subsets: ['latin'] });

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
            {/* <body className={inter.className}> */}
            <body>
                <MantineProvider defaultColorScheme='dark' theme={theme}>
                    <AppShell
                        header={{ height: 60 }}
                        navbar={{ width: 300, breakpoint: 'sm' }}
                        padding='md'
                    >
                        <AppShellHeader p="md">
                            <div>NBA MANAGER</div>
                        </AppShellHeader>
                        <AppShellNavbar p="md">
                            <Button variant="subtle" component={Link} href="/">Home</Button>
                            <Button variant="subtle" component={Link} href="/rosters">Rosters</Button>
                            <Button variant="subtle" component={Link} href="/players">Players</Button>
                            <Button variant="subtle" component={Link} href="/teams">Teams</Button>
                            <Button variant="subtle" component={Link} href="/playoffRounds">Playoff Rounds</Button>
                        </AppShellNavbar>
                        <AppShellMain>
                            <Container>{children}</Container>
                        </AppShellMain>
                    </AppShell>
                </MantineProvider>
            </body>
        </html>
    );
}
