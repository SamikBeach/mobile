/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { QueryProvider } from '@/providers/QueryProvider';
import { RootStack } from '@/navigation/RootStack';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <QueryProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </QueryProvider>
  );
}
