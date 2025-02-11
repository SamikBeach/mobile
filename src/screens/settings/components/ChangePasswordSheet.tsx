import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Input } from '@/components/common/Input';
import { Text } from '@/components/common/Text';
import { colors, spacing } from '@/styles/theme';
import { useForm, Controller } from 'react-hook-form';
import { ActionSheet } from '@/components/common/ActionSheet/ActionSheet';

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { currentPassword: string; newPassword: string }) => void;
  isLoading?: boolean;
}

export function ChangePasswordSheet({ visible, onClose, onSubmit, isLoading }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleFormSubmit = (data: FormData) => {
    onSubmit({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <ActionSheet
      visible={visible}
      onClose={onClose}
      title="비밀번호 변경"
      headerRight={
        <TouchableOpacity
          onPress={handleSubmit(handleFormSubmit)}
          disabled={isLoading}
          style={[styles.actionButton, isLoading && styles.disabledButton]}>
          <Text style={styles.actionButtonText}>{isLoading ? '처리중' : '완료'}</Text>
        </TouchableOpacity>
      }
      customContent={
        <View style={styles.form}>
          <View style={styles.formSection}>
            <Text style={styles.label}>현재 비밀번호</Text>
            <Controller
              control={control}
              name="currentPassword"
              rules={{ required: '현재 비밀번호를 입력해주세요' }}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="현재 비밀번호"
                  value={value}
                  onChangeText={onChange}
                  error={errors.currentPassword?.message}
                  secureTextEntry
                  style={styles.input}
                />
              )}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>새 비밀번호</Text>
            <Controller
              control={control}
              name="newPassword"
              rules={{
                required: '새 비밀번호를 입력해주세요',
                minLength: {
                  value: 8,
                  message: '비밀번호는 8자 이상이어야 합니다',
                },
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="새 비밀번호 (8자 이상)"
                  value={value}
                  onChangeText={onChange}
                  error={errors.newPassword?.message}
                  secureTextEntry
                  style={styles.input}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: '새 비밀번호를 한번 더 입력해주세요',
                validate: value => value === watch('newPassword') || '비밀번호가 일치하지 않습니다',
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="새 비밀번호 확인"
                  value={value}
                  onChangeText={onChange}
                  error={errors.confirmPassword?.message}
                  secureTextEntry
                  style={styles.input}
                />
              )}
            />
          </View>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  form: {
    padding: spacing.xl,
    gap: spacing.xl,
  },
  formSection: {
    gap: spacing.md,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray[800],
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
