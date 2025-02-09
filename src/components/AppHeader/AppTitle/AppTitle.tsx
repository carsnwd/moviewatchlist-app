import { Title } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks';
import { IconMovie } from '@tabler/icons-react'

export default function AppTitle() {
    const isSmallScreen = useMediaQuery('(max-width: 768px)');
    return (
        <>
            <Title order={1} style={{
                display: "flex", alignItems: "center",
                fontSize: isSmallScreen ? '1.5rem' : '2.5rem',
            }}>
                <IconMovie size={isSmallScreen ? 32 : 55} style={{ marginRight: 10 }} />
                Movie Watchlist
            </Title>
        </>
    )
}
