import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthorScreen from '@/screens/author/list/AuthorScreen';
import AuthorDetailScreen from '@/screens/author/detail/AuthorDetailScreen';
import type { AuthorStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthorStackParamList>();

export default function AuthorStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AuthorList"
        component={AuthorScreen}
        options={{ headerShown: false, title: '작가 목록' }}
      />
      <Stack.Screen
        name="AuthorDetail"
        component={AuthorDetailScreen}
        options={{ title: '작가 상세' }}
      />
    </Stack.Navigator>
  );
}
