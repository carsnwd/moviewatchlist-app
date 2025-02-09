import { Modal, Button, Group, Text } from '@mantine/core';

interface RemoveMovieModalProps {
    opened: boolean;
    onClose: () => void;
    onConfirm: () => void;
    movieTitle: string;
}

export default function RemoveMovieModal({ opened, onClose, onConfirm, movieTitle }: RemoveMovieModalProps) {
    return (
        <Modal opened={opened} onClose={onClose} title="Confirm Removal">
            <Text>Are you sure you want to remove the movie "{movieTitle}" from your watchlist?</Text>
            <Group mt="md">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button color="red" onClick={onConfirm}>Remove</Button>
            </Group>
        </Modal>
    );
}