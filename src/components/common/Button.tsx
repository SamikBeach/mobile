import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacityProps 
} from 'react-native';

interface Props extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'contained' | 'text';
  loading?: boolean;
}

export function Button({ 
  children, 
  variant = 'contained',
  loading,
  style,
  disabled,
  ...props 
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'text' && styles.textButton,
        disabled && styles.disabled,
        style
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'contained' ? 'white' : '#666'} />
      ) : (
        <Text style={[
          styles.text,
          variant === 'text' && styles.textVariant,
          disabled && styles.disabledText
        ]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButton: {
    backgroundColor: 'transparent',
    padding: 4,
  },
  disabled: {
    backgroundColor: '#ccc',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  textVariant: {
    color: '#666',
  },
  disabledText: {
    color: '#666',
  },
}); 