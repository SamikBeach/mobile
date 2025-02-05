import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Input } from '@/components/common/Input';
import { Text } from '@/components/common/Text';
import { colors, spacing } from '@/styles/theme';
import { useForm, Controller } from 'react-hook-form';

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

export function ChangePasswordModal({ visible, onClose, onSubmit, isLoading }: Props) {
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

  const newPassword = watch('newPassword');

  const handleFormSubmit = (data: FormData) => {
    onSubmit({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>비밀번호 변경</Text>
          <View style={styles.form}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>현재 비밀번호</Text>
              <Controller
                control={control}
                name="currentPassword"
                rules={{ required: '현재 비밀번호를 입력해주세요' }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="현재 비밀번호를 입력하세요"
                    value={value}
                    onChangeText={onChange}
                    error={errors.currentPassword?.message}
                    secureTextEntry
                  />
                )}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>새 비밀번호</Text>
              <View style={styles.inputGroup}>
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
                      placeholder="새 비밀번호를 입력하세요"
                      value={value}
                      onChangeText={onChange}
                      error={errors.newPassword?.message}
                      secureTextEntry
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="confirmPassword"
                  rules={{
                    required: '새 비밀번호를 한번 더 입력해주세요',
                    validate: value => value === newPassword || '비밀번호가 일치하지 않습니다',
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder="새 비밀번호를 한번 더 입력하세요"
                      value={value}
                      onChangeText={onChange}
                      error={errors.confirmPassword?.message}
                      secureTextEntry
                    />
                  )}
                />
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton, isLoading && styles.disabledButton]}
              onPress={onClose}
              disabled={isLoading}>
              <Text style={styles.buttonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton, isLoading && styles.disabledButton]}
              onPress={handleSubmit(handleFormSubmit)}
              disabled={isLoading}>
              <Text style={styles.confirmButtonText}>{isLoading ? '처리중...' : '변경'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  form: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: colors.gray[100],
  },
  confirmButton: {
    backgroundColor: colors.gray[900],
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[700],
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  inputGroup: {
    gap: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginVertical: spacing.lg,
  },
});
