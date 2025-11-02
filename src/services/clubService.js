import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { firestore } from '../config/firebaseConfig';

const CLUBS_COLLECTION = 'clubs';

export const clubService = {
  // Get all clubs
  async getAllClubs() {
    try {
      const clubsQuery = query(
        collection(firestore, CLUBS_COLLECTION),
        orderBy('name', 'asc')
      );
      const querySnapshot = await getDocs(clubsQuery);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching clubs:', error);
      throw new Error('Failed to fetch clubs');
    }
  },

  // Get club by ID
  async getClubById(clubId) {
    try {
      const clubDoc = doc(firestore, CLUBS_COLLECTION, clubId);
      const clubSnapshot = await getDoc(clubDoc);
      
      if (!clubSnapshot.exists()) {
        throw new Error('Club not found');
      }
      
      return {
        id: clubSnapshot.id,
        ...clubSnapshot.data()
      };
    } catch (error) {
      console.error('Error fetching club:', error);
      throw new Error('Failed to fetch club');
    }
  },

  // Search clubs by name or description
  async searchClubs(searchTerm) {
    try {
      const clubsQuery = query(
        collection(firestore, CLUBS_COLLECTION),
        where('name', '>=', searchTerm),
        where('name', '<=', searchTerm + '\uf8ff')
      );
      
      const querySnapshot = await getDocs(clubsQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error searching clubs:', error);
      throw new Error('Failed to search clubs');
    }
  },

  // Get clubs by category
  async getClubsByCategory(category) {
    try {
      const clubsQuery = query(
        collection(firestore, CLUBS_COLLECTION),
        where('category', '==', category),
        orderBy('name', 'asc')
      );
      
      const querySnapshot = await getDocs(clubsQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching clubs by category:', error);
      throw new Error('Failed to fetch clubs by category');
    }
  },

  // Create new club
  async createClub(clubData) {
    try {
      const requiredFields = ['name', 'description', 'category'];
      const missingFields = requiredFields.filter(field => !clubData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      const clubWithTimestamps = {
        ...clubData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        memberCount: 0,
        eventCount: 0
      };

      const docRef = await addDoc(collection(firestore, CLUBS_COLLECTION), clubWithTimestamps);
      
      return {
        id: docRef.id,
        ...clubWithTimestamps
      };
    } catch (error) {
      console.error('Error creating club:', error);
      throw new Error('Failed to create club');
    }
  },

  // Update club
  async updateClub(clubId, updates) {
    try {
      const clubDoc = doc(firestore, CLUBS_COLLECTION, clubId);
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(clubDoc, updateData);
      
      return {
        id: clubId,
        ...updateData
      };
    } catch (error) {
      console.error('Error updating club:', error);
      throw new Error('Failed to update club');
    }
  },

  // Get popular clubs (by member count or event count)
  async getPopularClubs(limit = 10) {
    try {
      const clubsQuery = query(
        collection(firestore, CLUBS_COLLECTION),
        orderBy('memberCount', 'desc'),
        orderBy('eventCount', 'desc')
      );
      
      const querySnapshot = await getDocs(clubsQuery);
      const clubs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return clubs.slice(0, limit);
    } catch (error) {
      console.error('Error fetching popular clubs:', error);
      throw new Error('Failed to fetch popular clubs');
    }
  }
};