// src/components/CustomButton.js
import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const CustomButton = ({
  mode = 'contained',
  onPress,
  children,
  loading = false,
  disabled = false,
  icon,
  style,
  labelStyle,
  ...props
}) => {
  return (
    <Button
      mode={mode}
      onPress={onPress}
      loading={loading}
      disabled={disabled || loading}
      icon={icon}
      style={[styles.button, style]}
      labelStyle={[styles.label, labelStyle]}
      {...props}
    >
      {children}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 4,
  },
});

export default CustomButton;