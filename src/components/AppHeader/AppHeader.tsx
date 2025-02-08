import { AppShell } from '@mantine/core'
import AppTitle from './AppTitle/AppTitle'
import AuthBtns from './AuthBtns/AuthBtns'
export default function AppHeader() {
    return (
        <AppShell.Header>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <AppTitle />
                <AuthBtns />
            </div>
        </AppShell.Header>
    )
}
