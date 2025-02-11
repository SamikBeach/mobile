import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/styles/theme';
import { Skeleton } from '../common/Skeleton/Skeleton';

export function CommentSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Skeleton style={styles.avatar} />
          <Skeleton style={styles.date} />
        </View>
      </View>

      <Skeleton style={styles.content} />

      <View style={styles.actions}>
        <Skeleton style={styles.action} />
        <Skeleton style={styles.action} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  date: {
    width: 80,
    height: 14,
    borderRadius: 4,
  },
  content: {
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.gray[100],
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 4,
  },
  action: {
    width: 60,
    height: 20,
    borderRadius: 4,
  },
});
