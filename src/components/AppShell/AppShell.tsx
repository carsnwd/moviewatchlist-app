import { AppShell as MantineAppShell } from '@mantine/core';
import AppHeader from '../AppHeader/AppHeader';
import { ReactNode } from 'react';

export default function AppShell(props: { children: ReactNode }) {
    return (
        <MantineAppShell
            header={{ height: 72 }}
            padding="md"
        >
            <AppHeader />
            <MantineAppShell.Main>
                {props.children}
            </MantineAppShell.Main>
        </MantineAppShell>
    )
}
