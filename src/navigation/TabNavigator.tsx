/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Library, User } from '@/components/icons';
import { HomeScreen } from '@/screens/home/HomeScreen';
import { UserScreen } from '@/screens/user/UserScreen';
import { RootStackParamList, TabParamList } from './types';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import BookScreen from '@/screens/book/BookScreen';
import AuthorScreen from '@/screens/author/list/AuthorScreen';
import LoginScreen from '@/screens/auth/LoginScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ReviewScreen } from '@/screens/review/ReviewScreen';
import SignUpScreen from '@/screens/auth/SignUpScreen';
import { BookDetailScreen } from '@/screens/book/BookDetailScreen';
import { AuthorDetailScreen } from '@/screens/author/AuthorDetailScreen';
import { WriteReviewScreen } from '@/screens/review/WriteReviewScreen';
import { SettingsScreen } from '@/screens/settings/SettingsScreen';
import { ResetPasswordScreen } from '@/screens/auth/ResetPasswordScreen';
import InitiateRegistrationScreen from '@/screens/auth/InitiateRegistrationScreen';
import VerifyCodeScreen from '@/screens/auth/VerifyCodeScreen';
import RequestResetPasswordScreen from '@/screens/auth/RequestResetPasswordScreen';
import { TermsScreen } from '@/screens/auth/TermsScreen';
import { PrivacyScreen } from '@/screens/auth/PrivacyScreen';
import { Logo } from '@/components/common/Logo';
import Icon from 'react-native-vector-icons/Feather';
import { TouchableOpacity, View } from 'react-native';
import { SearchModal } from '@/components/common/Search/SearchModal';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerBackTitle: '뒤로',
      }}>
      <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="BookDetail"
        component={BookDetailScreen}
        options={{ headerTitle: '도서 상세' }}
      />
      <Stack.Screen
        name="AuthorDetail"
        component={AuthorDetailScreen}
        options={{ headerTitle: '작가 상세' }}
      />
      <Stack.Screen name="Review" component={ReviewScreen} options={{ headerTitle: '리뷰' }} />
      <Stack.Screen
        name="WriteReview"
        component={WriteReviewScreen}
        options={{ headerTitle: '리뷰 작성' }}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerTitle: '설정' }} />
      <Stack.Screen name="Terms" component={TermsScreen} options={{ headerTitle: '이용약관' }} />
      <Stack.Screen
        name="Privacy"
        component={PrivacyScreen}
        options={{ headerTitle: '개인정보처리방침' }}
      />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerTitle: '로그인' }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerTitle: '회원가입' }} />
      <Stack.Screen
        name="RequestResetPassword"
        component={RequestResetPasswordScreen}
        options={{ headerTitle: '비밀번호 재설정' }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{ headerTitle: '비밀번호 변경' }}
      />
      <Stack.Screen
        name="InitiateRegistration"
        component={InitiateRegistrationScreen}
        options={{ headerTitle: '회원정보 입력' }}
      />
      <Stack.Screen
        name="VerifyCode"
        component={VerifyCodeScreen}
        options={{ headerTitle: '이메일 인증' }}
      />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  const currentUser = useCurrentUser();
  const [searchVisible, setSearchVisible] = useState(false);

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#666',
        }}>
        <Tab.Screen
          name="HomeTab"
          component={HomeScreen}
          options={{
            headerShown: true,
            tabBarLabel: '홈',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
            headerLeft: () => (
              <View style={{ paddingLeft: 20 }}>
                <Logo size="sm" />
              </View>
            ),
            headerTitle: '',
            headerRight: () => (
              <View style={{ paddingRight: 20 }}>
                <TouchableOpacity onPress={() => setSearchVisible(true)}>
                  <Icon name="search" size={24} color="#000" />
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="BookTab"
          component={BookScreen}
          options={{
            tabBarLabel: '책',
            tabBarIcon: ({ color, size }) => <Library size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="AuthorTab"
          component={AuthorScreen}
          options={{
            tabBarLabel: '작가',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
        {currentUser ? (
          <Tab.Screen
            name="UserTab"
            component={UserScreen}
            options={{
              tabBarLabel: '마이페이지',
              tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
            }}
          />
        ) : (
          <Tab.Screen
            name="AuthTab"
            component={LoginScreen}
            options={{
              tabBarLabel: '로그인',
              tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
            }}
          />
        )}
      </Tab.Navigator>
      <SearchModal visible={searchVisible} onClose={() => setSearchVisible(false)} />
    </>
  );
}
