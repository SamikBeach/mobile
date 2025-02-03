import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/apis/auth';
import { Button, Input, Text } from '@/components/common';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/navigation/AuthStack';
import { currentUserAtom } from '@/atoms/auth';
import { useSetAtom } from 'jotai';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const setCurrentUser = useSetAtom(currentUserAtom);
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
      const { user } = response.data;
      setCurrentUser(user);
    },
  });

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
          rules={{ required: '비밀번호를 입력해주세요' }}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="비밀번호"
              value={value}
              onChangeText={onChange}
              error={errors.password?.message}
              secureTextEntry
            />
          )}
        />

        {error && (
          <Text style={styles.errorText}>
            {error.response?.data?.message || '로그인에 실패했습니다.'}
          </Text>
        )}

        <Button onPress={handleSubmit(data => mutate(data))} loading={isPending}>
          로그인
        </Button>

        <View style={styles.links}>
          <Button
            variant="text"
            onPress={() => navigation.navigate('ResetPassword')}
            style={styles.linkButton}>
            <Text style={styles.linkText}>비밀번호를 잊으셨나요?</Text>
          </Button>
          <View style={styles.divider} />
          <Button
            variant="text"
            onPress={() => navigation.navigate('SignUp')}
            style={styles.linkButton}>
            <Text style={styles.linkText}>회원가입</Text>
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
  },
  linkButton: {
    height: 32,
  },
  linkText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '400',
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
  },
});
