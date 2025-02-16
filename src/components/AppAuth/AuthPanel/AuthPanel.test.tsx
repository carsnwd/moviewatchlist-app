import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useNavigate } from 'react-router-dom';
import AuthPanel from './AuthPanel';
import { MantineProvider } from '@mantine/core';

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn().mockReturnValue(jest.fn()),
}));

const renderWithMantineProvider = (ui: any) => {
    return render(<MantineProvider>{ui}</MantineProvider>);
};

describe('AuthPanel', () => {
    const mockNavigate = useNavigate();
    const mockAuthService = {
        loginWithEmailPassword: jest.fn(),
        registerWithEmailPassword: jest.fn(),
        handleGoogleLogin: jest.fn(),
        handleGithubLogin: jest.fn(),
    }

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders login form', () => {
        renderWithMantineProvider(<AuthPanel authType="login" authService={mockAuthService} />);
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByText(/login with google/i)).toBeInTheDocument();
        expect(screen.getByText(/login with github/i)).toBeInTheDocument();
    });

    it('renders register form', () => {
        renderWithMantineProvider(<AuthPanel authType="register" authService={mockAuthService} />);
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByText(/register with google/i)).toBeInTheDocument();
        expect(screen.getByText(/register with github/i)).toBeInTheDocument();
    });

    it('handles email and password login', async () => {
        renderWithMantineProvider(<AuthPanel authType="login" authService={mockAuthService} />);
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByTestId('submit-btn'));

        expect(mockAuthService.loginWithEmailPassword).toHaveBeenCalledWith('test@example.com', 'password');
    });

    it('handles email and password registration', async () => {
        renderWithMantineProvider(<AuthPanel authType="register" authService={mockAuthService} />);
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByText(/submit/i));

        expect(mockAuthService.registerWithEmailPassword).toHaveBeenCalledWith('test@example.com', 'password');
    });

    it('handles Google login', async () => {
        renderWithMantineProvider(<AuthPanel authType="login" authService={mockAuthService} />);
        fireEvent.click(screen.getByText(/login with google/i));

        expect(mockAuthService.handleGoogleLogin).toHaveBeenCalled();
    });

    it('handles Github login', async () => {
        renderWithMantineProvider(<AuthPanel authType="login" authService={mockAuthService} />);
        fireEvent.click(screen.getByText(/login with github/i));

        expect(mockAuthService.handleGithubLogin).toHaveBeenCalled();
    });
});