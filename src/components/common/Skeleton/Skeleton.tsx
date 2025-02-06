import React from 'react';
import { View, ViewStyle, StyleSheet, StyleProp } from 'react-native';
import { colors } from '@/styles/theme';

interface Props {
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({ style }: Props) {
  return <View style={[styles.base, style]} />;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.gray[200],
  },
});
