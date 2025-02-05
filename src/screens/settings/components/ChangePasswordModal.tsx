import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Text } from '@/components/common/Text';
import { colors, spacing } from '@/styles/theme';
import { useForm, Controller } from 'react-hook-form';

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
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>비밀번호 변경</Text>
          <View style={styles.form}>
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
                />
              )}
            />
            <Controller
              control={control}
              name="newPassword"
              rules={{ required: '새 비밀번호를 입력해주세요' }}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="새 비밀번호"
                  value={value}
                  onChangeText={onChange}
                  error={errors.newPassword?.message}
                  secureTextEntry
                />
              )}
            />
          </View>
          <View style={styles.buttons}>
            <Button
              variant="outline"
              onPress={onClose}
              style={styles.button}
              textStyle={styles.buttonText}>
              취소
            </Button>
            <Button
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              style={[styles.button, styles.confirmButton]}
              textStyle={styles.confirmButtonText}>
              변경
            </Button>
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
  buttons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    color: colors.gray[900],
  },
  confirmButton: {
    backgroundColor: colors.gray[900],
  },
  confirmButtonText: {
    fontSize: 16,
    color: colors.white,
  },
});
