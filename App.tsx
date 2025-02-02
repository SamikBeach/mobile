/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryProvider } from '@/providers/QueryProvider';
import { RootStack } from '@/navigation/RootStack';
export default function App() {
  return (
    <QueryProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </QueryProvider>
  );
}
