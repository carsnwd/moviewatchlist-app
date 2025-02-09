import { AuthService } from '@/services/AuthService/AuthService';
import { Button, Flex, TextInput, Text, useMantineTheme } from '@mantine/core'
import { IconBrandGithub, IconBrandGoogle } from '@tabler/icons-react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthPanel(props: { authType: 'login' | 'register', authService?: AuthService }) {
    const { authService = AuthService.getInstance() } = props;
    const theme = useMantineTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const getOAuthBtnVerbiage = () => {
        //returns props.authType with capitalized first letter
        return props.authType.charAt(0).toUpperCase() + props.authType.slice(1);
    }

    const emailAndPasswordAuth = async () => {
        try {
            if (props.authType === 'login') {
                await authService.loginWithEmailPassword(email, password);
            } else {
                await authService.registerWithEmailPassword(email, password);
            }
            navigate('/');
        } catch (error: any) {
            setError(error?.message);
        }
    }

    const handleOAuthLogin = async (type: "google" | "github") => {
        type === "google" ? await authService.handleGoogleLogin() : await authService.handleGithubLogin();
        navigate('/');
    }

    return (
        <>
            <TextInput label="Email" value={email} onChange={(event) => setEmail(event.currentTarget.value)} />
            <TextInput label="Password" value={password} onChange={(event) => setPassword(event.currentTarget.value)} type="password" mb="sm" />
            <Text c={theme.colors.red[9]}>{error}</Text>
            <Flex direction={'column'} gap="sm">
                <Button onClick={() => emailAndPasswordAuth()}>Submit</Button>
                <Button color={theme.colors.red[9]} leftSection={<IconBrandGoogle />} onClick={() => handleOAuthLogin("google")}>{getOAuthBtnVerbiage()} with Google</Button>
                <Button color={theme.colors.gray[9]} leftSection={<IconBrandGithub />} onClick={() => handleOAuthLogin("github")}>{getOAuthBtnVerbiage()} with Github</Button>
            </Flex >
        </>
    )
}
