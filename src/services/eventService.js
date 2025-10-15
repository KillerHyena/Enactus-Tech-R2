// src/services/eventService.js
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc 
} from 'firebase/firestore';
import { firestore } from '../config/firebaseConfig';

export const getAllEvents = async () => {
  try {
    const eventsCollection = collection(firestore, 'events');
    const q = query(eventsCollection, orderBy('date', 'asc'));
    const eventSnapshot = await getDocs(q);
    return eventSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting events:', error);
    throw error;
  }
};

export const getEventsByClub = async (clubId) => {
  try {
    const eventsCollection = collection(firestore, 'events');
    const q = query(
      eventsCollection,
      where('clubId', '==', clubId),
      orderBy('date', 'asc')
    );
    const eventSnapshot = await getDocs(q);
    return eventSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting club events:', error);
    throw error;
  }
};

export const getUpcomingEvents = async (limit = 10) => {
  try {
    const eventsCollection = collection(firestore, 'events');
    const q = query(
      eventsCollection,
      where('date', '>=', new Date().toISOString().split('T')[0]),
      orderBy('date', 'asc')
    );
    const eventSnapshot = await getDocs(q);
    const events = eventSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return events.slice(0, limit);
  } catch (error) {
    console.error('Error getting upcoming events:', error);
    throw error;
  }
};

export const getEventById = async (eventId) => {
  try {
    const eventDoc = doc(firestore, 'events', eventId);
    const eventSnapshot = await getDoc(eventDoc);
    
    if (eventSnapshot.exists()) {
      return { id: eventSnapshot.id, ...eventSnapshot.data() };
    } else {
      throw new Error('Event not found');
    }
  } catch (error) {
    console.error('Error getting event:', error);
    throw error;
  }
};

export const registerForEvent = async (eventId, registrationData) => {
  try {
    const registrationsCollection = collection(firestore, 'registrations');
    const docRef = await addDoc(registrationsCollection, {
      eventId,
      ...registrationData,
      timestamp: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error registering for event:', error);
    throw error;
  }
};

export const getEventRegistrations = async (eventId) => {
  try {
    const registrationsCollection = collection(firestore, 'registrations');
    const q = query(registrationsCollection, where('eventId', '==', eventId));
    const registrationSnapshot = await getDocs(q);
    return registrationSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting registrations:', error);
    throw error;
  }
};