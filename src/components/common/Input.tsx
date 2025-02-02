import React from 'react';
import { TextInput, TextInputProps, View, StyleSheet, Text } from 'react-native';

interface Props extends TextInputProps {
  error?: string;
}

export function Input({ error, style, ...props }: Props) {
  return (
    <View style={styles.container}>
      <TextInput 
        style={[
          styles.input,
          error && styles.inputError,
          style
        ]}
        placeholderTextColor="#999"
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
}); 