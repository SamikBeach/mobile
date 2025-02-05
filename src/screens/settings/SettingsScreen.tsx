import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors } from '@/styles/theme';
import { SettingsCard } from './components/SettingsCard';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { DeleteAccountModal } from './components/DeleteAccountModal';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { userApi } from '@/apis/user';
import { useMutation } from '@tanstack/react-query';
import { RootStackParamList } from '@/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export function SettingsScreen() {
  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);
  const [isDeleteAccountVisible, setIsDeleteAccountVisible] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { mutate: changePassword, isPending: isChangingPassword } = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      userApi.changePassword(data),
    onSuccess: () => {
      setIsChangePasswordVisible(false);
    },
  });

  const { mutate: deleteAccount, isPending: isDeletingAccount } = useMutation({
    mutationFn: () => userApi.deleteAccount(),
    onSuccess: () => {
      navigation.navigate('Home');
    },
  });

  const handleChangePassword = (data: { currentPassword: string; newPassword: string }) => {
    changePassword(data);
  };

  const handleDeleteAccount = () => {
    deleteAccount();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
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

        <ChangePasswordModal
          visible={isChangePasswordVisible}
          onClose={() => setIsChangePasswordVisible(false)}
          onSubmit={handleChangePassword}
          isLoading={isChangingPassword}
        />

        <DeleteAccountModal
          visible={isDeleteAccountVisible}
          onClose={() => setIsDeleteAccountVisible(false)}
          onConfirm={handleDeleteAccount}
          isLoading={isDeletingAccount}
        />
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
    padding: 16,
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
