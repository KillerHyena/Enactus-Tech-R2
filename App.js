// App.js
import React, { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { EventProvider } from './src/context/EventContext';
import AppNavigator from './src/navigation/AppNavigator';
import { testFirebaseConnection } from './src/utils/testFirebase';

export default function App() {
  useEffect(() => {
    // Test Firebase connection on app start
    testFirebaseConnection();
  }, []);

  return (
    <PaperProvider>
      <AuthProvider>
        <EventProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </EventProvider>
      </AuthProvider>
    </PaperProvider>
  );
}