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
    const userCred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    
    const baseUrl = typeof window === 'undefined' 
      ? 'http://localhost:3000' 
      : window.location.origin;
    
    const response = await fetch(`${baseUrl}/api/auth/user/${encodeURIComponent(userCred.user.uid)}`, {
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
      const errorData = await response.json();
      console.error('Database creation failed:', errorData);
      throw new Error(errorData.details || 'Failed to create user in database');
    }

    const userData = await response.json();
    console.log('User created successfully:', userData);

    const idToken = await userCred.user.getIdToken();
    return { user: { ...userCred.user, ...userData }, idToken };
  } catch (error) {
    if (error instanceof FirebaseError && error.code === 'auth/email-already-in-use') {
      throw new Error('Email already exists');
    }
    console.error('Create user error:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCred = await signInWithEmailAndPassword(firebaseAuth, email, password);
    const idToken = await userCred.user.getIdToken();

    // Create session cookie through API
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to create session');
    }

    // Get user claims from Firebase Auth token
    const token = await userCred.user.getIdTokenResult();
    const role = token.claims.role || 'EVENT_OWNER';

    return {
      user: {
        ...userCred.user,
        role: role as UserRole,
      },
      idToken,
    };
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
