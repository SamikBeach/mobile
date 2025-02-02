import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BookScreen from '@/screens/book/BookScreen';

const Stack = createNativeStackNavigator();

export default function BookStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Book" component={BookScreen} />
    </Stack.Navigator>
  );
}
