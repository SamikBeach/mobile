import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/styles/theme';
import { UserInfo } from './UserInfo';
import { UserHistory } from './UserHistory';

interface Props {
  userId: number;
}

export function UserScreen({ userId }: Props) {
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
