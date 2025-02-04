import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/styles/theme';
import { UserInfo } from './UserInfo';
import { UserHistory } from './UserHistory';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UserStackParamList } from '@/navigation/types';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { TabParamList } from '@/navigation/types';
import { useRoute, RouteProp } from '@react-navigation/native';

export function UserScreen() {
  const route = useRoute<RouteProp<TabParamList, 'UserTab'>>();
  const { userId } = route.params;
  const currentUser = useCurrentUser();

  // userId가 없으면 현재 로그인한 유저의 ID를 사용
  const targetUserId = userId ?? currentUser?.id;

  // 유저 ID가 없는 경우 (로그인하지 않은 상태에서 userId도 없는 경우) 처리
  if (!targetUserId) {
    return null;
  }

  return (
    <View style={styles.container}>
      <UserInfo userId={targetUserId} />
      <UserHistory userId={targetUserId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
