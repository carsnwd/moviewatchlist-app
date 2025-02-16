import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthProvider, useAuth } from './AuthContext';
import { auth } from '@/firebaseConfig';

jest.mock('firebase/auth', () => ({
    onAuthStateChanged: jest.fn(),
}));

jest.mock('@/firebaseConfig', () => ({
    auth: {},
}));

const mockOnAuthStateChanged = onAuthStateChanged as jest.Mock;

const TestComponent = () => {
    const { authInitialized, user } = useAuth();

    if (!authInitialized) return <div>Loading...</div>;
    if (user) return <div>User: {user.uid}</div>;
    return <div>No user</div>;
};

describe('AuthContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize auth and set user when authenticated', async () => {
        const mockUser = { uid: '123' };
        mockOnAuthStateChanged.mockImplementation((auth, callback) => {
            callback(mockUser);
            return jest.fn();
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => expect(screen.getByText(/User:/)).toBeInTheDocument());
        expect(screen.getByText(/123/)).toBeInTheDocument();
    });

    it('should initialize auth and set no user when not authenticated', async () => {
        mockOnAuthStateChanged.mockImplementation((auth, callback) => {
            callback(null);
            return jest.fn();
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => expect(screen.getByText(/No user/)).toBeInTheDocument());
    });

    it('should show loading state initially', () => {
        mockOnAuthStateChanged.mockImplementation(() => jest.fn());

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByText(/Loading.../)).toBeInTheDocument();
    });
});