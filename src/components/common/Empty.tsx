import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import Icon from 'react-native-vector-icons/Feather';
import { colors, spacing } from '@/styles/theme';

interface Props {
  message: string;
  description?: string;
  icon?: string;
}

export function Empty({ message, description, icon = 'inbox' }: Props) {
  return (
    <View style={styles.container}>
      <Icon name={icon} size={24} color={colors.gray[400]} />
      <View style={styles.textContainer}>
        <Text style={styles.message}>{message}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
  },
  textContainer: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  message: {
    fontSize: 15,
    color: colors.gray[600],
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    color: colors.gray[500],
    textAlign: 'center',
  },
});
