import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text } from './Text';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

const SIZES = {
  xs: 16,
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
} as const;

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const pixelSize = SIZES[size];

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/logo.png')}
        style={[styles.logo, { width: pixelSize, height: pixelSize }]}
        resizeMode="contain"
      />
      {showText && <Text style={styles.text}>고전산책</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    aspectRatio: 1,
  },
  text: {
    marginLeft: 4,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});
