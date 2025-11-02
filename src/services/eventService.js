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
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { firestore } from '../config/firebaseConfig';

const EVENTS_COLLECTION = 'events';
const REGISTRATIONS_COLLECTION = 'eventRegistrations';

export const eventService = {
  // Get all events with optional filtering
  async getAllEvents(filters = {}) {
    try {
      let eventsQuery = collection(firestore, EVENTS_COLLECTION);
      const constraints = [];

      // Add filters if provided
      if (filters.clubId) {
        constraints.push(where('clubId', '==', filters.clubId));
      }
      if (filters.category) {
        constraints.push(where('category', '==', filters.category));
      }
      if (filters.upcoming) {
        constraints.push(where('date', '>=', new Date().toISOString()));
      }
      if (filters.featured) {
        constraints.push(where('isFeatured', '==', true));
      }

      // Always order by date
      constraints.push(orderBy('date', 'asc'));

      eventsQuery = query(eventsQuery, ...constraints);
      const querySnapshot = await getDocs(eventsQuery);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new Error('Failed to fetch events');
    }
  },

  // Get single event by ID
  async getEventById(eventId) {
    try {
      const eventDoc = doc(firestore, EVENTS_COLLECTION, eventId);
      const eventSnapshot = await getDoc(eventDoc);
      
      if (!eventSnapshot.exists()) {
        throw new Error('Event not found');
      }
      
      return {
        id: eventSnapshot.id,
        ...eventSnapshot.data()
      };
    } catch (error) {
      console.error('Error fetching event:', error);
      throw new Error('Failed to fetch event');
    }
  },

  // Get events by club ID
  async getEventsByClub(clubId) {
    try {
      const eventsQuery = query(
        collection(firestore, EVENTS_COLLECTION),
        where('clubId', '==', clubId),
        orderBy('date', 'asc')
      );
      const querySnapshot = await getDocs(eventsQuery);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching club events:', error);
      throw new Error('Failed to fetch club events');
    }
  },

  // Create new event
  async createEvent(eventData) {
    try {
      // Validate required fields
      const requiredFields = ['title', 'description', 'date', 'clubId', 'location'];
      const missingFields = requiredFields.filter(field => !eventData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      const eventWithTimestamps = {
        ...eventData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        registeredUsers: [],
        isActive: true
      };

      const docRef = await addDoc(collection(firestore, EVENTS_COLLECTION), eventWithTimestamps);
      
      return {
        id: docRef.id,
        ...eventWithTimestamps
      };
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('Failed to create event');
    }
  },

  // Update event
  async updateEvent(eventId, updates) {
    try {
      const eventDoc = doc(firestore, EVENTS_COLLECTION, eventId);
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(eventDoc, updateData);
      
      return {
        id: eventId,
        ...updateData
      };
    } catch (error) {
      console.error('Error updating event:', error);
      throw new Error('Failed to update event');
    }
  },

  // Delete event
  async deleteEvent(eventId) {
    try {
      const eventDoc = doc(firestore, EVENTS_COLLECTION, eventId);
      await deleteDoc(eventDoc);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw new Error('Failed to delete event');
    }
  },

  // Register user for event
  async registerForEvent(eventId, userId) {
    try {
      const eventDoc = doc(firestore, EVENTS_COLLECTION, eventId);
      
      // Check if user is already registered
      const eventSnapshot = await getDoc(eventDoc);
      const eventData = eventSnapshot.data();
      
      if (eventData.registeredUsers && eventData.registeredUsers.includes(userId)) {
        throw new Error('User already registered for this event');
      }

      // Add user to registered users
      await updateDoc(eventDoc, {
        registeredUsers: arrayUnion(userId)
      });

      // Create registration record
      await addDoc(collection(firestore, REGISTRATIONS_COLLECTION), {
        eventId,
        userId,
        registeredAt: new Date().toISOString(),
        status: 'confirmed'
      });

      return { success: true, message: 'Successfully registered for event' };
    } catch (error) {
      console.error('Error registering for event:', error);
      throw new Error('Failed to register for event');
    }
  },

  // Unregister from event
  async unregisterFromEvent(eventId, userId) {
    try {
      const eventDoc = doc(firestore, EVENTS_COLLECTION, eventId);
      
      await updateDoc(eventDoc, {
        registeredUsers: arrayRemove(userId)
      });

      return { success: true, message: 'Successfully unregistered from event' };
    } catch (error) {
      console.error('Error unregistering from event:', error);
      throw new Error('Failed to unregister from event');
    }
  },

  // Search events
  async searchEvents(searchTerm, filters = {}) {
    try {
      let eventsQuery = collection(firestore, EVENTS_COLLECTION);
      const constraints = [];

      // Basic search in title and description
      if (searchTerm) {
        // Note: Firestore doesn't support full-text search natively
        // This is a basic implementation - consider using Algolia or similar for advanced search
        constraints.push(where('title', '>=', searchTerm));
        constraints.push(where('title', '<=', searchTerm + '\uf8ff'));
      }

      // Add additional filters
      if (filters.category) {
        constraints.push(where('category', '==', filters.category));
      }
      if (filters.location) {
        constraints.push(where('location', '==', filters.location));
      }
      if (filters.dateFrom) {
        constraints.push(where('date', '>=', filters.dateFrom));
      }
      if (filters.dateTo) {
        constraints.push(where('date', '<=', filters.dateTo));
      }

      constraints.push(orderBy('date', 'asc'));
      eventsQuery = query(eventsQuery, ...constraints);
      
      const querySnapshot = await getDocs(eventsQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error searching events:', error);
      throw new Error('Failed to search events');
    }
  }
};