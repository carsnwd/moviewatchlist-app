import { Movie } from '@/services/WatchlistAPIService/models/Movie';
import { MantineReactTable, MRT_ColumnDef, useMantineReactTable } from 'mantine-react-table';
import { useMemo, useState } from 'react'
import MovieSearchModal from '../AddMovieModal/AddMovieModal';
import { Button } from '@mantine/core';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { WatchlistAPIService } from '@/services/WatchlistAPIService/WatchlistAPIService';

export default function MoviesTable(props: { watchlistAPIService?: WatchlistAPIService }) {
    const { watchlistAPIService = WatchlistAPIService.getInstance() } = props;
    const [modalOpened, setModalOpened] = useState(false);
    const { watchlist, refetchWatchlist } = useWatchlist();
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
        }
    });

    const handleModalSubmit = async (movieId: string, fileName?: string, fileSize?: number) => {
        await watchlistAPIService.addMovieToWatchlist({ movieId, fileName, fileSize });
        refetchWatchlist();
    };

    return <>
        <Button onClick={() => setModalOpened(true)}>Add Movie</Button>
        <MovieSearchModal
            opened={modalOpened}
            onClose={() => setModalOpened(false)}
            onSubmit={handleModalSubmit}
        />
        <MantineReactTable table={table} />
    </>
}
