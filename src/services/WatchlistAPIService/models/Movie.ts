export type Movie = {
    title: string;
    fileName?: string;
    fileSize?: number;
    id: string;
    language: string;
    releaseDate: string;
    overview: string;
}

export type MovieDTO = {
    title: string,
    id: string,
    language: string,
    release_date: string
    overview: string
    file_name?: string
    file_size?: number
}