import React from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import { Text } from '@/components/common/Text';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/apis/user';
import { colors, spacing } from '@/styles/theme';
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
      <View style={styles.profileSection}>
        <Pressable onPress={isMyProfile ? handleImagePick : undefined}>
          <Image
            source={{ uri: user.imageUrl ?? undefined }}
            style={styles.profileImage}
            defaultSource={require('@/assets/images/default-profile.png')}
          />
          {isMyProfile && (
            <View style={styles.editButton}>
              <Icon name="edit-2" size={16} color={colors.gray[500]} />
            </View>
          )}
        </Pressable>
        <View style={styles.userInfo}>
          <Text style={styles.nickname}>{user.nickname}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  profileSection: {
    alignItems: 'center',
    gap: spacing.md,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.gray[200],
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    padding: spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  userInfo: {
    alignItems: 'center',
  },
  nickname: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.gray[900],
  },
});
