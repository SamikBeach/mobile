import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';
import { colors, spacing } from '@/styles/theme';

interface Props {
  rightElement?: React.ReactNode;
}

export function UserInfoSkeleton({ rightElement }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>{rightElement}</View>
      <View style={styles.profileSection}>
        <View style={styles.avatarWrapper}>
          <Skeleton style={styles.avatar} />
        </View>
        <View style={styles.userInfo}>
          <Skeleton style={styles.nickname} />
          <Skeleton style={styles.email} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  header: {
    height: 52,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.lg,
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  userInfo: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  nickname: {
    width: 120,
    height: 28,
    borderRadius: 4,
  },
  email: {
    width: 180,
    height: 16,
    borderRadius: 4,
  },
}); 