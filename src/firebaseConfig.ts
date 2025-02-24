import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, GoogleAuthProvider, GithubAuthProvider  } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyD_wtak9CY3oNHSzSj2AGs6Vozgt2Y1928",
    authDomain: "moveiwatchlist.firebaseapp.com",
    projectId: "moveiwatchlist",
    storageBucket: "moveiwatchlist.firebasestorage.app",
    messagingSenderId: "1006915819532",
    appId: "1:1006915819532:web:d3c6d6c9c314f1f259b629"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

if (window.location.hostname === "localhost") {
    connectAuthEmulator(auth, "http://localhost:9099");
}

export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
