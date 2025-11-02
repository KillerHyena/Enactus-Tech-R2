// src/context/EventContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { firestore, auth } from '../config/firebaseConfig';
import { useAuth } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EventContext = createContext();

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Load all events from Firestore with real-time updates
  useEffect(() => {
    if (!firestore) return;

    try {
      const eventsQuery = query(
        collection(firestore, 'events'),
        orderBy('date', 'asc')
      );

      const unsubscribe = onSnapshot(eventsQuery, 
        (snapshot) => {
          const eventsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date?.toDate() || new Date()
          }));
          setEvents(eventsData);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching events:', error);
          setError('Failed to load events');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up events listener:', error);
      setError('Failed to setup events listener');
      setLoading(false);
    }
  }, []);

  // Load user's saved and registered events when user changes
  useEffect(() => {
    if (user) {
      loadUserEvents();
    } else {
      setSavedEvents([]);
      setRegisteredEvents([]);
    }
  }, [user]);

  const loadUserEvents = async () => {
    if (!user) return;

    try {
      // Load saved events from Firestore
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setSavedEvents(userData.savedEvents || []);
        setRegisteredEvents(userData.registeredEvents || []);
      }
    } catch (error) {
      console.error('Error loading user events:', error);
      setError('Failed to load your events');
    }
  };

  // Get event by ID
  const getEventById = useCallback((eventId) => {
    return events.find(event => event.id === eventId);
  }, [events]);

  // Get events by club
  const getEventsByClub = useCallback((clubId) => {
    return events.filter(event => event.clubId === clubId);
  }, [events]);

  // Get upcoming events
  const getUpcomingEvents = useCallback(() => {
    const now = new Date();
    return events.filter(event => event.date >= now);
  }, [events]);

  // Get past events
  const getPastEvents = useCallback(() => {
    const now = new Date();
    return events.filter(event => event.date < now);
  }, [events]);

  // Search events
  const searchEvents = useCallback((searchTerm) => {
    const term = searchTerm.toLowerCase();
    return events.filter(event => 
      event.title?.toLowerCase().includes(term) ||
      event.description?.toLowerCase().includes(term) ||
      event.clubName?.toLowerCase().includes(term) ||
      event.location?.toLowerCase().includes(term)
    );
  }, [events]);

  // Save event to user's saved events
  const saveEvent = async (eventId) => {
    if (!user) {
      setError('Please login to save events');
      return false;
    }

    try {
      setError(null);
      const userRef = doc(firestore, 'users', user.uid);
      
      await updateDoc(userRef, {
        savedEvents: arrayUnion(eventId)
      });

      setSavedEvents(prev => [...prev, eventId]);
      return true;
    } catch (error) {
      console.error('Error saving event:', error);
      setError('Failed to save event');
      return false;
    }
  };

  // Remove event from saved events
  const removeEvent = async (eventId) => {
    if (!user) return false;

    try {
      setError(null);
      const userRef = doc(firestore, 'users', user.uid);
      
      await updateDoc(userRef, {
        savedEvents: arrayRemove(eventId)
      });

      setSavedEvents(prev => prev.filter(id => id !== eventId));
      return true;
    } catch (error) {
      console.error('Error removing event:', error);
      setError('Failed to remove event');
      return false;
    }
  };

  // Check if event is saved
  const isEventSaved = useCallback((eventId) => {
    return savedEvents.includes(eventId);
  }, [savedEvents]);

  // Check if user is registered for event
  const isEventRegistered = useCallback((eventId) => {
    return registeredEvents.includes(eventId);
  }, [registeredEvents]);

  // Register for event
  const registerForEvent = async (eventId) => {
    if (!user) {
      setError('Please login to register for events');
      return false;
    }

    try {
      setError(null);
      const eventRef = doc(firestore, 'events', eventId);
      const userRef = doc(firestore, 'users', user.uid);

      // Add to user's registered events
      await updateDoc(userRef, {
        registeredEvents: arrayUnion(eventId)
      });

      // Add user to event's registrations
      await updateDoc(eventRef, {
        registeredUsers: arrayUnion(user.uid),
        registrationCount: increment(1)
      });

      // Create registration record
      await addDoc(collection(firestore, 'registrations'), {
        eventId,
        userId: user.uid,
        userName: user.displayName || user.fullName,
        userEmail: user.email,
        registeredAt: new Date(),
        status: 'registered'
      });

      setRegisteredEvents(prev => [...prev, eventId]);
      return true;
    } catch (error) {
      console.error('Error registering for event:', error);
      setError('Failed to register for event');
      return false;
    }
  };

  // Unregister from event
  const unregisterFromEvent = async (eventId) => {
    if (!user) return false;

    try {
      setError(null);
      const eventRef = doc(firestore, 'events', eventId);
      const userRef = doc(firestore, 'users', user.uid);

      // Remove from user's registered events
      await updateDoc(userRef, {
        registeredEvents: arrayRemove(eventId)
      });

      // Remove user from event's registrations
      await updateDoc(eventRef, {
        registeredUsers: arrayRemove(user.uid),
        registrationCount: increment(-1)
      });

      setRegisteredEvents(prev => prev.filter(id => id !== eventId));
      return true;
    } catch (error) {
      console.error('Error unregistering from event:', error);
      setError('Failed to unregister from event');
      return false;
    }
  };

  // Create new event (for club admins)
  const createEvent = async (eventData) => {
    if (!user) {
      setError('Please login to create events');
      return null;
    }

    try {
      setError(null);
      const eventWithMetadata = {
        ...eventData,
        createdAt: new Date(),
        createdBy: user.uid,
        clubId: eventData.clubId,
        clubName: eventData.clubName,
        registrationCount: 0,
        registeredUsers: []
      };

      const docRef = await addDoc(collection(firestore, 'events'), eventWithMetadata);
      return docRef.id;
    } catch (error) {
      console.error('Error creating event:', error);
      setError('Failed to create event');
      return null;
    }
  };

  // Update event
  const updateEvent = async (eventId, updates) => {
    try {
      setError(null);
      const eventRef = doc(firestore, 'events', eventId);
      await updateDoc(eventRef, {
        ...updates,
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Error updating event:', error);
      setError('Failed to update event');
      return false;
    }
  };

  // Delete event
  const deleteEvent = async (eventId) => {
    try {
      setError(null);
      await deleteDoc(doc(firestore, 'events', eventId));
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      setError('Failed to delete event');
      return false;
    }
  };

  // Get saved events with full details
  const getSavedEventsWithDetails = useCallback(() => {
    return events.filter(event => savedEvents.includes(event.id));
  }, [events, savedEvents]);

  // Get registered events with full details
  const getRegisteredEventsWithDetails = useCallback(() => {
    return events.filter(event => registeredEvents.includes(event.id));
  }, [events, registeredEvents]);

  const value = {
    // State
    events,
    savedEvents: getSavedEventsWithDetails(),
    registeredEvents: getRegisteredEventsWithDetails(),
    loading,
    error,
    
    // Event management
    getEventById,
    getEventsByClub,
    getUpcomingEvents,
    getPastEvents,
    searchEvents,
    
    // Saved events
    saveEvent,
    removeEvent,
    isEventSaved,
    
    // Event registration
    registerForEvent,
    unregisterFromEvent,
    isEventRegistered,
    
    // Event creation/management
    createEvent,
    updateEvent,
    deleteEvent,
    
    // Utility
    clearError: () => setError(null)
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};

// Firestore increment function (helper for atomic updates)
const increment = (n) => ({
  increment: n
});