// src/utils/testFirebase.js
import { auth, firestore } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  try {
    console.log('🧪 Testing Firebase connection...');
    
    // Test Authentication
    console.log('1. Testing Authentication...');
    const testEmail = `test${Date.now()}@test.com`;
    const testPassword = 'password123';
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      console.log('✅ Authentication test PASSED - User created:', userCredential.user.email);
    } catch (authError) {
      console.log('⚠️ Authentication test:', authError.message);
    }

    // Test Firestore
    console.log('2. Testing Firestore...');
    try {
      // Try to read from Firestore
      const clubsCollection = collection(firestore, 'clubs');
      const clubsSnapshot = await getDocs(clubsCollection);
      console.log('✅ Firestore test PASSED - Connection successful');
      console.log(`📊 Found ${clubsSnapshot.size} clubs in database`);
    } catch (firestoreError) {
      console.log('❌ Firestore test FAILED:', firestoreError.message);
    }

    console.log('🎉 Firebase setup completed!');
    
  } catch (error) {
    console.error('💥 Firebase test failed completely:', error);
  }
};