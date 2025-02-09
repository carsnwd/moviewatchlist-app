import { Tabs } from '@mantine/core';
import AuthPanel from './AuthPanel/AuthPanel';

export default function AppAuth() {
    return (
        <Tabs defaultValue="login">
            <Tabs.List grow={true}>
                <Tabs.Tab value="login">Login</Tabs.Tab>
                <Tabs.Tab value="register">Register</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="login">
                <AuthPanel authType="login" />
            </Tabs.Panel>
            <Tabs.Panel value="register">
                <AuthPanel authType="register" />
            </Tabs.Panel>
        </Tabs >
    )
}
