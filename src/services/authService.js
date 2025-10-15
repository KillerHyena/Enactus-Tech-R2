// src/services/authService.js
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

export const registerUser = async (email, password, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  if (displayName) {
    await updateProfile(userCredential.user, {
      displayName: displayName
    });
  }
  
  return userCredential;
};

export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const resetPassword = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const updateUserProfile = (updates) => {
  return updateProfile(auth.currentUser, updates);
};