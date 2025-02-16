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
      customContent={
        <View style={styles.container}>
          <View style={styles.content}>
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
                  validate: value =>
                    value === watch('newPassword') || '비밀번호가 일치하지 않습니다',
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

          <View style={styles.footer}>
            <TouchableOpacity
              onPress={handleSubmit(handleFormSubmit)}
              disabled={isLoading}
              style={[styles.submitButton, isLoading && styles.disabledButton]}>
              <Text style={styles.submitButtonText}>{isLoading ? '처리중' : '비밀번호 변경'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {},
  content: {
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
  footer: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  submitButton: {
    backgroundColor: colors.gray[900],
    padding: spacing.md,
    borderRadius: spacing.sm,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: colors.gray[200],
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
