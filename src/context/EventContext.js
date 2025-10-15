// src/context/EventContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EventContext = createContext();

export const useEvents = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const [savedEvents, setSavedEvents] = useState([]);

  useEffect(() => {
    loadSavedEvents();
  }, []);

  const loadSavedEvents = async () => {
    try {
      const saved = await AsyncStorage.getItem('savedEvents');
      if (saved) {
        setSavedEvents(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved events:', error);
    }
  };

  const saveEvent = async (event) => {
    try {
      const updatedEvents = [...savedEvents, event];
      setSavedEvents(updatedEvents);
      await AsyncStorage.setItem('savedEvents', JSON.stringify(updatedEvents));
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const removeEvent = async (eventId) => {
    try {
      const updatedEvents = savedEvents.filter(event => event.id !== eventId);
      setSavedEvents(updatedEvents);
      await AsyncStorage.setItem('savedEvents', JSON.stringify(updatedEvents));
    } catch (error) {
      console.error('Error removing event:', error);
    }
  };

  const isEventSaved = (eventId) => {
    return savedEvents.some(event => event.id === eventId);
  };

  const value = {
    savedEvents,
    saveEvent,
    removeEvent,
    isEventSaved,
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};