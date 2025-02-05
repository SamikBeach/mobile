import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/apis/auth';
import { Button, Input, Text } from '@/components/common';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import type { RegisterCompleteDto } from '@/types/auth';
import { AxiosError } from 'axios';
import { currentUserAtom } from '@/atoms/auth';
import { useSetAtom } from 'jotai';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/storage-keys';

type Props = NativeStackScreenProps<RootStackParamList, 'VerifyCode'>;

export default function VerifyCodeScreen({ route, navigation }: Props) {
  const { email } = route.params;
  const setCurrentUser = useSetAtom(currentUserAtom);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterCompleteDto>({
    defaultValues: {
      email,
      verificationCode: '',
    },
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: authApi.completeRegistration,
    onSuccess: response => {
      const { accessToken, user } = response.data;
      AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      setCurrentUser(user);
      navigation.navigate('Home');
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>이메일 인증</Text>
        <Text style={styles.subtitle}>
          {email}로 전송된{'\n'}
          인증 코드를 입력해주세요
        </Text>
      </View>

      <View style={styles.form}>
        <Controller
          control={control}
          name="verificationCode"
          rules={{
            required: '인증 코드를 입력해주세요',
            pattern: {
              value: /^[A-Za-z0-9]{6}$/,
              message: '6자리 문자를 입력해주세요',
            },
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="인증 코드 6자리"
              value={value}
              onChangeText={onChange}
              error={errors.verificationCode?.message}
              autoCapitalize="none"
              maxLength={6}
            />
          )}
        />

        {error && (
          <Text style={styles.errorText}>
            {(error as AxiosError<{ message: string }>)?.response?.data?.message ||
              '인증에 실패했습니다.'}
          </Text>
        )}

        <Button onPress={handleSubmit(data => mutate(data))} loading={isPending}>
          인증하기
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
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});
