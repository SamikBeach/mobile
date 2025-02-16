import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Text } from '@/components/common';
import { colors, spacing } from '@/styles/theme';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/apis/user';
import { UserAvatar } from '@/components/common/UserAvatar';
import Toast from 'react-native-toast-message';
import type { User, UserBase } from '@/types/user';

export function BlockedUsersScreen() {
  const queryClient = useQueryClient();

  const { data: blockedUsers = [], isLoading } = useQuery({
    queryKey: ['blockedUsers'],
    queryFn: userApi.getBlockedUsers,
    select: data => data.data,
  });

  const { mutate: unblockUser } = useMutation({
    mutationFn: (userId: number) => userApi.unblockUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockedUsers'] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review'] });

      Toast.show({
        type: 'success',
        text1: '차단이 해제되었습니다.',
      });
    },
  });

  const handleUnblock = (userId: number, nickname: string) => {
    Alert.alert('차단 해제', `${nickname}님을 차단 해제하시겠습니까?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '해제',
        onPress: () => unblockUser(userId),
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  if (!blockedUsers.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>차단한 사용자가 없습니다.</Text>
      </View>
    );
  }

  return (
    <FlatList<User>
      data={blockedUsers}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => {
        const userForAvatar: UserBase = {
          id: item.id,
          email: '',
          nickname: item.nickname,
          imageUrl: item.imageUrl,
        };

        return (
          <View style={styles.item}>
            <View style={styles.userInfo}>
              <UserAvatar size="md" user={userForAvatar} />
              <View style={styles.userText}>
                <Text style={styles.nickname}>{item.nickname}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.unblockButton}
              onPress={() => handleUnblock(item.id, item.nickname)}>
              <Text style={styles.unblockText}>차단 해제</Text>
            </TouchableOpacity>
          </View>
        );
      }}
      keyExtractor={item => item.id.toString()}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    height: '100%',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  userText: {
    gap: 2,
  },
  nickname: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
  },
  unblockButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.gray[100],
    borderRadius: 6,
  },
  unblockText: {
    fontSize: 14,
    color: colors.gray[700],
  },
  emptyText: {
    color: colors.gray[500],
  },
});
