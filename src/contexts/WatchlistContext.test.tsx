import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAuth } from '@/contexts/AuthContext';
import { WatchlistProvider, useWatchlist } from './WatchlistContext';
import { WatchlistAPIService } from '@/services/WatchlistAPIService/WatchlistAPIService';

jest.mock('@/contexts/AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('@/services/WatchlistAPIService/WatchlistAPIService', () => ({
    WatchlistAPIService: jest.fn(),
}));

const TestComponent = () => {
    const { watchlist, loading, error, refetchWatchlist } = useWatchlist();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <div>Watchlist: {JSON.stringify(watchlist)}</div>
            <button onClick={refetchWatchlist}>Refetch</button>
        </div>
    );
};

describe('WatchlistContext', () => {
    //@ts-ignore
    const mockWatchlistAPIService: WatchlistAPIService = {
        getWatchlist: jest.fn(),
        parseWatchlistFromGetRequest: jest.fn(),
        searchMovies: jest.fn(),
        addMovieToWatchlist: jest.fn(),
        removeMovieFromWatchlist: jest.fn(),
        updateMovieInWatchlist: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch watchlist when user is authenticated', async () => {
        (useAuth as jest.Mock).mockReturnValue({
            authInitialized: true,
            user: { uid: '123' },
        });

        const mockWatchlist = { movies: [{ id: '1', title: 'Inception' }] };
        (mockWatchlistAPIService.getWatchlist as jest.Mock).mockResolvedValue(mockWatchlist);

        render(
            <WatchlistProvider watchlistAPIService={mockWatchlistAPIService}>
                <TestComponent />
            </WatchlistProvider>
        );

        await waitFor(() => expect(screen.getByText(/Watchlist:/)).toBeInTheDocument());
        expect(screen.getByText(/Inception/)).toBeInTheDocument();
    });

    it('should show loading state initially', () => {
        (useAuth as jest.Mock).mockReturnValue({
            authInitialized: false,
            user: null,
        });

        render(
            <WatchlistProvider watchlistAPIService={mockWatchlistAPIService}>
                <TestComponent />
            </WatchlistProvider>
        );

        expect(screen.getByText(/Loading.../)).toBeInTheDocument();
    });

    it('should show error state if fetching watchlist fails', async () => {
        (useAuth as jest.Mock).mockReturnValue({
            authInitialized: true,
            user: { uid: '123' },
        });

        (mockWatchlistAPIService.getWatchlist as jest.Mock).mockRejectedValue(new Error('Failed to fetch watchlist'));

        render(
            <WatchlistProvider watchlistAPIService={mockWatchlistAPIService}>
                <TestComponent />
            </WatchlistProvider>
        );

        await waitFor(() => expect(screen.getByText(/Error:/)).toBeInTheDocument());
        expect(screen.getByText(/Failed to fetch watchlist/)).toBeInTheDocument();
    });
});