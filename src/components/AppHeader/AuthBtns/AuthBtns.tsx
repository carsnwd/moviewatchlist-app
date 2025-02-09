import { Button, LoadingOverlay, useMantineTheme } from '@mantine/core';
import { auth } from '@/firebaseConfig'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthBtns() {
    const { authInitialized, user } = useAuth();
    const theme = useMantineTheme();
    const navigate = useNavigate();

    const renderLogoutBtn = () => {
        return (<Button m={2} color={theme.colors.red[9]} onClick={() => {
            auth.signOut();
            navigate('/auth');
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

    if (!authInitialized) {
        return <LoadingOverlay />
    }

    return (
        <>
            {user ? renderLogoutBtn() : renderLoginSignUpBtns()}
        </>
    )
}
