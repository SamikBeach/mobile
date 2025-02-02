import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import AuthStack from './AuthStack';
import { useAuth } from '@/hooks/useAuth';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { currentUser } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        {!currentUser && (
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="Auth" component={AuthStack} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
} 