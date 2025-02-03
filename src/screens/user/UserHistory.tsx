import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/common/Text';
import { colors, spacing, shadows } from '@/styles/theme';
import { ReviewList } from './ReviewList';
import { BookList } from './BookList';
import { AuthorList } from './AuthorList';

interface Props {
  userId: number;
}

export function UserHistory({ userId }: Props) {
  const [activeSection, setActiveSection] = useState<'review' | 'books' | 'authors'>('review');

  const renderContent = () => {
    switch (activeSection) {
      case 'review':
        return <ReviewList userId={userId} />;
      case 'books':
        return <BookList userId={userId} />;
      case 'authors':
        return <AuthorList userId={userId} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.stats}>
        <Pressable
          style={[styles.statItem, activeSection === 'review' && styles.activeStatItem]}
          onPress={() => setActiveSection('review')}>
          <Text style={styles.statValue}>0</Text>
          <Text style={[styles.statLabel, activeSection === 'review' && styles.activeStatLabel]}>
            리뷰
          </Text>
        </Pressable>
        <View style={styles.statDivider} />
        <Pressable
          style={[styles.statItem, activeSection === 'books' && styles.activeStatItem]}
          onPress={() => setActiveSection('books')}>
          <Text style={styles.statValue}>0</Text>
          <Text style={[styles.statLabel, activeSection === 'books' && styles.activeStatLabel]}>
            좋아요한 책
          </Text>
        </Pressable>
        <View style={styles.statDivider} />
        <Pressable
          style={[styles.statItem, activeSection === 'authors' && styles.activeStatItem]}
          onPress={() => setActiveSection('authors')}>
          <Text style={styles.statValue}>0</Text>
          <Text style={[styles.statLabel, activeSection === 'authors' && styles.activeStatLabel]}>
            좋아요한 작가
          </Text>
        </Pressable>
      </View>
      <View style={styles.content}>{renderContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    padding: spacing.sm,
    marginHorizontal: spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  activeStatItem: {
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: colors.gray[200],
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  statLabel: {
    fontSize: 13,
    color: colors.gray[600],
    fontWeight: '400',
  },
  activeStatLabel: {
    color: colors.gray[900],
    fontWeight: '500',
  },
  content: {
    flex: 1,
    marginTop: spacing.lg,
  },
});
