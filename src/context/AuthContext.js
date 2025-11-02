// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signOut, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, firestore } from '../config/firebaseConfig';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // User is signed in, get additional user data from Firestore
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              emailVerified: user.emailVerified,
              ...userData
            });
          } else {
            // User exists in auth but not in firestore - create document
            await setDoc(doc(firestore, 'users', user.uid), {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              emailVerified: user.emailVerified,
              createdAt: new Date(),
              role: 'student',
              lastLoginAt: new Date()
            });
            
            setUser({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              emailVerified: user.emailVerified,
              role: 'student'
            });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setError('Failed to load user data');
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const register = async (email, password, fullName, rollNo) => {
    try {
      setLoading(true);
      setError(null);

      // Input validation
      if (!email || !password || !fullName || !rollNo) {
        throw new Error('All fields are required');
      }

      if (password.length < 6) {
        throw new Error('Password should be at least 6 characters');
      }

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with display name
      await updateProfile(user, {
        displayName: fullName
      });

      // Send email verification
      await sendEmailVerification(user);

      // Create user document in Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        uid: user.uid,
        email: email,
        fullName: fullName,
        rollNo: rollNo,
        displayName: fullName,
        emailVerified: false,
        createdAt: new Date(),
        role: 'student',
        lastLoginAt: new Date()
      });

      // Update local state
      setUser({
        uid: user.uid,
        email: user.email,
        displayName: fullName,
        fullName: fullName,
        rollNo: rollNo,
        emailVerified: false,
        role: 'student'
      });

      return user;
    } catch (error) {
      console.error('Registration error:', error);
      
      // Map Firebase errors to user-friendly messages
      let errorMessage = 'Registration failed. Please try again.';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.';
          break;
        default:
          errorMessage = error.message || 'Registration failed.';
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update last login time
      await updateDoc(doc(firestore, 'users', user.uid), {
        lastLoginAt: new Date()
      });

      return user;
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.';
          break;
        default:
          errorMessage = error.message || 'Login failed.';
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      // User state will be cleared by onAuthStateChanged listener
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to logout. Please try again.');
      throw error;
    }
  };

  const updateUserProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const userRef = doc(firestore, 'users', user.uid);
      await updateDoc(userRef, updates);
      
      // Update local state
      setUser(prev => ({ ...prev, ...updates }));
      
      // If displayName is updated, also update Firebase Auth profile
      if (updates.displayName && auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: updates.displayName
        });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setError('Failed to update profile');
      throw error;
    }
  };

  const resendEmailVerification = async () => {
    try {
      if (!auth.currentUser) throw new Error('No user logged in');
      await sendEmailVerification(auth.currentUser);
    } catch (error) {
      console.error('Email verification error:', error);
      setError('Failed to send verification email');
      throw error;
    }
  };

  const value = {
    user,
    register,
    login,
    logout,
    updateUserProfile,
    resendEmailVerification,
    loading,
    error,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};