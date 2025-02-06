import React from 'react';
import { Image, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { UserBase } from '@/types/user';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '@/styles/theme';

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

  const avatarStyle = size === 'sm' ? styles.avatarSmall : styles.avatarMedium;
  const iconSize = size === 'sm' ? 14 : 20;

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} disabled={disabled}>
      {user.imageUrl ? (
        <Image source={{ uri: user.imageUrl }} style={[styles.avatar, avatarStyle]} />
      ) : (
        <View style={[styles.avatar, avatarStyle, styles.fallback]}>
          <Icon name="user" size={iconSize} color={colors.gray[400]} />
        </View>
      )}
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
  fallback: {
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  nickname: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[900],
  },
});
