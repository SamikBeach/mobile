import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@/screens/home/HomeScreen';
import { ReviewScreen } from '@/screens/review/ReviewScreen';

export type HomeStackParamList = {
  Home: undefined;
  Review: {
    reviewId: number;
  };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="Review"
        component={ReviewScreen}
        options={{
          headerTitle: '리뷰',
          headerBackTitle: '뒤로', // iOS에서 뒤로가기 텍스트
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
}
