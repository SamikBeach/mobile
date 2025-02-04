/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Library, User } from '@/components/icons';
import { HomeScreen } from '@/screens/home/HomeScreen';
import { UserScreen } from '@/screens/user/UserScreen';
import { RootStackParamList, TabParamList } from './types';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import BookScreen from '@/screens/book/BookScreen';
import AuthorScreen from '@/screens/author/list/AuthorScreen';
import LoginScreen from '@/screens/auth/LoginScreen';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { ReviewScreen } from '@/screens/review/ReviewScreen';
import SignUpScreen from '@/screens/auth/SignUpScreen';
import { BookDetailScreen } from '@/screens/book/BookDetailScreen';
import { AuthorDetailScreen } from '@/screens/author/AuthorDetailScreen';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function TabNavigator() {
  const currentUser = useCurrentUser();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#666',
      }}>
      <Tab.Screen
        name="HomeTab"
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}>
        {() => <StackNavigator initialRouteName="Home" initialComponent={HomeScreen} />}
      </Tab.Screen>
      <Tab.Screen
        name="BookTab"
        options={{
          tabBarLabel: '책',
          tabBarIcon: ({ color, size }) => <Library size={size} color={color} />,
        }}>
        {() => <StackNavigator initialRouteName="BookList" initialComponent={BookScreen} />}
      </Tab.Screen>
      <Tab.Screen
        name="AuthorTab"
        options={{
          tabBarLabel: '작가',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}>
        {() => <StackNavigator initialRouteName="AuthorList" initialComponent={AuthorScreen} />}
      </Tab.Screen>
      {currentUser ? (
        <Tab.Screen
          name="UserTab"
          options={{
            tabBarLabel: '마이페이지',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}>
          {() => (
            <StackNavigator
              initialRouteName="User"
              initialComponent={UserScreen}
              initialParams={{ userId: currentUser.id }}
            />
          )}
        </Tab.Screen>
      ) : (
        <Tab.Screen
          name="AuthTab"
          options={{
            tabBarLabel: '로그인',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}>
          {() => <StackNavigator initialRouteName="Login" initialComponent={LoginScreen} />}
        </Tab.Screen>
      )}
    </Tab.Navigator>
  );
}

interface StackNavigatorProps {
  initialRouteName: keyof RootStackParamList;
  initialComponent: React.ComponentType<any>;
  options?: NativeStackNavigationOptions;
  initialParams?: Record<string, any>;
}

function StackNavigator({
  initialRouteName,
  initialComponent,
  options,
  initialParams,
}: StackNavigatorProps) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerBackTitle: '뒤로',
      }}>
      <Stack.Screen
        name={initialRouteName}
        component={initialComponent}
        options={{ headerShown: false, ...options }}
        initialParams={initialParams}
      />
      <Stack.Screen name="Review" component={ReviewScreen} options={{ headerTitle: '리뷰' }} />
      {initialRouteName !== 'Login' && (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerTitle: '로그인' }} />
      )}
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerTitle: '회원가입' }} />
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
    </Stack.Navigator>
  );
}
