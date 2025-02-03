/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Library, User } from '@/components/icons';
import { HomeScreen } from '@/screens/home/HomeScreen';
import { UserScreen } from '@/screens/user/UserScreen';
import { TabParamList } from './types';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import BookScreen from '@/screens/book/BookScreen';
import AuthorScreen from '@/screens/author/list/AuthorScreen';
import LoginScreen from '@/screens/auth/LoginScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ReviewScreen } from '@/screens/review/ReviewScreen';
import SignUpScreen from '@/screens/auth/SignUpScreen';
import { BookDetailScreen } from '@/screens/book/BookDetailScreen';
import { AuthorDetailScreen } from '@/screens/author/AuthorDetailScreen';
import { HomeStackParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<HomeStackParamList>();

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
        {() => (
          <Stack.Navigator
            screenOptions={{
              headerTitleAlign: 'center',
              headerBackTitle: '뒤로',
            }}>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="Review"
              component={ReviewScreen}
              options={{ headerTitle: '리뷰' }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerTitle: '로그인' }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerTitle: '회원가입' }}
            />
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
        )}
      </Tab.Screen>
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
          initialParams={{ userId: currentUser.id }}
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
  );
}
