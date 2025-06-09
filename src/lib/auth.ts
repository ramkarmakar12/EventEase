import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth as firebaseAuth } from './firebase';

export type UserRole = 'ADMIN' | 'STAFF' | 'EVENT_OWNER';

export interface AuthUser extends User {
  role?: UserRole;
}

export const createUser = async (email: string, password: string, name: string, role: UserRole = 'EVENT_OWNER') => {
  try {
    // Create user in Firebase
    const userCred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      // Create user in Prisma through API
    const response = await fetch(`/api/auth/user/${encodeURIComponent(userCred.user.uid)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: userCred.user.uid,
        email,
        name,
        role,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create user in database');
    }

    // Get ID token for session
    const idToken = await userCred.user.getIdToken();

    return { user: userCred.user, idToken };
  } catch (error) {
    if (error instanceof FirebaseError && error.code === 'auth/email-already-in-use') {
      throw new Error('Email already exists');
    }
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    // Sign in with Firebase
    const userCred = await signInWithEmailAndPassword(firebaseAuth, email, password);    // Get user data from API
    const response = await fetch(`/api/auth/user/${encodeURIComponent(userCred.user.uid)}`);
    if (!response.ok) {
      throw new Error('User not found in database');
    }

    const userData = await response.json();

    // Get ID token for session
    const idToken = await userCred.user.getIdToken();

    return { user: { ...userCred.user, ...userData }, idToken };
  } catch (error) {
    if (error instanceof FirebaseError && 
       (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found')) {
      throw new Error('Invalid credentials');
    }
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(firebaseAuth);
    // Clear session cookie through API
    await fetch('/api/auth/signout', { method: 'POST' });
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};
