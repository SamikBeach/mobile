/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';
import RootNavigator from '@/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <SafeAreaProvider>
          <RootNavigator />
        </SafeAreaProvider>
      </JotaiProvider>
    </QueryClientProvider>
  );
}
