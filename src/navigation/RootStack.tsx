import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import TabNavigator from './TabNavigator';
import AuthStack from './AuthStack';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthStack}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
