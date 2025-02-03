import React from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import { Text } from '@/components/common/Text';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/apis/user';
import { colors, spacing, shadows } from '@/styles/theme';
import Icon from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'react-native-image-picker';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface Props {
  userId: number;
}

export function UserInfo({ userId }: Props) {
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();
  const isMyProfile = currentUser?.id === userId;

  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userApi.getUserDetail(userId),
    select: response => response.data,
  });

  const { mutate: uploadImage } = useMutation({
    mutationFn: (file: any) => userApi.uploadProfileImage(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      if (isMyProfile) {
        queryClient.invalidateQueries({ queryKey: ['me'] });
      }
    },
  });

  const handleImagePick = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
      },
      response => {
        if (response.assets?.[0]) {
          uploadImage(response.assets[0]);
        }
      },
    );
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>프로필</Text>
        {isMyProfile && (
          <Pressable style={styles.settingsButton}>
            <Icon name="settings" size={20} color={colors.gray[700]} />
          </Pressable>
        )}
      </View>
      <View style={styles.profileSection}>
        <View style={styles.imageContainer}>
          <Pressable onPress={isMyProfile ? handleImagePick : undefined}>
            {user.imageUrl ? (
              <Image source={{ uri: user.imageUrl }} style={styles.profileImage} />
            ) : (
              <View style={[styles.profileImage, styles.defaultProfile]}>
                <Icon name="user" size={48} color={colors.gray[400]} />
              </View>
            )}
            {isMyProfile && (
              <View style={styles.editButton}>
                <Icon name="camera" size={16} color={colors.gray[700]} />
              </View>
            )}
          </Pressable>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.nickname}>{user.nickname}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  settingsButton: {
    padding: spacing.sm,
    marginRight: -spacing.sm,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.lg,
  },
  imageContainer: {
    position: 'relative',
    ...shadows.md,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.gray[200],
  },
  defaultProfile: {
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    padding: spacing.sm,
    borderRadius: 20,
    ...shadows.sm,
  },
  userInfo: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  nickname: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.gray[900],
  },
  email: {
    fontSize: 14,
    color: colors.gray[500],
  },
});
