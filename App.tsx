/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { QueryProvider } from '@/providers/QueryProvider';
import { HomeScreen } from './src/screens/HomeScreen';

function App(): React.JSX.Element {
  return (
    <QueryProvider>
      <HomeScreen />
    </QueryProvider>
  );
}

export default App;
