import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';

interface Props {
  icon: React.ReactNode;
  message: string;
  description?: string;
}

export function Empty({ icon, message, description }: Props) {
  return (
    <View style={styles.container}>
      {icon}
      <Text style={styles.message}>{message}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
}); 