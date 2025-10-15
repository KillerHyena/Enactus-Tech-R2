// src/navigation/AppNavigator.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import { View, ActivityIndicator } from 'react-native';

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return user ? <MainTabs /> : <AuthStack />;
};

export default AppNavigator;