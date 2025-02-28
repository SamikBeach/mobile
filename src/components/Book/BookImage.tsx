import React from 'react';
import { Image, StyleSheet, View, TouchableOpacity, ImageStyle, StyleProp } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '@/styles/theme';

interface Props {
  imageUrl: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
  onPress?: () => void;
  title?: string;
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

export function BookImage({ imageUrl, size = 'xl', width, height, style, onPress }: Props) {
  const sizeStyle = getSizeStyle(size);

  // width와 height가 명시적으로 제공된 경우 이를 우선 사용
  const finalWidth = width || sizeStyle.width;
  const finalHeight = height || sizeStyle.height;

  const imageStyle = [
    styles.image,
    {
      width: finalWidth,
      height: finalHeight,
      borderRadius: sizeStyle.borderRadius,
    },
    style,
  ];

  const Container = onPress ? TouchableOpacity : View;

  if (imageUrl) {
    return (
      <Container style={styles.container} onPress={onPress} activeOpacity={0.8}>
        <Image source={{ uri: imageUrl }} style={imageStyle} resizeMode="cover" />
      </Container>
    );
  }

  return (
    <Container style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={[imageStyle, styles.fallbackContainer]}>
        <Icon
          name="book"
          size={finalWidth * 0.3}
          color={colors.gray[400]}
          style={styles.fallbackIcon}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    backgroundColor: colors.gray[100],
  },
  fallbackContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray[100],
  },
  fallbackIcon: {
    opacity: 0.8,
  },
});
