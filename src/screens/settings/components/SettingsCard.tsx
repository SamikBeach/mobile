import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/styles/theme';

interface SettingsCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  variant?: 'default' | 'destructive';
  onPress: () => void;
}

export function SettingsCard({
  icon,
  title,
  description,
  buttonText,
  variant = 'default',
  onPress,
}: SettingsCardProps) {
  const isDestructive = variant === 'destructive';

  return (
    <View style={[styles.card, isDestructive && styles.destructiveCard]}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={[styles.title, isDestructive && styles.destructiveText]}>{title}</Text>
      </View>
      <Text style={[styles.description, isDestructive && styles.destructiveText]}>
        {description}
      </Text>
      <TouchableOpacity
        style={[styles.button, isDestructive && styles.destructiveButton]}
        onPress={onPress}>
        <Text style={[styles.buttonText, isDestructive && styles.destructiveButtonText]}>
          {buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  destructiveCard: {
    borderColor: colors.red[200],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  destructiveText: {
    color: colors.red[500],
  },
  description: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.blue[500],
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  destructiveButton: {
    backgroundColor: colors.red[500],
  },
  buttonText: {
    color: colors.white,
    fontWeight: '600',
  },
  destructiveButtonText: {
    color: colors.white,
  },
});
