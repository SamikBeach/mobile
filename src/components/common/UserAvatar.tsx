import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { UserBase } from '@/types/user';

interface Props {
  user: UserBase;
  size?: 'sm' | 'md' | 'lg';
  showNickname?: boolean;
}

const getSizeStyle = (size: 'sm' | 'md' | 'lg') => {
  const sizes = {
    sm: 32,
    md: 40,
    lg: 48,
  };
  return {
    width: sizes[size],
    height: sizes[size],
  };
};

export function UserAvatar({ user, size = 'md', showNickname = true }: Props) {
  const sizeStyle = getSizeStyle(size);
  const textSize = {
    sm: 14,
    md: 14,
    lg: 16,
  }[size];

  return (
    <TouchableOpacity style={styles.container} onPress={() => {}}>
      {user.imageUrl ? (
        <Image
          source={{ uri: user.imageUrl }}
          style={[styles.avatar, sizeStyle]}
        />
      ) : (
        <View style={[styles.placeholderAvatar, sizeStyle]}>
          <Icon
            name="user"
            size={sizeStyle.width * 0.5}
            color="#9CA3AF"
          />
        </View>
      )}
      {showNickname && (
        <Text style={[styles.nickname, { fontSize: textSize }]}>
          {user.nickname ?? '알 수 없음'}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    borderRadius: 9999,
  },
  placeholderAvatar: {
    borderRadius: 9999,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nickname: {
    fontWeight: '500',
  },
}); 