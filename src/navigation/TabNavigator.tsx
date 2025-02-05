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
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ReviewScreen } from '@/screens/review/ReviewScreen';
import SignUpScreen from '@/screens/auth/SignUpScreen';
import { BookDetailScreen } from '@/screens/book/BookDetailScreen';
import { AuthorDetailScreen } from '@/screens/author/AuthorDetailScreen';
import { WriteReviewScreen } from '@/screens/review/WriteReviewScreen';
import { SettingsScreen } from '@/screens/settings/SettingsScreen';

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
        {() => <StackNavigator initialRouteName="Home" />}
      </Tab.Screen>
      <Tab.Screen
        name="BookTab"
        options={{
          tabBarLabel: '책',
          tabBarIcon: ({ color, size }) => <Library size={size} color={color} />,
        }}>
        {() => <StackNavigator initialRouteName="BookList" />}
      </Tab.Screen>
      <Tab.Screen
        name="AuthorTab"
        options={{
          tabBarLabel: '작가',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}>
        {() => <StackNavigator initialRouteName="AuthorList" />}
      </Tab.Screen>
      {currentUser ? (
        <Tab.Screen
          name="UserTab"
          options={{
            tabBarLabel: '마이페이지',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}>
          {() => (
            <StackNavigator initialRouteName="User" initialParams={{ userId: currentUser.id }} />
          )}
        </Tab.Screen>
      ) : (
        <Tab.Screen
          name="AuthTab"
          options={{
            tabBarLabel: '로그인',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}>
          {() => <StackNavigator initialRouteName="Login" />}
        </Tab.Screen>
      )}
    </Tab.Navigator>
  );
}

function StackNavigator({
  initialRouteName,
  initialParams,
}: {
  initialRouteName: keyof RootStackParamList;
  initialParams?: Record<string, any>;
}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerBackTitle: '뒤로',
      }}
      initialRouteName={initialRouteName}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerTitle: '홈', headerShown: false }}
      />
      <Stack.Screen
        name="BookList"
        component={BookScreen}
        options={{ headerTitle: '책', headerShown: false }}
      />
      <Stack.Screen
        name="AuthorList"
        component={AuthorScreen}
        options={{ headerTitle: '작가', headerShown: false }}
      />
      <Stack.Screen
        name="User"
        component={UserScreen}
        options={{ headerTitle: '마이페이지', headerShown: false }}
        initialParams={initialParams}
      />
      <Stack.Screen name="Review" component={ReviewScreen} options={{ headerTitle: '리뷰' }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerTitle: '로그인' }} />
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
      <Stack.Screen
        name="WriteReview"
        component={WriteReviewScreen}
        options={{ headerTitle: '리뷰 작성' }}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerTitle: '설정' }} />
    </Stack.Navigator>
  );
}
