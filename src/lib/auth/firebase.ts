import {
    getAuth,
    onAuthStateChanged,
    User,
    signInWithPopup,
    AuthProvider,
    signInWithRedirect,
    GoogleAuthProvider,
} from "firebase/auth";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
    // GithubのSecret scanningに引っ掛かるので環境変数に変更
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "songs-introduction.firebaseapp.com",
    projectId: "songs-introduction",
    storageBucket: "songs-introduction.firebasestorage.app",
    messagingSenderId: "301767836051",
    appId: "1:301767836051:web:d1117c40c30a5b48e3a866",
};

// Initialize Firebase
initializeApp(firebaseConfig);

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

// Youtube Data APIのアクセストークンも確保する
export async function loginWithGoogle(): Promise<User> {
    const googleProvider = new GoogleAuthProvider();
    googleProvider.addScope("https://www.googleapis.com/auth/youtube");
    return await loginWithProvider(googleProvider);
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
