// src/components/Loader.js
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

const Loader = ({ size = 'large', color = '#6200ee', text, style }) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default Loader;