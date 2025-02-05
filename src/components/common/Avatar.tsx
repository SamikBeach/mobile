import React from 'react';
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { colors } from '@/styles/theme';
import Icon from 'react-native-vector-icons/Feather';

interface Props {
  uri?: string | null;
  size?: number;
  loading?: boolean;
}

export function Avatar({ uri, size = 40, loading }: Props) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {loading ? (
        <ActivityIndicator color={colors.gray[500]} />
      ) : uri ? (
        <Image source={{ uri }} style={styles.image} />
      ) : (
        <Icon name="user" size={size * 0.5} color={colors.gray[400]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 9999,
    overflow: 'hidden',
    backgroundColor: colors.gray[200],
  },
  image: {
    width: '100%',
    height: '100%',
  },
}); 