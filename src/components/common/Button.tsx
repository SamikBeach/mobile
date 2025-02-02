import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacityProps,
  StyleProp,
  TextStyle
} from 'react-native';

interface Props extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'solid' | 'outline' | 'text';
  loading?: boolean;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({ 
  children, 
  variant = 'solid',
  loading,
  style,
  disabled,
  textStyle,
  ...props 
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'solid' && styles.solidButton,
        variant === 'outline' && styles.outlineButton,
        variant === 'text' && styles.textButton,
        disabled && styles.disabled,
        style
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'solid' ? 'white' : '#111827'} />
      ) : (
        <Text style={[
          styles.text,
          variant === 'solid' && styles.solidText,
          variant === 'outline' && styles.outlineText,
          variant === 'text' && styles.textButtonText,
          disabled && styles.disabledText,
          textStyle
        ]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  solidButton: {
    backgroundColor: '#111827',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#111827',
  },
  textButton: {
    backgroundColor: 'transparent',
  },
  disabled: {
    backgroundColor: '#ccc',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  solidText: {
    color: 'white',
  },
  outlineText: {
    color: '#111827',
  },
  textButtonText: {
    color: '#111827',
  },
  disabledText: {
    color: '#666',
  },
}); 