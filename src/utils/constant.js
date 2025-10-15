// src/utils/constants.js
export const APP_NAME = 'ENACTUS Club Connect';

export const CLUB_CATEGORIES = {
  TECHNICAL: 'Technical',
  CULTURAL: 'Cultural',
  SPORTS: 'Sports',
  SOCIAL: 'Social Service',
  ENTREPRENEURSHIP: 'Entrepreneurship',
  ACADEMIC: 'Academic',
  OTHER: 'Other',
};

export const EVENT_TYPES = {
  WORKSHOP: 'Workshop',
  COMPETITION: 'Competition',
  SEMINAR: 'Seminar',
  MEETING: 'Meeting',
  SOCIAL: 'Social Event',
  SPORTS: 'Sports Event',
  OTHER: 'Other',
};

export const COLLECTIONS = {
  USERS: 'users',
  CLUBS: 'clubs',
  EVENTS: 'events',
  REGISTRATIONS: 'registrations',
};

export const STORAGE_KEYS = {
  SAVED_EVENTS: 'savedEvents',
  USER_PREFERENCES: 'userPreferences',
};

export const FIREBASE_ERRORS = {
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/email-already-in-use': 'This email is already registered.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/invalid-email': 'Invalid email address.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
};

export const COLORS = {
  PRIMARY: '#6200ee',
  PRIMARY_DARK: '#3700b3',
  PRIMARY_LIGHT: '#bb86fc',
  SECONDARY: '#03dac6',
  SECONDARY_DARK: '#018786',
  ERROR: '#b00020',
  BACKGROUND: '#ffffff',
  SURFACE: '#ffffff',
  ON_PRIMARY: '#ffffff',
  ON_SECONDARY: '#000000',
  ON_BACKGROUND: '#000000',
  ON_SURFACE: '#000000',
  ON_ERROR: '#ffffff',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};