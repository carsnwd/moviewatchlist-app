import { Button, Flex, TextInput, useMantineTheme } from '@mantine/core'
import { IconBrandGithub, IconBrandGoogle } from '@tabler/icons-react'

export default function AuthPanel(props: { authType: 'login' | 'register' }) {
    const theme = useMantineTheme();

    const getOAuthBtnVerbiage = () => {
        //returns props.authType with capitalized first letter
        return props.authType.charAt(0).toUpperCase() + props.authType.slice(1);
    }

    return (
        <>
            <TextInput label="Email" />
            <TextInput label="Password" type="password" mb="sm" />
            <Flex direction={'column'} gap="sm">
                <Button>Submit</Button>
                <Button color={theme.colors.red[9]} leftSection={<IconBrandGoogle />}>{getOAuthBtnVerbiage()} with Google</Button>
                <Button color={theme.colors.gray[9]} leftSection={<IconBrandGithub />}>{getOAuthBtnVerbiage()} with Github</Button>
            </Flex>
        </>
    )
}
