import { AppShellNavbar } from '@mantine/core';
import NavbarItem from './NavbarItem';

export default function Navbar() {
    return (
        <AppShellNavbar p='md'>
            <NavbarItem href='/' label='Home' />
            <NavbarItem href='/rosters' label='Rosters' />
            <NavbarItem href='/players' label='Players' />
            <NavbarItem href='/teams' label='Teams' />
            <NavbarItem href='/playoffRounds' label='Playoff Rounds' />
        </AppShellNavbar>
    );
}
