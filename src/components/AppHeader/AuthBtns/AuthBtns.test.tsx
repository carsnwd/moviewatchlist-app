import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MantineProvider } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthBtns from './AuthBtns';
import { auth } from '@/firebaseConfig';

jest.mock('@/contexts/AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

jest.mock('@/firebaseConfig', () => ({
    auth: {
        signOut: jest.fn(),
    },
}));

const renderWithMantineProvider = (ui: any) => {
    return render(<MantineProvider>{ui}</MantineProvider>);
};

describe('AuthBtns', () => {
    const mockNavigate = jest.fn();
    const mockSignOut = jest.fn();

    beforeEach(() => {
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        (useAuth as jest.Mock).mockReturnValue({
            authInitialized: true,
            user: null,
        });
        (auth.signOut as jest.Mock).mockImplementation(mockSignOut);
    });

    it('renders login and register buttons when user is not authenticated', () => {
        renderWithMantineProvider(<AuthBtns />);
        expect(screen.getByText(/Login/i)).toBeInTheDocument();
        expect(screen.getByText(/Register/i)).toBeInTheDocument();
    });

    it('navigates to /auth when login button is clicked', () => {
        renderWithMantineProvider(<AuthBtns />);
        fireEvent.click(screen.getByText(/Login/i));
        expect(mockNavigate).toHaveBeenCalledWith('/auth');
    });

    it('renders logout button when user is authenticated', () => {
        (useAuth as jest.Mock).mockReturnValue({
            authInitialized: true,
            user: { uid: '123' },
        });
        renderWithMantineProvider(<AuthBtns />);
        expect(screen.getByText(/Logout/i)).toBeInTheDocument();
    });

    it('signs out and navigates to /auth when logout button is clicked', () => {
        (useAuth as jest.Mock).mockReturnValue({
            authInitialized: true,
            user: { uid: '123' },
        });
        renderWithMantineProvider(<AuthBtns />);
        fireEvent.click(screen.getByText(/Logout/i));
        expect(auth.signOut).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/auth');
    });
});