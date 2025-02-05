import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, ActionSheetIOS } from 'react-native';
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

  const targetUserId = userId ?? currentUser?.id;

  if (!targetUserId) {
    return null;
  }

  const isMyProfile = currentUser?.id === targetUserId;

  const handleShowMenu = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['취소', '설정', '로그아웃'],
        cancelButtonIndex: 0,
        destructiveButtonIndex: 2,
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 1:
            navigation.navigate('Settings');
            break;
          case 2:
            logout();
            break;
        }
      },
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <UserInfo
          userId={targetUserId}
          rightElement={
            isMyProfile && (
              <TouchableOpacity onPress={handleShowMenu}>
                <Icon name="settings" size={24} color={colors.gray[600]} />
              </TouchableOpacity>
            )
          }
        />
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
});
