import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserScreen } from '@/screens/user/UserScreen';
import { UserStackParamList } from './types';

const Stack = createNativeStackNavigator<UserStackParamList>();

export default function UserStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerBackTitle: '뒤로',
      }}>
      <Stack.Screen
        name="User"
        component={UserScreen}
        options={{
          headerTitle: '마이페이지',
        }}
      />
    </Stack.Navigator>
  );
}
