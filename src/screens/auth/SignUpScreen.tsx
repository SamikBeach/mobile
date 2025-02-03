import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/apis/auth';
import { Button, Input, Text } from '@/components/common';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/navigation/types';
import type { EmailVerificationDto } from '@/types/auth';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

export default function SignUpScreen({ navigation }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailVerificationDto>({
    defaultValues: {
      email: '',
    },
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: authApi.checkEmail,
    onSuccess: () => {
      // 이메일 확인 성공 시 UserInfo 화면으로 이동
      navigation.navigate('UserInfo', { email: control._getWatch('email') });
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>회원가입</Text>
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
            {error.response?.data?.message || '이메일 확인에 실패했습니다.'}
          </Text>
        )}

        <Button onPress={handleSubmit(data => mutate(data))} loading={isPending}>
          회원가입
        </Button>

        <View style={styles.links}>
          <Text style={styles.linkText}>이미 계정이 있으신가요?</Text>
          <Button
            variant="text"
            onPress={() => navigation.navigate('Login')}
            style={styles.linkButton}>
            <Text style={[styles.linkText, styles.linkButton]}>로그인</Text>
          </Button>
        </View>
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
  },
  form: {
    gap: 16,
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  linkButton: {
    height: 32,
  },
  linkText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '400',
  },
  linkButtonText: {
    color: '#111827',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
  },
});
