import { Title } from '@mantine/core'
import { IconMovie } from '@tabler/icons-react'

export default function AppTitle() {
    return (
        <>
            <Title order={1} style={{ display: "flex", alignItems: "center" }}>
                <IconMovie size={52} style={{ marginRight: 10 }} />
                Movie Watchlist
            </Title>
        </>
    )
}
