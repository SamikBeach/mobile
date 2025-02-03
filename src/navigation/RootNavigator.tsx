import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import { RootStackParamList } from './types';
import { UserScreen } from '@/screens/user/UserScreen';
import { BookDetailScreen } from '@/screens/book/BookDetailScreen';
import { AuthorDetailScreen } from '@/screens/author/AuthorDetailScreen';
import { ReviewScreen } from '@/screens/review/ReviewScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerBackTitle: '뒤로',
        }}>
        <Stack.Screen name="Tab" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen
          name="Review"
          component={ReviewScreen}
          options={{
            headerTitle: '리뷰',
          }}
        />
        <Stack.Screen
          name="User"
          component={UserScreen}
          options={{
            headerTitle: '프로필',
          }}
        />
        <Stack.Screen
          name="BookDetail"
          component={BookDetailScreen}
          options={{
            headerTitle: '도서 상세',
          }}
        />
        <Stack.Screen
          name="AuthorDetail"
          component={AuthorDetailScreen}
          options={{
            headerTitle: '작가 상세',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
