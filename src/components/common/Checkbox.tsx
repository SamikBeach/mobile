import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors, spacing, borderRadius } from '@/styles/theme';

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Checkbox({ checked, onChange, disabled }: Props) {
  return (
    <Pressable
      style={[styles.container, checked && styles.checked, disabled && styles.disabled]}
      onPress={() => !disabled && onChange(!checked)}
      disabled={disabled}>
      {checked && <Icon name="check" size={12} color={colors.white} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.gray[300],
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  disabled: {
    backgroundColor: colors.gray[100],
    borderColor: colors.gray[300],
  },
});
