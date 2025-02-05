import React from 'react';
import { View, StyleSheet, Image, Pressable, TouchableOpacity, Alert } from 'react-native';
import { Text } from '@/components/common/Text';
import { Avatar } from '@/components/common/Avatar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/apis/user';
import { colors, spacing, shadows } from '@/styles/theme';
import Icon from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'react-native-image-picker';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import Toast from 'react-native-toast-message';

interface UserInfoProps {
  userId: number;
  rightElement?: React.ReactNode;
}

export function UserInfo({ userId, rightElement }: UserInfoProps) {
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();
  const isMyProfile = currentUser?.id === userId;

  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userApi.getUserDetail(userId),
    select: response => response.data,
  });

  const { mutate: uploadImage, isPending: isUploading } = useMutation({
    mutationFn: (formData: FormData) => userApi.uploadProfileImage(formData),
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: '프로필 이미지가 변경되었습니다.',
      });
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      if (isMyProfile) {
        queryClient.invalidateQueries({ queryKey: ['me'] });
      }
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: '이미지 업로드 중 오류가 발생했습니다.',
      });
    },
  });

  const { mutate: deleteImage, isPending: isDeleting } = useMutation({
    mutationFn: () => userApi.deleteProfileImage(),
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: '프로필 이미지가 삭제되었습니다.',
      });
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      if (isMyProfile) {
        queryClient.invalidateQueries({ queryKey: ['me'] });
      }
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: '이미지 삭제 중 오류가 발생했습니다.',
      });
    },
  });

  const handleImagePick = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 512,
        maxHeight: 512,
        quality: 0.8,
      },
      response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Toast.show({
            type: 'error',
            text1: '이미지를 선택하는 중 오류가 발생했습니다.',
          });
          return;
        }

        if (response.assets?.[0].uri) {
          const formData = new FormData();
          formData.append('image', {
            uri: response.assets[0].uri,
            type: response.assets[0].type,
            name: response.assets[0].fileName,
          });
          uploadImage(formData);
        }
      },
    );
  };

  const handleImagePress = () => {
    if (isUploading || isDeleting) return;

    Alert.alert(
      '프로필 이미지',
      '프로필 이미지를 변경하거나 삭제할 수 있습니다.',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => deleteImage(),
        },
        {
          text: '변경',
          onPress: handleImagePick,
        },
      ],
    );
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {rightElement}
      </View>
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={isMyProfile ? handleImagePress : undefined}>
          <Avatar
            uri={user.imageUrl}
            size={120}
            loading={isUploading || isDeleting}
          />
        </TouchableOpacity>
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.lg,
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
