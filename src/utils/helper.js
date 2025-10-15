// src/utils/helpers.js
import { FIREBASE_ERRORS } from './constants';

// Format Firebase error messages
export const getFirebaseErrorMessage = (errorCode) => {
  return FIREBASE_ERRORS[errorCode] || 'An unexpected error occurred. Please try again.';
};

// Format date to readable string
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
};

// Format time to 12-hour format
export const formatTime = (timeString) => {
  if (!timeString) return '';
  
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  
  return `${formattedHour}:${minutes} ${ampm}`;
};

// Check if event is upcoming
export const isUpcomingEvent = (eventDate) => {
  const today = new Date();
  const event = new Date(eventDate);
  return event >= today;
};

// Debounce function for search
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Capitalize first letter of each word
export const capitalizeWords = (str) => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Generate random ID (for temporary data)
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Sort events by date
export const sortEventsByDate = (events, ascending = true) => {
  return events.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

// Filter events by club
export const filterEventsByClub = (events, clubId) => {
  return events.filter(event => event.clubId === clubId);
};

// Get events for a specific date
export const getEventsForDate = (events, targetDate) => {
  return events.filter(event => event.date === targetDate);
};

// Calculate days until event
export const daysUntilEvent = (eventDate) => {
  const today = new Date();
  const event = new Date(eventDate);
  const diffTime = event - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};