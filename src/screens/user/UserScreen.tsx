import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { colors } from '@/styles/theme';
import { UserInfo } from './UserInfo';
import { UserHistory } from './UserHistory';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { TabParamList } from '@/navigation/types';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import Icon from 'react-native-vector-icons/Feather';
import { authApi } from '@/apis/auth';
import { useMutation } from '@tanstack/react-query';

export function UserScreen() {
  const route = useRoute<RouteProp<TabParamList, 'UserTab'>>();
  const { userId } = route.params;
  const currentUser = useCurrentUser();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { mutate: logout } = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      navigation.navigate('Home');
    },
  });

  // userId가 없으면 현재 로그인한 유저의 ID를 사용
  const targetUserId = userId ?? currentUser?.id;

  // 유저 ID가 없는 경우 (로그인하지 않은 상태에서 userId도 없는 경우) 처리
  if (!targetUserId) {
    return null;
  }

  const isMyProfile = currentUser?.id === targetUserId;

  const handleLogout = async () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {isMyProfile && (
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('User', { userId: targetUserId })}>
              <Icon name="user" size={20} color={colors.gray[600]} />
              <Text style={styles.menuText}>내 프로필</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Settings')}>
              <Icon name="settings" size={20} color={colors.gray[600]} />
              <Text style={styles.menuText}>설정</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Icon name="log-out" size={20} color={colors.gray[600]} />
              <Text style={styles.menuText}>로그아웃</Text>
            </TouchableOpacity>
          </View>
        )}

        <UserInfo userId={targetUserId} />
        <UserHistory userId={targetUserId} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
  },
  menuText: {
    fontSize: 14,
    color: colors.gray[700],
  },
});
