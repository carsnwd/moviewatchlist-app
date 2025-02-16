import { MoviesFactoryService } from './MoviesFactoryService';
import { Movie, MovieDTO } from '../WatchlistAPIService/models/Movie';

describe('MoviesFactoryService', () => {
    let moviesFactoryService: MoviesFactoryService;

    beforeEach(() => {
        moviesFactoryService = MoviesFactoryService.getInstance();
    });

    it('should create a Movie object from a MovieDTO object', () => {
        const movieDTO: MovieDTO = {
            title: 'Lost Highway',
            id: '1',
            language: 'en',
            release_date: '1997-01-01',
            overview: 'A weird movie',
            file_size: 1024,
            file_name: 'losthighway.mp4',
        };

        const expectedMovie: Movie = {
            title: 'Lost Highway',
            id: '1',
            language: 'en',
            releaseDate: '1997-01-01',
            overview: 'A weird movie',
            fileSize: 1024,
            fileName: 'losthighway.mp4',
        };

        const result = moviesFactoryService.createMovie(movieDTO);

        expect(result).toEqual(expectedMovie);
    });

    it('should return the same instance of MoviesFactoryService', () => {
        const instance1 = MoviesFactoryService.getInstance();
        const instance2 = MoviesFactoryService.getInstance();

        expect(instance1).toBe(instance2);
    });
});