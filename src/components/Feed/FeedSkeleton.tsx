import React from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing, colors, borderRadius } from '@/styles/theme';
import { Skeleton } from '../common/Skeleton/Skeleton';

export function FeedSkeleton() {
  return (
    <View style={styles.container}>
      {Array.from({ length: 3 }).map((_, index) => (
        <View key={index} style={styles.feedItem}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <Skeleton style={styles.avatar} />
              <Skeleton style={styles.date} />
            </View>
          </View>

          <View style={styles.mainContent}>
            {/* Book Section */}
            <View style={styles.bookSection}>
              <Skeleton style={styles.bookImage} />
              <View style={styles.bookInfo}>
                <Skeleton style={styles.bookTitle} />
                <Skeleton style={styles.bookAuthor} />
                <Skeleton style={styles.bookPublisher} />
              </View>
            </View>

            {/* Review Section */}
            <View style={styles.reviewSection}>
              <View style={styles.reviewContent}>
                <Skeleton style={styles.reviewTitle} />
                <View style={styles.reviewTextContainer}>
                  <Skeleton style={styles.reviewText} />
                  <Skeleton style={styles.reviewText} />
                  <Skeleton style={[styles.reviewText, { width: '80%' }]} />
                </View>
              </View>

              <View style={styles.actions}>
                <Skeleton style={styles.likeButton} />
                <Skeleton style={styles.commentButton} />
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  feedItem: {
    padding: 14,
    backgroundColor: colors.white,
  },
  header: {
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
  },
  date: {
    width: 70,
    height: 14,
    borderRadius: borderRadius.sm,
  },
  mainContent: {
    flexDirection: 'row',
    gap: 20,
  },
  bookSection: {
    width: 120,
    gap: 8,
  },
  bookImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  bookInfo: {
    gap: 4,
  },
  bookTitle: {
    height: 18,
    width: '100%',
    borderRadius: borderRadius.sm,
  },
  bookAuthor: {
    height: 14,
    width: '80%',
    borderRadius: borderRadius.sm,
  },
  bookPublisher: {
    height: 14,
    width: '60%',
    borderRadius: borderRadius.sm,
    marginTop: 2,
  },
  reviewSection: {
    flex: 1,
    justifyContent: 'space-between',
  },
  reviewContent: {
    flex: 1,
  },
  reviewTitle: {
    height: 20,
    width: '70%',
    borderRadius: borderRadius.sm,
    marginBottom: 8,
  },
  reviewTextContainer: {
    gap: spacing.sm,
  },
  reviewText: {
    height: 16,
    width: '100%',
    borderRadius: borderRadius.sm,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
  likeButton: {
    width: 50,
    height: 28,
    borderRadius: borderRadius.full,
  },
  commentButton: {
    width: 50,
    height: 28,
    borderRadius: borderRadius.full,
  },
});
