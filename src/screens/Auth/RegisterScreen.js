import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(null);

  const { register } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!authService.isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    } else {
      const strength = authService.validatePasswordStrength(formData.password);
      setPasswordStrength(strength);
      if (!strength.isStrong) {
        newErrors.password = 'Password is too weak';
      }
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Display name validation
    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Check password strength in real-time
    if (field === 'password') {
      const strength = authService.validatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register(formData.email, formData.password, {
        displayName: formData.displayName.trim(),
        phone: formData.phone.trim() || null
      });
      
      Alert.alert(
        'Success',
        'Account created successfully!',
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordStrength = () => {
    if (!passwordStrength || !formData.password) return null;

    const { requirements, score } = passwordStrength;
    let strengthColor = '#ff4444'; // red
    if (score >= 80) strengthColor = '#00C851'; // green
    else if (score >= 60) strengthColor = '#ffbb33'; // yellow

    return (
      <View style={styles.strengthContainer}>
        <Text style={styles.strengthLabel}>Password Strength:</Text>
        <View style={styles.strengthBar}>
          <View 
            style={[
              styles.strengthFill, 
              { width: `${score}%`, backgroundColor: strengthColor }
            ]} 
          />
        </View>
        <Text style={[styles.strengthText, { color: strengthColor }]}>
          {score >= 80 ? 'Strong' : score >= 60 ? 'Medium' : 'Weak'}
        </Text>
        
        <View style={styles.requirements}>
          <Text style={styles.requirementsTitle}>Requirements:</Text>
          <Text style={[styles.requirement, requirements.minLength && styles.requirementMet]}>
            ✓ At least 6 characters
          </Text>
          <Text style={[styles.requirement, requirements.hasUpperCase && styles.requirementMet]}>
            ✓ Uppercase letter
          </Text>
          <Text style={[styles.requirement, requirements.hasLowerCase && styles.requirementMet]}>
            ✓ Lowercase letter
          </Text>
          <Text style={[styles.requirement, requirements.hasNumbers && styles.requirementMet]}>
            ✓ Number
          </Text>
          <Text style={[styles.requirement, requirements.hasSpecialChar && styles.requirementMet]}>
            ✓ Special character
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join our community of event enthusiasts</Text>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Display Name *</Text>
          <TextInput
            style={[styles.input, errors.displayName && styles.inputError]}
            placeholder="Enter your display name"
            value={formData.displayName}
            onChangeText={(value) => handleInputChange('displayName', value)}
            autoCapitalize="words"
          />
          {errors.displayName && <Text style={styles.errorText}>{errors.displayName}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            value={formData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password *</Text>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Create a password"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            secureTextEntry
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          {renderPasswordStrength()}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password *</Text>
          <TextInput
            style={[styles.input, errors.confirmPassword && styles.inputError]}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
            secureTextEntry
          />
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
        </View>

        <TouchableOpacity
          style={[styles.registerButton, loading && styles.registerButtonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerButtonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 4,
  },
  strengthContainer: {
    marginTop: 8,
  },
  strengthLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  strengthBar: {
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
  },
  requirements: {
    marginTop: 8,
  },
  requirementsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  requirement: {
    fontSize: 11,
    color: '#999',
  },
  requirementMet: {
    color: '#00C851',
  },
  registerButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonDisabled: {
    backgroundColor: '#ccc',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#666',
  },
  loginLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default RegisterScreen;