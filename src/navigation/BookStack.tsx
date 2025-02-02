import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BookDetailScreen } from '@/screens/book/BookDetailScreen';
import BookScreen from '@/screens/book/BookScreen';
import type { BookStackParamList } from './types';

const Stack = createNativeStackNavigator<BookStackParamList>();

export default function BookStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="BookList" component={BookScreen} />
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
