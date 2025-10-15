// src/screens/Auth/ForgotPassword.js
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Text, Title } from 'react-native-paper';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import CustomButton from '../../components/CustomButton';
import InputField from '../../components/InputField';
import Loader from '../../components/Loader';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    setError('');
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateEmail()) return;

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Password Reset Email Sent',
        'Please check your email for instructions to reset your password.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error) {
      console.error('Password reset error:', error);
      let errorMessage = 'Failed to send reset email. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later.';
      }
      
      setError(errorMessage);
    }
    setLoading(false);
  };

  if (loading) {
    return <Loader text="Sending reset email..." />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Title style={styles.title}>Reset Password</Title>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you instructions to reset your password.
        </Text>

        <InputField
          label="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (error) setError('');
          }}
          error={!!error}
          errorText={error}
          keyboardType="email-address"
          autoCapitalize="none"
          left={<TextInput.Icon icon="email" />}
          style={styles.input}
        />

        <CustomButton
          mode="contained"
          onPress={handleResetPassword}
          style={styles.resetButton}
          icon="email-send"
        >
          Send Reset Instructions
        </CustomButton>

        <CustomButton
          mode="text"
          onPress={() => navigation.navigate('Login')}
          style={styles.backButton}
        >
          Back to Login
        </CustomButton>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#7f8c8d',
    lineHeight: 22,
  },
  input: {
    marginBottom: 24,
  },
  resetButton: {
    marginBottom: 16,
    paddingVertical: 10,
  },
  backButton: {
    marginTop: 8,
  },
});

export default ForgotPassword;