import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { colors } from '@/styles/theme';

interface Props {
  style?: ViewStyle;
}

export function Skeleton({ style }: Props) {
  return <View style={[styles.base, style]} />;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.gray[200],
  },
});
