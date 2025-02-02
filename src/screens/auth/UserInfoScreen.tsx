import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/apis/auth';
import { Button, Input, Text } from '@/components/common';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/navigation/AuthStack';
import type { RegisterDto } from '@/types/auth';

type Props = NativeStackScreenProps<AuthStackParamList, 'UserInfo'>;

export default function UserInfoScreen({ route, navigation }: Props) {
  const { email } = route.params;

  const { control, handleSubmit, watch, formState: { errors } } = useForm<RegisterDto>({
    defaultValues: {
      email,
      nickname: '',
      password: '',
    },
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: authApi.initiateRegistration,
    onSuccess: () => {
      navigation.navigate('VerifyCode', { email });
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>회원정보 입력</Text>
      </View>

      <View style={styles.form}>
        <Controller
          control={control}
          name="nickname"
          rules={{
            required: '닉네임을 입력해주세요',
            minLength: {
              value: 2,
              message: '닉네임은 최소 2자 이상이어야 합니다',
            },
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="닉네임"
              value={value}
              onChangeText={onChange}
              error={errors.nickname?.message}
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
            {error.response?.data?.message || '회원가입에 실패했습니다.'}
          </Text>
        )}

        <Button onPress={handleSubmit(data => mutate(data))} loading={isPending}>
          다음
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
  },
  form: {
    gap: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
}); 