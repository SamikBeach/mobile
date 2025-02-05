import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, useController } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/apis/auth';
import { Button, Input } from '@/components/common';
import Toast from 'react-native-toast-message';

interface EmailFormData {
  email: string;
}

interface Props {
  onSuccess: (email: string) => void;
  onClickGoToLogin: () => void;
}

export function EmailForm({ onSuccess, onClickGoToLogin }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    defaultValues: {
      email: '',
    },
  });

  const { field: emailField } = useController({
    name: 'email',
    control,
    rules: {
      required: '이메일을 입력해주세요',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: '올바른 이메일 형식이 아닙니다',
      },
    },
  });

  const { mutate: sendCode, isPending } = useMutation({
    mutationFn: authApi.sendPasswordResetCode,
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: '인증 코드가 이메일로 전송되었습니다.',
      });
      onSuccess(emailField.value);
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: error.response?.data?.message || '인증 코드 전송에 실패했습니다.',
      });
    },
  });

  const onSubmit = handleSubmit(() => {
    sendCode(emailField.value);
  });

  return (
    <View style={styles.form}>
      <Input
        value={emailField.value}
        onChangeText={emailField.onChange}
        placeholder="이메일을 입력해주세요"
        error={errors.email?.message}
      />
      <Button onPress={onSubmit} loading={isPending}>
        인증 코드 받기
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
