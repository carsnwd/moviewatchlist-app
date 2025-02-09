import { auth } from "@/firebaseConfig";
import config from "../../../config.json"
import { MoviesFactoryService } from "../MoviesFactoryService/MoviesFactoryService";
import { MovieDTO } from "./models/Movie";

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
        const response = await fetch(`${config.WATCHLIST_API_URL}/watchlist`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return await this.parseWatchlistFromGetRequest(response);
    }
}