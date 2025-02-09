import { Movie } from '@/services/WatchlistAPIService/models/Movie';
import { Watchlist } from '@/services/WatchlistAPIService/models/Watchlist'
import { MantineReactTable, MRT_ColumnDef, useMantineReactTable } from 'mantine-react-table';
import React, { useMemo, useState } from 'react'
import TmdbSearch from '../TmdbSearch/TmdbSearch';
import MovieSearchModal from '../AddMovieModal/AddMovieModal';
import { Button } from '@mantine/core';

export default function MoviesTable(watchlist: Watchlist) {
    const [modalOpened, setModalOpened] = useState(false);
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

    const handleModalSubmit = (movieId: string, fileName?: string, fileSize?: number) => {
        console.log('Selected Movie ID:', movieId);
        console.log('File Name:', fileName);
        console.log('File Size:', fileSize);
    };

    return <>
        <Button onClick={() => setModalOpened(true)}>Add Movie</Button>
        <MovieSearchModal
            opened={modalOpened}
            onClose={() => setModalOpened(false)}
            onSubmit={handleModalSubmit}
        />
        <MantineReactTable table={table} />;
    </>
}
