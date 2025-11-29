import {
    getAuth,
    onAuthStateChanged,
    User,
    signInWithPopup,
    AuthProvider,
    signInWithRedirect,
    signInWithEmailAndPassword,
} from "firebase/auth";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    // GithubのSecret scanningに引っ掛かるので環境変数に変更
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "mimi-introduction.firebaseapp.com",
    projectId: "mimi-introduction",
    storageBucket: "mimi-introduction.firebasestorage.app",
    messagingSenderId: "395968367788",
    appId: "1:395968367788:web:1239df9d323ff3e86c2309",
    measurementId: "G-3Q3RVCGY7W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (client-side only)
let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

export function getFirebaseAnalytics(): Analytics | null {
    return analytics;
}

// 認証状態を監視する関数
export function onAuthStateChange(callback: (user: User | null) => void) {
    const auth = getAuth();
    return onAuthStateChanged(auth, callback);
}

// 現在のユーザーを取得する関数
export function getCurrentUser(): User | null {
    const auth = getAuth();
    return auth.currentUser;
}

export async function getCurrentUserRole(): Promise<string> {
    const user = getCurrentUser();
    if (user === null) {
        return "guest";
    }

    const idTokenResult = await user.getIdTokenResult();
    if (idTokenResult?.claims.admin === true) {
        return "admin";
    } else if (idTokenResult?.claims.editor === true) {
        return "editor";
    } else {
        return "user";
    }
}

// IDトークンを取得する関数
export async function getCurrentUserToken(): Promise<string | null> {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
        return await user.getIdToken();
    }
    return null;
}

export function loginWithEmailAndPassword(email: string, password: string): Promise<User> {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            return userCredential.user;
        })
        .catch((error) => {
            console.error("Error signing in, code:", error.code, "message:", error.message);
            throw error;
        });
}

export async function loginWithProvider(provider: AuthProvider): Promise<User> {
    const auth = getAuth();
    const result = await signInWithPopup(auth, provider);
    return result.user;
}

export function loginWithProviderRedirect(provider: AuthProvider): Promise<void> {
    const auth = getAuth();
    return signInWithRedirect(auth, provider);
}

// ログアウト関数
export function logout() {
    const auth = getAuth();
    return auth.signOut();
}
