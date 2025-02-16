import { WatchlistAPIService } from './WatchlistAPIService';
import { auth } from '@/firebaseConfig';
import { MoviesFactoryService } from '../MoviesFactoryService/MoviesFactoryService';

jest.mock('@/firebaseConfig', () => ({
    auth: {
        currentUser: {
            getIdToken: jest.fn(),
        },
    },
}));

jest.mock('../MoviesFactoryService/MoviesFactoryService', () => ({
    MoviesFactoryService: {
        getInstance: jest.fn(() => ({
            createMovie: jest.fn().mockReturnValue({
                title: 'Mulholland Drive',
                id: '1',
                language: 'en',
                releaseDate: '2001-10-19',
                overview: 'A great movie',
                fileSize: 1024,
                fileName: 'Mulholland Drive.mp4',
            })
        })),
    },
}));

jest.mock('./constants', () => ({
    WATCHLIST_API_URL: 'mock-watchlist-api-url',
}));

global.fetch = jest.fn();

describe('WatchlistAPIService', () => {
    let watchlistAPIService: WatchlistAPIService;
    let mockMoviesFactoryService: any;

    beforeEach(() => {
        watchlistAPIService = WatchlistAPIService.getInstance();
        mockMoviesFactoryService = MoviesFactoryService.getInstance();
        jest.clearAllMocks();
    });

    describe('getWatchlist', () => {

        it('should throw an error if the user is not authenticated', async () => {
            Object.defineProperty(auth, 'currentUser', {
                value: null,
                writable: true,
            });

            await expect(watchlistAPIService.getWatchlist()).rejects.toThrow('User is not authenticated');
        });

        it('should fetch the watchlist and parse the response', async () => {
            const mockToken = 'mock-token';
            const mockResponse = {
                movies: [
                    {
                        title: 'Mulholland Drive',
                        id: '1',
                        language: 'en',
                        release_date: '2001-10-19',
                        overview: 'A great movie',
                        file_size: 1024,
                        file_name: 'Mulholland Drive.mp4',
                    },
                ],
            };

            Object.defineProperty(auth, 'currentUser', {
                value: { getIdToken: jest.fn().mockResolvedValue(mockToken) },
                writable: true,
            });

            (fetch as jest.Mock).mockResolvedValue({
                json: jest.fn().mockResolvedValue(mockResponse),
            });
            mockMoviesFactoryService.createMovie.mockReturnValue({
                title: 'Mulholland Drive',
                id: '1',
                language: 'en',
                releaseDate: '2001-10-19',
                overview: 'A great movie',
                fileSize: 1024,
                fileName: 'Mulholland Drive.mp4',
            });

            const result = await watchlistAPIService.getWatchlist();

            expect(auth.currentUser?.getIdToken).toHaveBeenCalled();
            expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/watchlist'), {
                headers: {
                    Authorization: `Bearer ${mockToken}`,
                },
            });
            expect(result).toEqual({
                movies: [
                    {
                        title: 'Mulholland Drive',
                        id: '1',
                        language: 'en',
                        releaseDate: '2001-10-19',
                        overview: 'A great movie',
                        fileSize: 1024,
                        fileName: 'Mulholland Drive.mp4',
                    },
                ],
            });
        });

        it('should throw an error if the fetch fails', async () => {
            const mockToken = 'mock-token';

            Object.defineProperty(auth, 'currentUser', {
                value: { getIdToken: jest.fn().mockResolvedValue(mockToken) },
                writable: true,
            });

            (fetch as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

            await expect(watchlistAPIService.getWatchlist()).rejects.toThrow('Fetch failed');
        });
    });

    describe("searchMovies", () => {
        it('should fetch the search results and parse the response', async () => {
            const mockToken = 'mock-token';
            const mockResponse = {
                results: [
                    {
                        title: 'Mulholland Drive',
                        id: '1',
                        language: 'en',
                        release_date: '2001-10-19',
                        overview: 'A great movie',
                        file_size: 1024,
                        file_name: 'Mulholland Drive.mp4',
                    },
                ],
            };

            Object.defineProperty(auth, 'currentUser', {
                value: { getIdToken: jest.fn().mockResolvedValue(mockToken) },
                writable: true,
            });

            (fetch as jest.Mock).mockResolvedValue({
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            const result = await watchlistAPIService.searchMovies('Mulholland Drive');

            expect(auth.currentUser?.getIdToken).toHaveBeenCalled();
            expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/movies/search?query=Mulholland Drive'), {
                headers: {
                    Authorization: `Bearer ${mockToken}`,
                },
            });
            expect(result).toEqual(mockResponse);
        });

        it('should throw an error if the fetch fails', async () => {
            const mockToken = 'mock-token';

            Object.defineProperty(auth, 'currentUser', {
                value: { getIdToken: jest.fn().mockResolvedValue(mockToken) },
                writable: true,
            });

            (fetch as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

            await expect(watchlistAPIService.searchMovies('Mulholland Drive')).rejects.toThrow('Fetch failed');
        });
    });

    describe("addMovieToWatchlist", () => {
        it('should throw an error if the user is not authenticated', async () => {
            Object.defineProperty(auth, 'currentUser', {
                value: null,
                writable: true,
            });

            const movie = {
                title: 'Mulholland Drive',
                id: '1',
                language: 'en',
                release_date: '2001-10-19',
                overview: 'A great movie',
                file_size: 1024,
                file_name: 'Mulholland Drive.mp4',
            };

            //@ts-ignore
            await expect(watchlistAPIService.addMovieToWatchlist(movie)).rejects.toThrow('User is not authenticated');
        });

        it('should add a movie to the watchlist', async () => {
            const mockToken = 'mock-token';
            const movie = {
                title: 'Mulholland Drive',
                id: '1',
                language: 'en',
                release_date: '2001-10-19',
                overview: 'A great movie',
                file_size: 1024,
                file_name: 'Mulholland Drive.mp4',
            };

            Object.defineProperty(auth, 'currentUser', {
                value: { getIdToken: jest.fn().mockResolvedValue(mockToken) },
                writable: true,
            });

            (fetch as jest.Mock).mockResolvedValue({
                ok: true,
            });

            //@ts-ignore
            await watchlistAPIService.addMovieToWatchlist(movie);

            expect(auth.currentUser?.getIdToken).toHaveBeenCalled();
            expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/watchlist/add'), {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${mockToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(movie),
            });
        });

        it('should throw an error if the fetch fails', async () => {
            const mockToken = 'mock-token';
            const movie = {
                title: 'Mulholland Drive',
                id: '1',
                language: 'en',
                release_date: '2001-10-19',
                overview: 'A great movie',
                file_size: 1024,
                file_name: 'Mulholland Drive.mp4',
            };

            Object.defineProperty(auth, 'currentUser', {
                value: { getIdToken: jest.fn().mockResolvedValue(mockToken) },
                writable: true,
            });

            (fetch as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

            //@ts-ignore
            await expect(watchlistAPIService.addMovieToWatchlist(movie)).rejects.toThrow('Fetch failed');
        });
    });

    describe("removeMovieFromWatchlist", () => {
        it('should throw an error if the user is not authenticated', async () => {
            Object.defineProperty(auth, 'currentUser', {
                value: null,
                writable: true,
            });

            await expect(watchlistAPIService.removeMovieFromWatchlist('1')).rejects.toThrow('User is not authenticated');
        });

        it('should remove a movie from the watchlist', async () => {
            const mockToken = 'mock-token';
            const movieId = '1';

            Object.defineProperty(auth, 'currentUser', {
                value: { getIdToken: jest.fn().mockResolvedValue(mockToken) },
                writable: true,
            });

            (fetch as jest.Mock).mockResolvedValue({
                ok: true,
            });

            await watchlistAPIService.removeMovieFromWatchlist(movieId);

            expect(auth.currentUser?.getIdToken).toHaveBeenCalled();
            expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/watchlist/remove'), {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${mockToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ movieId }),
            });
        });

        it('should throw an error if the fetch fails', async () => {
            const mockToken = 'mock-token';
            const movieId = '1';

            Object.defineProperty(auth, 'currentUser', {
                value: { getIdToken: jest.fn().mockResolvedValue(mockToken) },
                writable: true,
            });

            (fetch as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

            await expect(watchlistAPIService.removeMovieFromWatchlist(movieId)).rejects.toThrow('Fetch failed');
        });
    });

    describe("updateMovieInWatchlist", () => {
        it('should throw an error if the user is not authenticated', async () => {
            Object.defineProperty(auth, 'currentUser', {
                value: null,
                writable: true,
            });

            const movie = {
                id: '1',
                title: 'Mulholland Drive',
                language: 'en',
                release_date: '2001-10-19',
                overview: 'A great movie',
                file_size: 1024,
                file_name: 'Mulholland Drive.mp4',
            };

            //@ts-ignore
            await expect(watchlistAPIService.updateMovieInWatchlist(movie)).rejects.toThrow('User is not authenticated');
        });

        it('should update a movie in the watchlist', async () => {
            const mockToken = 'mock-token';
            const movie = {
                id: '1',
                title: 'Mulholland Drive',
                language: 'en',
                release_date: '2001-10-19',
                overview: 'A great movie',
                file_size: 1024,
                file_name: 'Mulholland Drive.mp4',
            };

            Object.defineProperty(auth, 'currentUser', {
                value: { getIdToken: jest.fn().mockResolvedValue(mockToken) },
                writable: true,
            });

            (fetch as jest.Mock).mockResolvedValue({
                ok: true,
            });

            //@ts-ignore
            await watchlistAPIService.updateMovieInWatchlist(movie);

            expect(auth.currentUser?.getIdToken).toHaveBeenCalled();
            expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/watchlist/update'), {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${mockToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(movie),
            });
        });

        it('should throw an error if the fetch fails', async () => {
            const mockToken = 'mock-token';
            const movie = {
                id: '1',
                title: 'Mulholland Drive',
                language: 'en',
                release_date: '2001-10-19',
                overview: 'A great movie',
                file_size: 1024,
                file_name: 'Mulholland Drive.mp4',
            };

            Object.defineProperty(auth, 'currentUser', {
                value: { getIdToken: jest.fn().mockResolvedValue(mockToken) },
                writable: true,
            });

            (fetch as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

            //@ts-ignore
            await expect(watchlistAPIService.updateMovieInWatchlist(movie)).rejects.toThrow('Fetch failed');
        });
    });
});