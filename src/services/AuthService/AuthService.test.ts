import { AuthService } from './AuthService';
import { auth, githubProvider, googleProvider } from '@/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

jest.mock('@/firebaseConfig', () => ({
    auth: jest.fn(),
    githubProvider: jest.fn(),
    googleProvider: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
    createUserWithEmailAndPassword: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    signInWithPopup: jest.fn(),
}));

describe('AuthService', () => {
    let authService: AuthService;

    beforeEach(() => {
        authService = AuthService.getInstance();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should sign in with Google', async () => {
        const mockUserCredential = { user: { uid: '123' } };
        (signInWithPopup as jest.Mock).mockResolvedValue(mockUserCredential);

        const result = await authService.handleGoogleLogin();

        expect(signInWithPopup).toHaveBeenCalledWith(auth, googleProvider);
        expect(result).toEqual(mockUserCredential);
    });

    it('should sign in with Github', async () => {
        const mockUserCredential = { user: { uid: '123' } };
        (signInWithPopup as jest.Mock).mockResolvedValue(mockUserCredential);

        const result = await authService.handleGithubLogin();

        expect(signInWithPopup).toHaveBeenCalledWith(auth, githubProvider);
        expect(result).toEqual(mockUserCredential);
    });

    it('should register with email and password', async () => {
        const mockUserCredential = { user: { uid: '123' } };
        (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);

        const result = await authService.registerWithEmailPassword('test@example.com', 'password');

        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password');
        expect(result).toEqual(mockUserCredential);
    });

    it('should log in with email and password', async () => {
        const mockUserCredential = { user: { uid: '123' } };
        (signInWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);

        const result = await authService.loginWithEmailPassword('test@example.com', 'password');

        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password');
        expect(result).toEqual(mockUserCredential);
    });

    it('should throw an error if Google login fails', async () => {
        (signInWithPopup as jest.Mock).mockRejectedValue(new Error('Google login failed'));

        await expect(authService.handleGoogleLogin()).rejects.toThrow('Error signing in with Google');
    });

    it('should throw an error if Github login fails', async () => {
        (signInWithPopup as jest.Mock).mockRejectedValue(new Error('Github login failed'));

        await expect(authService.handleGithubLogin()).rejects.toThrow('Error signing in with Github');
    });

    it('should throw an error if email registration fails', async () => {
        (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(new Error('Registration failed'));

        await expect(authService.registerWithEmailPassword('test@example.com', 'password')).rejects.toThrow('Error registering with email and password');
    });

    it('should throw an error if email login fails', async () => {
        (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(new Error('Login failed'));

        await expect(authService.loginWithEmailPassword('test@example.com', 'password')).rejects.toThrow('Error logging in with email and password');
    });
});