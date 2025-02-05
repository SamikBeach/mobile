import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, useController } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/apis/auth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text } from '@/components/common';

type ResetPasswordFormData = {
  newPassword: string;
  confirmPassword: string;
};

type ResetPasswordScreenRouteProp = RouteProp<RootStackParamList, 'ResetPassword'>;

export function ResetPasswordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ResetPasswordScreenRouteProp>();
  const { email, token } = route.params;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { field: newPasswordField } = useController({
    name: 'newPassword',
    control,
    rules: {
      required: '새로운 비밀번호를 입력해주세요',
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

  const { mutate: verifyToken, isPending: isVerifying } = useMutation({
    mutationFn: () => {
      if (!email || !token) {
        throw new Error('이메일 또는 토큰이 없습니다.');
      }
      return authApi.verifyPasswordResetToken(email, token);
    },
    onError: () => {
      navigation.navigate('Login');
    },
  });

  const { mutate: resetPassword, isPending: isResetting } = useMutation({
    mutationFn: (data: ResetPasswordFormData) => {
      if (!email || !token) {
        throw new Error('이메일 또는 토큰이 없습니다.');
      }
      return authApi.resetPassword(email, token, data.newPassword);
    },
    onSuccess: () => {
      navigation.navigate('Login');
    },
  });

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const onSubmit = handleSubmit(data => {
    resetPassword(data);
  });

  if (isVerifying) {
    return (
      <View style={styles.container}>
        <Text>토큰 검증 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Input
          value={newPasswordField.value}
          onChangeText={newPasswordField.onChange}
          placeholder="새로운 비밀번호"
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

        <Button onPress={onSubmit} disabled={isResetting} loading={isResetting}>
          {isResetting ? '변경 중...' : '비밀번호 변경'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  form: {
    gap: 16,
  },
});
