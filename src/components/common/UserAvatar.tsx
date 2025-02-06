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
  size?: 'sm' | 'md' | 'lg';
  showNickname?: boolean;
  disabled?: boolean;
  avatarStyle?: any;
}

export function UserAvatar({
  user,
  size = 'md',
  showNickname = false,
  disabled = false,
  avatarStyle,
}: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    if (!disabled) {
      navigation.push('User', { userId: user.id });
    }
  };

  const getAvatarSize = () => {
    switch (size) {
      case 'sm':
        return 28;
      case 'lg':
        return 40;
      default:
        return 32;
    }
  };

  const avatarSize = getAvatarSize();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.container} onPress={handlePress} disabled={disabled}>
        {user.imageUrl ? (
          <Image
            source={{ uri: user.imageUrl }}
            style={[styles.avatar, avatarStyle, { width: avatarSize, height: avatarSize }]}
          />
        ) : (
          <View
            style={[
              styles.avatar,
              avatarStyle,
              styles.fallback,
              { width: avatarSize, height: avatarSize },
            ]}>
            <Icon name="user" size={avatarSize * 0.6} color={colors.gray[400]} />
          </View>
        )}
        {showNickname && <Text style={styles.nickname}>{user.nickname}</Text>}
      </TouchableOpacity>
    </View>
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
