import React from 'react';
import { Image, StyleSheet, View, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '@/styles/theme';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  imageUrl?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onPress?: () => void;
}

const getSizeStyle = (size: Props['size']) => {
  switch (size) {
    case 'xs':
      return { width: 24, height: 36, borderRadius: 2 };
    case 'sm':
      return { width: 40, height: 60, borderRadius: 4 };
    case 'md':
      return { width: 80, height: 120, borderRadius: 6 };
    case 'lg':
      return { width: 100, height: 150, borderRadius: 8 };
    case 'xl':
    default:
      return { width: 120, height: 180, borderRadius: 10 };
  }
};

export function BookImage({ imageUrl, size = 'xl', onPress }: Props) {
  const sizeStyle = getSizeStyle(size);
  const Container = onPress ? Pressable : View;

  if (imageUrl) {
    return (
      <Container style={[styles.container, sizeStyle]} onPress={onPress}>
        <Image source={{ uri: imageUrl }} style={[styles.image, sizeStyle]} resizeMode="cover" />
      </Container>
    );
  }

  return (
    <Container style={[styles.container, sizeStyle]} onPress={onPress}>
      <LinearGradient
        colors={[colors.gray[50], colors.gray[100], colors.gray[50]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.fallbackContainer, sizeStyle]}>
        <Icon
          name="book"
          size={sizeStyle.width * 0.5}
          color={colors.gray[400]}
          style={styles.fallbackIcon}
        />
      </LinearGradient>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallbackContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackIcon: {
    opacity: 0.8,
  },
});
