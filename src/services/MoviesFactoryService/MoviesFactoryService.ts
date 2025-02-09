import { Movie, MovieDTO } from "../WatchlistAPIService/models/Movie";

export class MoviesFactoryService {
    private constructor() {
    }
    static instance: MoviesFactoryService;
    static getInstance() {
        if (!MoviesFactoryService.instance) {
            MoviesFactoryService.instance = new MoviesFactoryService();
        }
        return MoviesFactoryService.instance;
    }

    public createMovie(movie: MovieDTO): Movie {
        return {
            title: movie.title,
            id: movie.id,
            language: movie.language,
            releaseDate: movie.release_date,
            overview: movie.overview,
            fileSize: movie.file_size,
            fileName: movie.file_name
        }
    }
}