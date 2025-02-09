import '@mantine/core/styles.css';
import '@mantine/core/styles.css'; //import Mantine V7 styles needed by MRT
import '@mantine/dates/styles.css'; //if using mantine date picker features
import 'mantine-react-table/styles.css'; //import MRT styles

import { MantineProvider } from '@mantine/core';
import { theme } from './theme';
import { AuthProvider } from '@/contexts/AuthContext';
import { WatchlistProvider } from '@/contexts/WatchlistContext';
import { AppRouter } from './Router';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <AuthProvider>
        <WatchlistProvider>
          <AppRouter />
        </WatchlistProvider>
      </AuthProvider>
    </MantineProvider >
  );
}
