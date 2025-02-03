import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserInfoScreen from '../screens/auth/UserInfoScreen';
import LoginScreen from '@/screens/auth/LoginScreen';
import SignUpScreen from '@/screens/auth/SignUpScreen';
import VerifyCodeScreen from '@/screens/auth/VerifyCodeScreen';
import { ResetPasswordScreen } from '@/screens/auth/ResetPasswordScreen';

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  UserInfo: { email: string };
  VerifyCode: { email: string };
  ResetPassword: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerBackTitle: '뒤로',
      }}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerTitle: '로그인',
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          headerTitle: '회원가입',
        }}
      />
      <Stack.Screen name="UserInfo" component={UserInfoScreen} />
      <Stack.Screen
        name="VerifyCode"
        component={VerifyCodeScreen}
        options={{
          headerTitle: '이메일 인증',
        }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{
          headerTitle: '비밀번호 재설정',
        }}
      />
    </Stack.Navigator>
  );
}
