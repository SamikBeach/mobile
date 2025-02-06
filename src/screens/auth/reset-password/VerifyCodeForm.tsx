import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, useController } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/apis/auth';
import { Button, Input } from '@/components/common';
import Toast from 'react-native-toast-message';

interface CodeFormData {
  code: string;
}

interface Props {
  email: string;
  onSuccess: () => void;
  onClickGoToLogin: () => void;
}

export function VerifyCodeForm({ email, onSuccess, onClickGoToLogin }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CodeFormData>({
    defaultValues: {
      code: '',
    },
  });

  const { field: codeField } = useController({
    name: 'code',
    control,
    rules: {
      required: '인증 코드를 입력해주세요',
      minLength: {
        value: 6,
        message: '인증 코드는 6자리입니다',
      },
      maxLength: {
        value: 6,
        message: '인증 코드는 6자리입니다',
      },
    },
  });

  const { mutate: verifyCode, isPending } = useMutation({
    mutationFn: (code: string) => authApi.verifyPasswordResetCode(email, code),
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: '인증되었습니다.',
      });
      onSuccess();
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: error.response?.data?.message || '인증 코드가 올바르지 않습니다.',
      });
    },
  });

  const onSubmit = handleSubmit(() => {
    verifyCode(codeField.value);
  });

  return (
    <View style={styles.form}>
      <Input
        value={codeField.value}
        onChangeText={codeField.onChange}
        placeholder="인증 코드 6자리를 입력해주세요"
        error={errors.code?.message}
      />
      <Button onPress={onSubmit} loading={isPending}>
        인증하기
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
