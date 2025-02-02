import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/apis/auth';
import { Button, Input, Text } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/navigation/AuthStack';
import type { LoginDto } from '@/types/auth';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginScreen({ navigation }: Props) {
  const { setCurrentUser } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: authApi.login,
    onSuccess: response => {
      const { accessToken, user } = response.data;
      // TODO: 토큰 저장 로직 구현
      setCurrentUser(user);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutate(data);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>로그인</Text>
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

        <Controller
          control={control}
          name="password"
          rules={{
            required: '비밀번호를 입력해주세요',
            minLength: {
              value: 6,
              message: '비밀번호는 최소 6자 이상이어야 합니다',
            },
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="비밀번호"
              value={value}
              onChangeText={onChange}
              secureTextEntry
              error={errors.password?.message}
            />
          )}
        />

        {error && (
          <Text style={styles.errorText}>
            {error.response?.data?.message || '로그인에 실패했습니다.'}
          </Text>
        )}

        <Button onPress={handleSubmit(onSubmit)} loading={isPending}>
          로그인
        </Button>

        <View style={styles.links}>
          <Button variant="text" onPress={() => navigation.navigate('ResetPassword')}>
            비밀번호를 잊으셨나요?
          </Button>
          <Button variant="text" onPress={() => navigation.navigate('SignUp')}>
            회원가입
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
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});
