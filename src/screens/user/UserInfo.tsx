import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text } from '@/components/common/Text';
import { Avatar } from '@/components/common/Avatar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/apis/user';
import { colors, spacing } from '@/styles/theme';
import * as ImagePicker from 'react-native-image-picker';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import Toast from 'react-native-toast-message';
import { UserInfoSkeleton } from '@/components/common/Skeleton/UserInfoSkeleton';
import { ActionSheet } from '@/components/common/ActionSheet/ActionSheet';
import { Input } from '@/components/common/Input';
import { useForm, Controller } from 'react-hook-form';
import Icon from 'react-native-vector-icons/Feather';

interface UserInfoProps {
  userId: number;
  rightElement?: React.ReactNode;
}

interface NicknameFormData {
  nickname: string;
}

interface ImageFormData extends FormData {
  append(name: string, value: Blob | string, fileName?: string): void;
}

export function UserInfo({ userId, rightElement }: UserInfoProps) {
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();
  const isMyProfile = currentUser?.id === userId;
  const [isEditMode, setIsEditMode] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId] as const,
    queryFn: () => userApi.getUserDetail(userId),
    select: response => response.data,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NicknameFormData>({
    defaultValues: {
      nickname: user?.nickname || '',
    },
  });

  const { mutate: uploadImage, isPending: isUploading } = useMutation({
    mutationFn: (formData: ImageFormData) => userApi.uploadProfileImage(formData),
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: '프로필 이미지가 변경되었습니다.',
      });
      queryClient.invalidateQueries({ queryKey: ['user', userId] as const });
      if (isMyProfile) {
        queryClient.invalidateQueries({ queryKey: ['me'] as const });
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
      queryClient.invalidateQueries({ queryKey: ['user', userId] as const });
      if (isMyProfile) {
        queryClient.invalidateQueries({ queryKey: ['me'] as const });
      }
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: '이미지 삭제 중 오류가 발생했습니다.',
      });
    },
  });

  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: (data: NicknameFormData) => userApi.updateProfile(data),
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: '닉네임이 변경되었습니다.',
      });
      setIsEditMode(false);
      queryClient.invalidateQueries({ queryKey: ['user', userId] as const });
      if (isMyProfile) {
        queryClient.invalidateQueries({ queryKey: ['me'] as const });
      }
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: '닉네임 변경 중 오류가 발생했습니다.',
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
          const formData = new FormData() as ImageFormData;
          formData.append('image', {
            uri: response.assets[0].uri,
            type: response.assets[0].type,
            name: response.assets[0].fileName,
          } as unknown as Blob);
          uploadImage(formData);
        }
      },
    );
  };

  const handleImagePress = () => {
    if (!isMyProfile || isUploading || isDeleting) return;

    if (user?.imageUrl) {
      Alert.alert('프로필 이미지', '프로필 이미지를 변경하거나 삭제할 수 있습니다.', [
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
      ]);
    } else {
      Alert.alert('프로필 이미지', '프로필 이미지를 추가하시겠습니까?', [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '이미지 선택',
          onPress: handleImagePick,
        },
      ]);
    }
  };

  const handleUpdateNickname = (data: NicknameFormData) => {
    updateProfile(data);
  };

  if (isLoading) {
    return <UserInfoSkeleton rightElement={rightElement} />;
  }

  if (!user) return null;

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>{rightElement}</View>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={isMyProfile ? handleImagePress : undefined}>
            <Avatar uri={user.imageUrl} size={120} loading={isUploading || isDeleting} />
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <View style={styles.nicknameContainer}>
              <Text style={styles.nickname}>{user.nickname}</Text>
              {isMyProfile && (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setIsEditMode(true)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Icon name="edit-2" size={16} color={colors.gray[400]} />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </View>
      </View>

      <ActionSheet
        visible={isEditMode}
        onClose={() => setIsEditMode(false)}
        title="닉네임 변경"
        headerRight={
          <TouchableOpacity
            onPress={handleSubmit(handleUpdateNickname)}
            disabled={isUpdating}
            style={[styles.actionButton, isUpdating && styles.disabledButton]}>
            <Text style={styles.actionButtonText}>완료</Text>
          </TouchableOpacity>
        }
        customContent={
          <View style={styles.form}>
            <Controller
              control={control}
              name="nickname"
              rules={{
                required: '닉네임을 입력해주세요',
                minLength: {
                  value: 2,
                  message: '닉네임은 2자 이상이어야 합니다',
                },
                maxLength: {
                  value: 10,
                  message: '닉네임은 10자 이하여야 합니다',
                },
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="닉네임 (2-10자)"
                  value={value}
                  onChangeText={onChange}
                  error={errors.nickname?.message}
                  style={styles.input}
                  autoFocus
                />
              )}
            />
          </View>
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  header: {
    height: 52,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
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
  nicknameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  nickname: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.gray[900],
  },
  editButton: {
    marginTop: 4,
  },
  email: {
    fontSize: 14,
    color: colors.gray[500],
  },
  form: {
    padding: spacing.xl,
  },
  input: {
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: spacing.sm,
    backgroundColor: colors.gray[900],
  },
  disabledButton: {
    backgroundColor: colors.gray[200],
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.white,
  },
});
