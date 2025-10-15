// src/components/InputField.js
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';

const InputField = ({
  label,
  value,
  onChangeText,
  error = false,
  errorText = '',
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  multiline = false,
  numberOfLines = 1,
  style,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        mode="outlined"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        numberOfLines={numberOfLines}
        error={error}
        style={[styles.input, style]}
        {...props}
      />
      {error && errorText ? (
        <HelperText type="error" visible={error}>
          {errorText}
        </HelperText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
  },
});

export default InputField;