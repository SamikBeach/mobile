import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, TouchableOpacity, SectionList } from 'react-native';
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
import Toast from 'react-native-toast-message';
import { currentUserAtom } from '@/atoms/auth';
import { useSetAtom } from 'jotai';
import { ActionSheet } from '@/components/common/ActionSheet/ActionSheet';

export function UserScreen() {
  const route = useRoute<RouteProp<TabParamList, 'UserTab'>>();
  const userId = route.params?.userId;
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetAtom(currentUserAtom);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [showActionSheet, setShowActionSheet] = useState(false);

  const { mutate: logout } = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      setCurrentUser(null);

      Toast.show({
        type: 'success',
        text1: '로그아웃 되었습니다.',
      });
      navigation.replace('Home');
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: '로그아웃 중 오류가 발생했습니다.',
      });
    },
  });

  const targetUserId = userId ?? currentUser?.id;

  if (!targetUserId) {
    return null;
  }

  const isMyProfile = currentUser?.id === targetUserId;

  const actions = [
    {
      text: '계정 설정',
      icon: 'settings',
      onPress: () => {
        setShowActionSheet(false);
        navigation.navigate('Settings');
      },
    },
    {
      text: '차단한 사용자 보기',
      icon: 'user-x',
      onPress: () => {
        setShowActionSheet(false);
        navigation.navigate('BlockedUsers');
      },
    },
    {
      text: '로그아웃',
      icon: 'log-out',
      onPress: () => {
        setShowActionSheet(false);
        logout();
      },
      destructive: true,
    },
  ];

  const sections = [
    {
      type: 'header',
      data: [{ userId: targetUserId, isMyProfile }],
    },
    {
      type: 'content',
      data: [{ userId: targetUserId }],
    },
  ];

  const renderItem = ({ item, section }: any) => {
    if (section.type === 'header') {
      return (
        <UserInfo
          userId={item.userId}
          rightElement={
            item.isMyProfile && (
              <TouchableOpacity
                onPress={() => setShowActionSheet(true)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Icon name="settings" size={24} color={colors.gray[600]} />
              </TouchableOpacity>
            )
          }
        />
      );
    }

    return <UserHistory userId={item.userId} />;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <SectionList
        sections={sections}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        renderSectionHeader={() => null}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.container}
      />
      <ActionSheet
        visible={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        actions={actions}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
});
