import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { UserBase } from '@/types/user';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

interface Props {
  user: UserBase;
  size?: 'sm' | 'md';
  showNickname?: boolean;
  disabled?: boolean;
}

export function UserAvatar({ user, size = 'md', showNickname = false, disabled = false }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    if (disabled) return;
    navigation.navigate('User', { userId: user.id });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} disabled={disabled}>
      <Image
        source={{ uri: user.imageUrl ?? undefined }}
        style={[styles.avatar, size === 'sm' ? styles.avatarSmall : styles.avatarMedium]}
      />
      {showNickname && <Text style={styles.nickname}>{user.nickname}</Text>}
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
    backgroundColor: '#F3F4F6',
    borderRadius: 9999,
  },
  avatarSmall: {
    width: 28,
    height: 28,
  },
  avatarMedium: {
    width: 40,
    height: 40,
  },
  nickname: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
});
