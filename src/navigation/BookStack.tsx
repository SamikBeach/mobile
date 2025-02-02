import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BookScreen from '@/screens/book/list/BookScreen';
import type { BookStackParamList } from './types';
import { BookDetailScreen } from '@/screens/book/BookDetailScreen';

const Stack = createNativeStackNavigator<BookStackParamList>();

export default function BookStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="BookList"
        component={BookScreen}
        options={{ headerShown: false, title: '도서 목록' }}
      />
      <Stack.Screen
        name="BookDetail"
        component={BookDetailScreen}
        options={{
          headerShown: true,
          title: '도서 상세',
        }}
      />
    </Stack.Navigator>
  );
}
