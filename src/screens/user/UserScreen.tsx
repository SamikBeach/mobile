import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/styles/theme';
import { UserInfo } from './UserInfo';
import { UserHistory } from './UserHistory';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TabParamList } from '@/navigation/TabNavigator';

type Props = NativeStackScreenProps<TabParamList, 'UserTab'>;

export function UserScreen({ route }: Props) {
  const { userId } = route.params;

  return (
    <View style={styles.container}>
      <UserInfo userId={userId} />
      <UserHistory userId={userId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
