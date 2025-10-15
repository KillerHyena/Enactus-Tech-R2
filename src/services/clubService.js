// src/services/clubService.js
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc
} from 'firebase/firestore';
import { firestore } from '../config/firebaseConfig';

export const getAllClubs = async () => {
  try {
    const clubsCollection = collection(firestore, 'clubs');
    const clubsSnapshot = await getDocs(clubsCollection);
    const clubList = clubsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return clubList;
  } catch (error) {
    console.error('Error getting clubs:', error);
    throw error;
  }
};

export const getClubById = async (clubId) => {
  try {
    const clubDoc = doc(firestore, 'clubs', clubId);
    const clubSnapshot = await getDoc(clubDoc);
    
    if (clubSnapshot.exists()) {
      return { id: clubSnapshot.id, ...clubSnapshot.data() };
    } else {
      throw new Error('Club not found');
    }
  } catch (error) {
    console.error('Error getting club:', error);
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
    const eventsSnapshot = await getDocs(q);
    const eventList = eventsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return eventList;
  } catch (error) {
    console.error('Error getting club events:', error);
    throw error;
  }
};

export const searchClubs = async (searchTerm) => {
  try {
    const clubsCollection = collection(firestore, 'clubs');
    const clubsSnapshot = await getDocs(clubsCollection);
    const allClubs = clubsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Client-side filtering (for simple search)
    const filtered = allClubs.filter(club =>
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return filtered;
  } catch (error) {
    console.error('Error searching clubs:', error);
    throw error;
  }
};