import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { Button, useMantineTheme } from '@mantine/core';
import { auth } from '@/firebaseConfig'
import { useNavigate } from 'react-router-dom';

export default function AuthBtns() {
    const { userName } = useAuth();
    const theme = useMantineTheme();
    const navigate = useNavigate();

    const renderLogoutBtn = () => {
        return (<Button m={2} color={theme.colors.red[9]} onClick={() => {
            auth.signOut();
            navigate('/');
        }}>Logout</Button>)
    }

    const renderLoginSignUpBtns = () => {
        return (<div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button m={2} onClick={() => {
                navigate('/auth');
            }}>Login</Button>
            <Button m={2}>Register</Button>
        </div>)
    }

    return (
        <>
            {userName ? renderLogoutBtn() : renderLoginSignUpBtns()}
        </>
    )
}
