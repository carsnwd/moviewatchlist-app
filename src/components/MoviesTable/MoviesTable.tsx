import { Movie } from '@/services/WatchlistAPIService/models/Movie';
import { Watchlist } from '@/services/WatchlistAPIService/models/Watchlist'
import { MantineReactTable, MRT_ColumnDef, useMantineReactTable } from 'mantine-react-table';
import React, { useMemo } from 'react'

export default function MoviesTable(watchlist: Watchlist) {
    //should be memoized or stable
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

    return <MantineReactTable table={table} />;
}
