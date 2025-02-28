import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text } from '@/components/common/Text';
import { colors } from '@/styles/theme';

interface Props {
  imageUrl: string | null;
  name: string;
  size?: number;
  style?: any;
}

export function AuthorAvatar({ imageUrl, name, size = 120, style }: Props) {
  const getInitials = (_name: string) => {
    return _name.charAt(0);
  };

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const textStyle = {
    fontSize: size / 3,
  };

  return (
    <View style={[styles.container, containerStyle, style]}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <Text style={[styles.initials, textStyle]}>{getInitials(name)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    color: colors.gray[700],
    fontWeight: '600',
  },
});
