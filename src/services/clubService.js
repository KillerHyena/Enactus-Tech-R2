// src/services/clubService.js
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  query,
  where,
  orderBy 
} from 'firebase/firestore';
import { firestore } from '../config/firebaseConfig';

export const getAllClubs = async () => {
  try {
    const clubsCollection = collection(firestore, 'clubs');
    const clubSnapshot = await getDocs(clubsCollection);
    return clubSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
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

export const searchClubs = async (searchTerm) => {
  try {
    const clubsCollection = collection(firestore, 'clubs');
    const q = query(
      clubsCollection,
      orderBy('name'),
      where('name', '>=', searchTerm),
      where('name', '<=', searchTerm + '\uf8ff')
    );
    
    const clubSnapshot = await getDocs(q);
    return clubSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error searching clubs:', error);
    throw error;
  }
};