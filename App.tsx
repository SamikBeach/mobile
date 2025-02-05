/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Initializer from '@/components/Initializer';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/constants/toast';
import RootNavigator from '@/navigation/RootNavigator';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <SafeAreaProvider>
          <Initializer />
          <RootNavigator />
          <Toast config={toastConfig} />
        </SafeAreaProvider>
      </JotaiProvider>
    </QueryClientProvider>
  );
}
