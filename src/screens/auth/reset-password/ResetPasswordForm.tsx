import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, useController } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/apis/auth';
import { Button, Input } from '@/components/common';
import Toast from 'react-native-toast-message';

interface PasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

interface Props {
  email: string;
  onSuccess: () => void;
  onClickGoToLogin: () => void;
}

export function ResetPasswordForm({ email, onSuccess, onClickGoToLogin }: Props) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PasswordFormData>({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { field: newPasswordField } = useController({
    name: 'newPassword',
    control,
    rules: {
      required: '새 비밀번호를 입력해주세요',
      minLength: {
        value: 6,
        message: '비밀번호는 최소 6자 이상이어야 합니다',
      },
    },
  });

  const { field: confirmPasswordField } = useController({
    name: 'confirmPassword',
    control,
    rules: {
      required: '비밀번호를 다시 입력해주세요',
      validate: value => value === watch('newPassword') || '비밀번호가 일치하지 않습니다',
    },
  });

  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: (password: string) => authApi.resetPassword(email, password),
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: '비밀번호가 변경되었습니다.',
      });
      onSuccess();
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: error.response?.data?.message || '비밀번호 변경에 실패했습니다.',
      });
    },
  });

  const onSubmit = handleSubmit(data => {
    resetPassword(data.newPassword);
  });

  return (
    <View style={styles.form}>
      <Input
        value={newPasswordField.value}
        onChangeText={newPasswordField.onChange}
        placeholder="새 비밀번호"
        secureTextEntry
        error={errors.newPassword?.message}
      />
      <Input
        value={confirmPasswordField.value}
        onChangeText={confirmPasswordField.onChange}
        placeholder="비밀번호 확인"
        secureTextEntry
        error={errors.confirmPassword?.message}
      />
      <Button onPress={onSubmit} loading={isPending}>
        비밀번호 변경
      </Button>
      <Button variant="text" onPress={onClickGoToLogin} style={styles.linkButton} textStyle={styles.linkText}>
        로그인으로 돌아가기
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
  linkButton: {
    height: 32,
    marginTop: 8,
  },
  linkText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '400',
  },
});
