import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  verifyBeforeUpdateEmail
} from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { mapFirebaseError } from '../utils/helper';

export const authService = {
  // Register new user
  async register(email, password, userData = {}) {
    try {
      // Input validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      if (!this.isValidEmail(email)) {
        throw new Error('Please enter a valid email address');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      const friendlyError = mapFirebaseError(error);
      throw new Error(friendlyError);
    }
  },

  // Login user
  async login(email, password) {
    try {
      // Input validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      const friendlyError = mapFirebaseError(error);
      throw new Error(friendlyError);
    }
  },

  // Reset password
  async resetPassword(email) {
    try {
      if (!email) {
        throw new Error('Email is required');
      }

      if (!this.isValidEmail(email)) {
        throw new Error('Please enter a valid email address');
      }

      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'Password reset email sent successfully' };
    } catch (error) {
      const friendlyError = mapFirebaseError(error);
      throw new Error(friendlyError);
    }
  },

  // Change password
  async changePassword(newPassword) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user is currently signed in');
      }

      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      await updatePassword(user, newPassword);
      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      const friendlyError = mapFirebaseError(error);
      throw new Error(friendlyError);
    }
  },

  // Update email
  async updateEmail(newEmail) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user is currently signed in');
      }

      if (!this.isValidEmail(newEmail)) {
        throw new Error('Please enter a valid email address');
      }

      await verifyBeforeUpdateEmail(user, newEmail);
      return { 
        success: true, 
        message: 'Verification email sent. Please verify your new email address.' 
      };
    } catch (error) {
      const friendlyError = mapFirebaseError(error);
      throw new Error(friendlyError);
    }
  },

  // Validate email format
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate password strength
  validatePasswordStrength(password) {
    const requirements = {
      minLength: password.length >= 6,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const strength = Object.values(requirements).filter(Boolean).length;
    const isStrong = strength >= 4; // At least 4 out of 5 requirements

    return {
      requirements,
      strength,
      isStrong,
      score: Math.round((strength / 5) * 100)
    };
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!auth.currentUser;
  }
};