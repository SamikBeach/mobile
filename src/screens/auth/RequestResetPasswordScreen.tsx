import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/apis/auth';
import { Button, Input, Text } from '@/components/common';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { AxiosError } from 'axios';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<RootStackParamList, 'RequestResetPassword'>;

interface ResetPasswordRequestFormData {
  email: string;
}

export default function RequestResetPasswordScreen({ navigation }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordRequestFormData>({
    defaultValues: {
      email: '',
    },
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: authApi.sendPasswordResetEmail,
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: '비밀번호 재설정 이메일이 전송되었습니다.',
      });
      navigation.navigate('Login');
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>비밀번호 재설정</Text>
        <Text style={styles.subtitle}>
          가입한 이메일을 입력하시면{'\n'}
          비밀번호 재설정 링크를 보내드립니다
        </Text>
      </View>

      <View style={styles.form}>
        <Controller
          control={control}
          name="email"
          rules={{
            required: '이메일을 입력해주세요',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: '올바른 이메일 형식이 아닙니다',
            },
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="이메일"
              value={value}
              onChangeText={onChange}
              error={errors.email?.message}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />

        {error && (
          <Text style={styles.errorText}>
            {(error as AxiosError<{ message: string }>)?.response?.data?.message ||
              '이메일 전송에 실패했습니다.'}
          </Text>
        )}

        <Button onPress={handleSubmit(data => mutate(data.email))} loading={isPending}>
          {isPending ? '전송 중...' : '비밀번호 재설정 이메일 받기'}
        </Button>

        <Button variant="text" onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>로그인으로 돌아가기</Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    gap: 16,
  },
  linkText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '400',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
  },
});
