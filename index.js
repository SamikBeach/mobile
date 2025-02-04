/**
 * @format
 */

import 'react-native-reanimated'; // 반드시 다른 import 전에 와야 함
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';

AppRegistry.registerComponent(appName, () => App);
