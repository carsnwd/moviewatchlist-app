import { Movie } from '@/services/WatchlistAPIService/models/Movie';
import { MantineReactTable, MRT_ColumnDef, useMantineReactTable } from 'mantine-react-table';
import { useMemo, useState } from 'react'
import MovieSearchModal from '../AddMovieModal/AddMovieModal';
import { ActionIcon, Box, Button, Group, useMantineTheme } from '@mantine/core';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { WatchlistAPIService } from '@/services/WatchlistAPIService/WatchlistAPIService';
import { IconEdit, IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react';

export default function MoviesTable(props: { watchlistAPIService?: WatchlistAPIService }) {
    const { watchlistAPIService = WatchlistAPIService.getInstance() } = props;
    const [modalOpened, setModalOpened] = useState(false);
    const { watchlist, refetchWatchlist } = useWatchlist();
    const theme = useMantineTheme();
    const columns = useMemo<MRT_ColumnDef<Movie>[]>(
        () => [
            {
                accessorKey: 'title', //access nested data with dot notation
                header: 'Title',
            },
            {
                accessorKey: 'id',
                header: 'TMDB ID',
            },
            {
                accessorKey: 'releaseDate', //normal accessorKey
                header: 'Release Date',
            },
            {
                accessorKey: 'language',
                header: 'Language',
            },
            {
                accessorKey: 'fileName',
                header: 'File Name',
            },
            {
                accessorKey: 'fileSize',
                header: 'File Size',
            },
            {
                accessorKey: 'overview',
                header: 'Overview',
            },
        ],
        [],
    );

    const table = useMantineReactTable({
        columns,
        data: watchlist.movies,
        initialState: {
            columnVisibility: {
                overview: false
            }
        },
        enableRowActions: true,
        renderRowActions: ({ row }) => (
            <Box>
                <ActionIcon variant="subtle" onClick={() => console.info({ "Edit": row })}>
                    <IconEdit />
                </ActionIcon>
                <ActionIcon variant="subtle" color={theme.colors.red[9]} onClick={() => console.info({ "Delete": row })}>
                    <IconTrash />
                </ActionIcon>
            </Box>
        ),
    });

    const handleAddMovieSubmit = async (movieId: string, fileName?: string, fileSize?: number) => {
        await watchlistAPIService.addMovieToWatchlist({ movieId, fileName, fileSize });
        refetchWatchlist();
    };

    return <>
        <Group mb={10} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={() => setModalOpened(true)} leftSection={<IconPlus />}>Add Movie</Button>
            <Button variant='subtle' onClick={refetchWatchlist} leftSection={<IconRefresh />}>Refresh</Button>
        </Group>
        <MovieSearchModal
            opened={modalOpened}
            onClose={() => setModalOpened(false)}
            onSubmit={handleAddMovieSubmit}
        />
        <MantineReactTable table={table} />
    </>
}
