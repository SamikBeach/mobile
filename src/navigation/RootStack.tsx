import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { HomeScreen } from '@/screens/home/HomeScreen';
import { ReviewScreen } from '@/screens/review/ReviewScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '홈',
        }}
      />
      <Stack.Screen
        name="Review"
        component={ReviewScreen}
        options={{
          title: '리뷰',
        }}
      />
    </Stack.Navigator>
  );
}
