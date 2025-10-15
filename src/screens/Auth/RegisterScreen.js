// src/screens/Auth/RegisterScreen.js
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
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../../config/firebaseConfig';
import CustomButton from '../../components/CustomButton';
import InputField from '../../components/InputField';
import Loader from '../../components/Loader';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    rollNo: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.rollNo.trim()) {
      newErrors.rollNo = 'Roll number is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // Update user profile with display name
      await updateProfile(user, {
        displayName: formData.fullName,
      });

      // Create user document in Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        uid: user.uid,
        fullName: formData.fullName,
        email: formData.email,
        rollNo: formData.rollNo,
        createdAt: new Date(),
        role: 'student',
      });

      Alert.alert('Success', 'Account created successfully!');
      // User will be automatically redirected to main app via AuthContext
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      }
      
      Alert.alert('Registration Error', errorMessage);
    }
    setLoading(false);
  };

  if (loading) {
    return <Loader text="Creating your account..." />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Title style={styles.title}>Create Account</Title>
        <Text style={styles.subtitle}>Join ENACTUS Club Community</Text>

        <InputField
          label="Full Name"
          value={formData.fullName}
          onChangeText={(text) => handleInputChange('fullName', text)}
          error={!!errors.fullName}
          errorText={errors.fullName}
          autoCapitalize="words"
          left={<TextInput.Icon icon="account" />}
        />

        <InputField
          label="Roll Number"
          value={formData.rollNo}
          onChangeText={(text) => handleInputChange('rollNo', text)}
          error={!!errors.rollNo}
          errorText={errors.rollNo}
          autoCapitalize="characters"
          left={<TextInput.Icon icon="card-account-details" />}
        />

        <InputField
          label="Email"
          value={formData.email}
          onChangeText={(text) => handleInputChange('email', text)}
          error={!!errors.email}
          errorText={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          left={<TextInput.Icon icon="email" />}
        />

        <InputField
          label="Password"
          value={formData.password}
          onChangeText={(text) => handleInputChange('password', text)}
          error={!!errors.password}
          errorText={errors.password}
          secureTextEntry
          left={<TextInput.Icon icon="lock" />}
        />

        <InputField
          label="Confirm Password"
          value={formData.confirmPassword}
          onChangeText={(text) => handleInputChange('confirmPassword', text)}
          error={!!errors.confirmPassword}
          errorText={errors.confirmPassword}
          secureTextEntry
          left={<TextInput.Icon icon="lock-check" />}
        />

        <CustomButton
          mode="contained"
          onPress={handleRegister}
          style={styles.registerButton}
          icon="account-plus"
        >
          Create Account
        </CustomButton>

        <CustomButton
          mode="text"
          onPress={() => navigation.navigate('Login')}
          style={styles.loginButton}
        >
          Already have an account? Sign In
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
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#7f8c8d',
  },
  registerButton: {
    marginTop: 16,
    marginBottom: 12,
    paddingVertical: 10,
  },
  loginButton: {
    marginTop: 8,
  },
});

export default RegisterScreen;