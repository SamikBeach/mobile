import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/common/Text';
import { colors, spacing } from '@/styles/theme';
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
      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, activeSection === 'review' && styles.activeTab]}
          onPress={() => setActiveSection('review')}>
          <Text style={[styles.tabText, activeSection === 'review' && styles.activeTabText]}>
            리뷰
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeSection === 'books' && styles.activeTab]}
          onPress={() => setActiveSection('books')}>
          <Text style={[styles.tabText, activeSection === 'books' && styles.activeTabText]}>
            좋아한 책
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeSection === 'authors' && styles.activeTab]}
          onPress={() => setActiveSection('authors')}>
          <Text style={[styles.tabText, activeSection === 'authors' && styles.activeTabText]}>
            좋아한 작가
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    padding: spacing.sm,
    marginHorizontal: spacing.lg,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: colors.white,
  },
  tabText: {
    fontSize: 14,
    color: colors.gray[600],
    fontWeight: '400',
  },
  activeTabText: {
    color: colors.gray[900],
    fontWeight: '500',
  },
  content: {
    flex: 1,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
});
