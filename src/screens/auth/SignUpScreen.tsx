/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-catch-shadow */
import React from 'react';
import { View, StyleSheet, SafeAreaView, Image, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/apis/auth';
import { Button, Input, Text } from '@/components/common';
import { colors } from '@/styles/theme';
import { useSetAtom } from 'jotai';
import { currentUserAtom } from '@/atoms/auth';
import Toast from 'react-native-toast-message';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import type { EmailVerificationDto } from '@/types/auth';
import { AxiosError } from 'axios';
import appleAuth from '@invertase/react-native-apple-authentication';

GoogleSignin.configure(
  Platform.select({
    ios: {
      iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
    },
    android: {
      webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
    },
  }),
);

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

export default function SignUpScreen({ navigation }: Props) {
  const setCurrentUser = useSetAtom(currentUserAtom);

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
      navigation.navigate('InitiateRegistration', { email: control._getWatch('email') });
    },
  });

  const { mutate: googleLogin, isPending: isGoogleLoginPending } = useMutation({
    mutationFn: authApi.googleLogin,
    onSuccess: response => {
      setCurrentUser(response.data.user);
      Toast.show({
        type: 'success',
        text1: '구글 계정으로 로그인되었습니다.',
      });
      navigation.navigate('Home');
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: '구글 로그인에 실패했습니다.',
        text2: error.response?.data?.message || '알 수 없는 오류가 발생했습니다.',
      });
    },
  });

  const { mutate: appleLogin, isPending: isAppleLoginPending } = useMutation({
    mutationFn: authApi.appleLogin,
    onSuccess: response => {
      setCurrentUser(response.data.user);
      Toast.show({
        type: 'success',
        text1: '애플 계정으로 로그인되었습니다.',
      });
      navigation.navigate('Home');
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: '애플 로그인에 실패했습니다.',
        text2: error.response?.data?.message || '알 수 없는 오류가 발생했습니다.',
      });
    },
  });

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const result = await GoogleSignin.signIn();

      if (result.data?.idToken) {
        googleLogin({
          code: result.data.idToken,
          clientType: Platform.OS === 'ios' ? 'ios' : 'android',
        });
      }
    } catch (error: any) {
      console.error('Google Sign In Error:', error);

      let errorMessage = error.message;
      if (error.code === 12500) {
        errorMessage = '구글 로그인 설정이 올바르지 않습니다.';
      }

      Toast.show({
        type: 'error',
        text1: '구글 로그인에 실패했습니다.',
        text2: errorMessage,
      });
    }
  };

  const handleAppleLogin = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const { identityToken } = appleAuthRequestResponse;

      if (identityToken) {
        appleLogin({
          idToken: identityToken,
          clientType: Platform.OS === 'ios' ? 'ios' : 'android',
        });
      }
    } catch (error: any) {
      console.error('Apple Sign In Error:', error);

      Toast.show({
        type: 'error',
        text1: '애플 로그인에 실패했습니다.',
        text2: error.message,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
              {(error as AxiosError<{ message: string }>)?.response?.data?.message ||
                '이메일 확인에 실패했습니다.'}
            </Text>
          )}

          <Button onPress={handleSubmit(data => mutate(data))} loading={isPending}>
            이메일로 회원가입
          </Button>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>또는</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            variant="outline"
            onPress={handleGoogleLogin}
            loading={isGoogleLoginPending}
            style={styles.googleButtonContainer}>
            <View style={styles.googleButton}>
              <Image source={require('@/assets/images/google.png')} style={styles.googleIcon} />
              <Text style={styles.googleText}>구글 계정으로 회원가입</Text>
            </View>
          </Button>

          <Button
            variant="outline"
            onPress={handleAppleLogin}
            loading={isAppleLoginPending}
            style={styles.appleButtonContainer}>
            <View style={styles.appleButton}>
              <Image source={require('@/assets/images/apple.png')} style={styles.appleIcon} />
              <Text style={styles.appleText}>애플 계정으로 회원가입</Text>
            </View>
          </Button>

          <View style={styles.links}>
            <Text style={styles.linkText}>이미 계정이 있으신가요? </Text>{' '}
            <Button
              variant="text"
              onPress={() => navigation.navigate('Login')}
              style={styles.linkButton}>
              <Text style={styles.linkText}>로그인</Text>
            </Button>
          </View>

          <View style={styles.links}>
            <Button
              variant="text"
              onPress={() => navigation.navigate('Terms', { onAgree: () => {} })}
              style={styles.linkButton}>
              <Text style={styles.linkText}>이용약관</Text>
            </Button>
            <View style={styles.divider} />
            <Button
              variant="text"
              onPress={() => navigation.navigate('Privacy')}
              style={styles.linkButton}>
              <Text style={styles.linkText}>개인정보처리방침</Text>
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  form: {
    gap: 8,
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray[200],
  },
  dividerText: {
    marginHorizontal: 16,
    color: colors.gray[500],
    fontSize: 13,
  },
  googleButtonContainer: {
    borderColor: colors.gray[200],
    backgroundColor: colors.white,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  googleIcon: {
    width: 18,
    height: 18,
  },
  googleText: {
    color: '#3C4043',
    fontSize: 14,
    fontWeight: '500',
  },
  appleButtonContainer: {
    borderColor: colors.gray[200],
    backgroundColor: colors.white,
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  appleIcon: {
    width: 18,
    height: 18,
  },
  appleText: {
    color: '#3C4043',
    fontSize: 14,
    fontWeight: '500',
  },
});
