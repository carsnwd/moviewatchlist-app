import { useState } from 'react';
import { Modal, TextInput, Button, Group, NumberInput } from '@mantine/core';
import TmdbSearch from '@/components/TmdbSearch/TmdbSearch';

interface MovieSearchModalProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (movieId: string, fileName?: string, fileSize?: number) => void;
}

export default function MovieSearchModal({ opened, onClose, onSubmit }: MovieSearchModalProps) {
    const [selectedMovie, setSelectedMovie] = useState<string | null>(null);
    const [fileName, setFileName] = useState('');
    const [fileSize, setFileSize] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const handleSelectMovie = (movieId: string) => {
        setError(null);
        setSelectedMovie(movieId);
    };

    const handleSubmit = () => {
        if (selectedMovie) {
            onSubmit(selectedMovie, fileName, fileSize);
            onClose();
        } else {
            setError('Please select a movie');
        }
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Search for a Movie">
            <TmdbSearch onSelect={handleSelectMovie} error={error} />
            <TextInput
                label="File Name"
                value={fileName}
                onChange={(event) => setFileName(event.currentTarget.value)}
            />
            <NumberInput
                label="File Size"
                value={fileSize}
                onChange={(value) => setFileSize(value as number)}
            />
            <Group mt="md">
                <Button onClick={handleSubmit} disabled={!selectedMovie}>Submit</Button>
            </Group>
        </Modal>
    );
}