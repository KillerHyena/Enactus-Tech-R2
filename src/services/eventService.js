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
  limit
} from 'firebase/firestore';
import { firestore } from '../config/firebaseConfig';

export const getAllEvents = async () => {
  try {
    const eventsCollection = collection(firestore, 'events');
    const q = query(eventsCollection, orderBy('date', 'asc'));
    const eventsSnapshot = await getDocs(q);
    const eventList = eventsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return eventList;
  } catch (error) {
    console.error('Error getting events:', error);
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

export const getUpcomingEvents = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const eventsCollection = collection(firestore, 'events');
    const q = query(
      eventsCollection,
      where('date', '>=', today),
      orderBy('date', 'asc')
    );
    const eventsSnapshot = await getDocs(q);
    const eventList = eventsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return eventList;
  } catch (error) {
    console.error('Error getting upcoming events:', error);
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