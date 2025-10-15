// src/screens/Auth/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Text, TextInput, Button, Title } from 'react-native-paper';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Title style={styles.title}>NSUT Club Connect</Title>
        
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />
        
        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          style={styles.button}
        >
          Login
        </Button>
        
        <Button
          onPress={() => navigation.navigate('Register')}
          style={styles.linkButton}
        >
          Don't have an account? Register
        </Button>
        
        <Button
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.linkButton}
        >
          Forgot Password?
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
  linkButton: {
    marginTop: 12,
  },
});

export default LoginScreen;