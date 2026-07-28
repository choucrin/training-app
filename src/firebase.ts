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

// .env が未設定(値が空)の場合にFirebase SDKが例外で落ちて画面が真っ白になるのを防ぐ
export const isFirebaseConfigured = Object.values(firebaseConfig).every((v) => !!v);

export const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

const googleProvider = new GoogleAuthProvider();

export async function signIn(): Promise<void> {
  if (!auth) return;
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (err) {
    const code = (err as { code?: string }).code;
    // ユーザー自身がポップアップを閉じた/連打した場合はリダイレクトせず、そのままログイン画面に戻す
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
      return;
    }
    // ポップアップがブロックされる環境(iOS Safari等)ではリダイレクト方式にフォールバック
    await signInWithRedirect(auth, googleProvider).catch(() => undefined);
  }
}

export function signOutUser(): Promise<void> {
  return auth ? firebaseSignOut(auth) : Promise.resolve();
}

export function subscribeAuth(callback: (user: User | null) => void): () => void {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export function handleRedirectResult(): Promise<void> {
  if (!auth) return Promise.resolve();
  return getRedirectResult(auth).then(() => undefined);
}

export type { User };
