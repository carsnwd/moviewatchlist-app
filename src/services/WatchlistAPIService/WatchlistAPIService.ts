import { auth } from "@/firebaseConfig";
import { MoviesFactoryService } from "../MoviesFactoryService/MoviesFactoryService";
import { AddMovieToWatchlistDTO, MovieDTO, UpdateMovieOnWatchlistDTO } from "./models/Movie";
import { WATCHLIST_API_URL } from "./constants";

export class WatchlistAPIService {
    private constructor(moviesFactoryService?: MoviesFactoryService) {
        this.moviesFactoryService = moviesFactoryService ?? MoviesFactoryService.getInstance();
    }

    private moviesFactoryService: MoviesFactoryService;
    static instance: WatchlistAPIService;

    static getInstance() {
        if (!WatchlistAPIService.instance) {
            WatchlistAPIService.instance = new WatchlistAPIService();
        }
        return WatchlistAPIService.instance;
    }

    private async parseWatchlistFromGetRequest(response: Response) {
        const json = await response.json();
        return {
            movies: json.movies.map((movie: MovieDTO) => this.moviesFactoryService.createMovie(movie)),
        }
    }

    public async getWatchlist() {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("User is not authenticated");
        }

        const token = await user.getIdToken();
        const response = await fetch(`${WATCHLIST_API_URL}/watchlist`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return await this.parseWatchlistFromGetRequest(response);
    }

    public async searchMovies(query: string) {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("User is not authenticated");
        }

        const token = await user.getIdToken();
        const response = await fetch(`${WATCHLIST_API_URL}/movies/search?query=${query}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return await response.json();
    }

    public async addMovieToWatchlist(movie: AddMovieToWatchlistDTO) {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("User is not authenticated");
        }

        const token = await user.getIdToken();
        await fetch(`${WATCHLIST_API_URL}/watchlist/add`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movie)
        });
    }

    public async removeMovieFromWatchlist(movieId: string) {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("User is not authenticated");
        }

        const token = await user.getIdToken();
        await fetch(`${WATCHLIST_API_URL}/watchlist/remove`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ movieId })
        });
    }

    public async updateMovieInWatchlist(movie: UpdateMovieOnWatchlistDTO) {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("User is not authenticated");
        }

        const token = await user.getIdToken();
        await fetch(`${WATCHLIST_API_URL}/watchlist/update`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movie)
        });
    }
}