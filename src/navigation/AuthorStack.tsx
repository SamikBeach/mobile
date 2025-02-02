import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthorScreen from '@/screens/author/AuthorScreen';

const Stack = createNativeStackNavigator();

export default function AuthorStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Author" component={AuthorScreen} />
    </Stack.Navigator>
  );
}
