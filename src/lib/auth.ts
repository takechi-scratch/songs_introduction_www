import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    User,
    signInWithPopup,
    AuthProvider,
    signInWithRedirect,
} from "firebase/auth";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAogMtgjHngcJeI4JPbxX8T_COZ6hu1poQ",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: "songs-introduction",
    storageBucket: "songs-introduction.firebasestorage.app",
    messagingSenderId: "301767836051",
    appId: "1:301767836051:web:639e136894453c82e3a866",
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

// ログイン関数（Promiseを返すように修正）
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
