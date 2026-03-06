import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from './firebase';
import type { AppUser } from '../types';

const googleProvider = new GoogleAuthProvider();
const COMPANY_DOMAIN = import.meta.env.VITE_COMPANY_DOMAIN || 'yourcompany.com';

// Check if email is from company domain
export const isCompanyEmail = (email: string | null): boolean => {
  if (!email) return false;
  return email.endsWith(`@${COMPANY_DOMAIN}`);
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<AppUser> => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  if (!isCompanyEmail(user.email)) {
    await firebaseSignOut(auth);
    throw new Error(`Only @${COMPANY_DOMAIN} email addresses are allowed`);
  }

  return {
    uid: user.uid,
    email: user.email!,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
};

// Sign out
export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

// Subscribe to auth state changes
export const onAuthChange = (callback: (user: AppUser | null) => void): (() => void) => {
  return onAuthStateChanged(auth, (firebaseUser: User | null) => {
    if (firebaseUser && isCompanyEmail(firebaseUser.email)) {
      callback({
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
      });
    } else {
      callback(null);
    }
  });
};

// Get current user
export const getCurrentUser = (): AppUser | null => {
  const user = auth.currentUser;
  if (!user || !isCompanyEmail(user.email)) return null;

  return {
    uid: user.uid,
    email: user.email!,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
};
