import { Movie } from '@/services/WatchlistAPIService/models/Movie';
import { MantineReactTable, MRT_ColumnDef, useMantineReactTable } from 'mantine-react-table';
import { useMemo, useState } from 'react'
import MovieSelectionModal from '../modals/MovieSelectionModal/MovieSelectionModal';
import { ActionIcon, Box, Button, Group, useMantineTheme } from '@mantine/core';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { WatchlistAPIService } from '@/services/WatchlistAPIService/WatchlistAPIService';
import { IconEdit, IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react';
import RemoveMovieModal from '../modals/RemoveMovieModal/RemoveMovieModal';

export default function MoviesTable(props: { watchlistAPIService?: WatchlistAPIService }) {
    const { watchlistAPIService = WatchlistAPIService.getInstance() } = props;
    const [movieSelectionModal, setMovieSelectionModalOpened] = useState(false);
    const [addOrEditState, setAddOrEditState] = useState<'add' | 'edit'>('add');
    const [removeMovieModalOpened, setRemoveMovieModalOpened] = useState(false);
    const [{ selectedMovieTitle, selectedMovieId, selectedFileName, selectedFileSize }, setSelectedMovieData] = useState({ selectedMovieTitle: '', selectedMovieId: '', selectedFileName: '', selectedFileSize: 0 });
    const { watchlist, refetchWatchlist, loading } = useWatchlist();
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
        state: { isLoading: loading },
        initialState: {
            columnVisibility: {
                overview: false
            }
        },
        enableRowActions: true,
        renderRowActions: ({ row }) => (
            <Box>
                <ActionIcon variant="subtle" onClick={() => {
                    setAddOrEditState('edit');
                    setSelectedMovieData({
                        selectedMovieTitle: row.original.title,
                        selectedMovieId: row.original.id,
                        selectedFileName: row.original.fileName ?? '',
                        selectedFileSize: row.original.fileSize ?? 0
                    });
                    setMovieSelectionModalOpened(true);
                }}>
                    <IconEdit />
                </ActionIcon>
                <ActionIcon variant="subtle" color={theme.colors.red[9]} onClick={() => {
                    setSelectedMovieData({
                        selectedMovieTitle: row.original.title,
                        selectedMovieId: row.original.id,
                        selectedFileName: row.original.fileName ?? '',
                        selectedFileSize: row.original.fileSize ?? 0
                    });
                    setRemoveMovieModalOpened(true);
                }}>
                    <IconTrash />
                </ActionIcon>
            </Box>
        ),
    });

    const handleAddMovieSubmit = async (movieId: string, fileName?: string, fileSize?: number) => {
        await watchlistAPIService.addMovieToWatchlist({ movieId, fileName, fileSize });
        refetchWatchlist();
    };

    const handleRemoveMovie = async (movieId: string) => {
        await watchlistAPIService.removeMovieFromWatchlist(movieId);
        refetchWatchlist();
    }

    const handleEditMovie = async (movieId: string, fileName?: string, fileSize?: number) => {
        await watchlistAPIService.updateMovieInWatchlist({ movieId, fileName, fileSize });
        refetchWatchlist();
    }

    return <>
        <Group mb={10} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={() => {
                setAddOrEditState('add');
                setSelectedMovieData({ selectedMovieTitle: '', selectedMovieId: '', selectedFileName: '', selectedFileSize: 0 });
                setMovieSelectionModalOpened(true);
            }} leftSection={<IconPlus />}>Add Movie</Button>
            <Button variant='subtle' onClick={refetchWatchlist} leftSection={<IconRefresh />}>Refresh</Button>
        </Group>
        <MovieSelectionModal
            opened={movieSelectionModal}
            onClose={() => setMovieSelectionModalOpened(false)}
            onSubmit={addOrEditState === 'add' ? handleAddMovieSubmit : handleEditMovie}
            initialMovieId={selectedMovieId}
            initialFileName={selectedFileName}
            initialFileSize={selectedFileSize}
            initialMovieTitle={selectedMovieTitle}

        />
        <RemoveMovieModal opened={removeMovieModalOpened} onClose={function (): void {
            setRemoveMovieModalOpened(false);
        }} onConfirm={function (): void {
            handleRemoveMovie(selectedMovieId);
            setRemoveMovieModalOpened(false);
        }} movieTitle={selectedMovieTitle} />
        <MantineReactTable table={table} />
    </>
}
