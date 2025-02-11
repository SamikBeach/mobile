import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { colors } from '@/styles/theme';
import { SettingsCard } from './components/SettingsCard';
import { ChangePasswordSheet } from './components/ChangePasswordSheet';
import { DeleteAccountSheet } from './components/DeleteAccountSheet';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { userApi } from '@/apis/user';
import { useMutation } from '@tanstack/react-query';
import { RootStackParamList } from '@/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

export function SettingsScreen() {
  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);
  const [isDeleteAccountVisible, setIsDeleteAccountVisible] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { mutate: changePassword, isPending: isChangingPassword } = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      userApi.changePassword(data),
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: '비밀번호가 변경되었습니다.',
      });
      setIsChangePasswordVisible(false);
      navigation.goBack();
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: '비밀번호 변경 중 오류가 발생했습니다.',
      });
    },
  });

  const { mutate: deleteAccount, isPending: isDeletingAccount } = useMutation({
    mutationFn: () => userApi.deleteAccount(),
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: '계정이 삭제되었습니다.',
      });
      navigation.navigate('Home');
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: '계정 삭제 중 오류가 발생했습니다.',
      });
    },
  });

  const handleChangePassword = (data: { currentPassword: string; newPassword: string }) => {
    changePassword(data);
  };

  const handleDeleteAccount = () => {
    Alert.alert('계정 삭제', '정말 계정을 삭제하시겠습니까?\n삭제된 계정은 복구할 수 없습니다.', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => deleteAccount(),
      },
    ]);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>계정 설정</Text>
        <View style={styles.cardContainer}>
          <SettingsCard
            icon={<Icon name="key" size={20} color={colors.gray[500]} />}
            title="비밀번호 변경"
            description="안전한 계정 관리를 위해 비밀번호를 변경할 수 있습니다."
            buttonText="비밀번호 변경"
            onPress={() => setIsChangePasswordVisible(true)}
          />

          <SettingsCard
            icon={<Icon name="user-x" size={20} color={colors.red[500]} />}
            title="계정 삭제"
            description="계정을 삭제하면 정보가 영구적으로 삭제돼요."
            buttonText="계정 삭제"
            variant="destructive"
            onPress={() => setIsDeleteAccountVisible(true)}
          />
        </View>
      </ScrollView>

      <ChangePasswordSheet
        visible={isChangePasswordVisible}
        onClose={() => setIsChangePasswordVisible(false)}
        onSubmit={handleChangePassword}
        isLoading={isChangingPassword}
      />

      <DeleteAccountSheet
        visible={isDeleteAccountVisible}
        onClose={() => setIsDeleteAccountVisible(false)}
        onConfirm={handleDeleteAccount}
        isLoading={isDeletingAccount}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  cardContainer: {
    gap: 16,
  },
});
