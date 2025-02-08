import { auth, githubProvider, googleProvider } from "@/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export class AuthService {
    private constructor() { }

    static instance: AuthService;

    static getInstance() {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }


    public handleGoogleLogin = async () => {
        try {
            return await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error(error);
            throw new Error("Error signing in with Google");
        }
    };

    public handleGithubLogin = async () => {
        try {
            return await signInWithPopup(auth, githubProvider);
        } catch (error) {
            console.error(error);
            throw new Error("Error signing in with Github");
        }
    };

    public registerWithEmailPassword = async (email: string, password: string) => {
        try {
            return await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error(error);
            throw new Error("Error registering with email and password");
        }
    };

    public loginWithEmailPassword = async (email: string, password: string) => {
        try {
            return await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error(error);
            throw new Error("Error logging in with email and password");
        }

    };
}