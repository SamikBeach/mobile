import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Skeleton } from '@/components/common/Skeleton';
import { colors } from '@/styles/theme';

export function ReviewHeaderSkeleton() {
  return (
    <>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Skeleton style={{ width: 200, height: 28 }} />
          <View style={styles.bookCard}>
            <Skeleton style={{ width: 25, height: 35, borderRadius: 2 }} />
            <View style={styles.bookInfo}>
              <Skeleton style={{ width: 120, height: 14, marginTop: 8 }} />
              <Skeleton style={{ width: 100, height: 13 }} />
            </View>
          </View>
        </View>

        <View style={styles.userInfo}>
          <Skeleton style={{ width: 24, height: 24, borderRadius: 12 }} />
          <Skeleton style={{ width: 60, height: 14, marginLeft: 8 }} />
          <Text style={styles.dot}>·</Text>
          <Skeleton style={{ width: 120, height: 14 }} />
        </View>
      </View>

      <View style={styles.reviewContent}>
        <Skeleton style={{ width: '100%', height: 120 }} />
      </View>

      <View style={styles.actions}>
        <Skeleton style={{ width: 80, height: 32, borderRadius: 16 }} />
        <Skeleton style={{ width: 80, height: 32, borderRadius: 16 }} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 10,
    marginBottom: 32,
  },
  titleContainer: {
    gap: 10,
  },
  bookCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.gray[50],
    borderRadius: 8,
    paddingRight: 8,
    paddingLeft: 8,
    alignSelf: 'flex-start',
  },
  bookInfo: {
    gap: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    color: colors.gray[300],
  },
  reviewContent: {
    marginBottom: 32,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
});
