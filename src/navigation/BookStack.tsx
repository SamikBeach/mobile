import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BookScreen from '@/screens/book/list/BookScreen';
import type { BookStackParamList } from './types';
import { BookDetailScreen } from '@/screens/book/BookDetailScreen';

const Stack = createNativeStackNavigator<BookStackParamList>();

export default function BookStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BookList" component={BookScreen} />
    </Stack.Navigator>
  );
}
