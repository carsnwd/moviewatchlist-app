import '@mantine/core/styles.css';

import { AppShell, MantineProvider } from '@mantine/core';
import { theme } from './theme';
import { AuthProvider } from '@/contexts/AuthContext/AuthContext';
import AppHeader from './components/AppHeader/AppHeader';
import { AppRouter } from './Router';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </MantineProvider >
  );
}
