import { useState, useEffect } from 'react';
import { Autocomplete, Loader } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { WatchlistAPIService } from '@/services/WatchlistAPIService/WatchlistAPIService';

interface SearchComponentProps {
    onSelect: (value: string) => void;
    watchlistAPIService?: WatchlistAPIService;
    error: string | null;
}

export default function TmdbSearch({ onSelect, watchlistAPIService = WatchlistAPIService.getInstance(), error }: SearchComponentProps) {
    const [query, setQuery] = useState('');
    const [debouncedQuery] = useDebouncedValue(query, 300); // Debounce the query with a delay of 300ms
    const [data, setData] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (debouncedQuery.length === 0) {
            setData([]);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const results = await watchlistAPIService.searchMovies(debouncedQuery);
                setData(results.map((movie: { id: string, title: string }) => {
                    return {
                        value: movie.id,
                        label: movie.title,
                    }
                }));
            } catch (error) {
                console.error('Error fetching search results:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [debouncedQuery, watchlistAPIService]);

    return (
        <Autocomplete
            value={query}
            onChange={setQuery}
            data={data}
            rightSection={loading ? <Loader size="xs" /> : null}
            onOptionSubmit={(value: string) => onSelect(value)}
            placeholder="Search..."
            error={error}
        />
    );
}