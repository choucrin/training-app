import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

export async function signIn(): Promise<void> {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (err) {
    // ポップアップがブロックされる環境(iOS Safari等)ではリダイレクト方式にフォールバック
    await signInWithRedirect(auth, googleProvider);
  }
}

export function signOutUser(): Promise<void> {
  return firebaseSignOut(auth);
}

export function subscribeAuth(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

export function handleRedirectResult(): Promise<void> {
  return getRedirectResult(auth).then(() => undefined);
}

export type { User };
