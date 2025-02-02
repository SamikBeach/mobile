import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '@/components/common/Text';
import { useQuery } from '@tanstack/react-query';
import { authorApi } from '@/apis/author';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { AuthorBooksSkeleton } from '@/components/common/Skeleton/AuthorBooksSkeleton';
import { BookItem } from '@/components/common/BookItem';

interface Props {
  authorId: number;
}

export function AuthorBooks({ authorId }: Props) {
  const { data: author } = useQuery({
    queryKey: ['author', authorId],
    queryFn: () => authorApi.getAuthorDetail(authorId),
    select: response => response.data,
  });

  const { data: books = [], isLoading } = useQuery({
    queryKey: ['author-books', authorId],
    queryFn: () => authorApi.getAllAuthorBooks(authorId),
    select: response => response.data,
  });

  if (isLoading) {
    return <AuthorBooksSkeleton />;
  }

  if (books.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{author?.nameInKor?.trim()}의 작품</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{books.length}</Text>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bookList}>
        {books.map(book => (
          <View key={book.id} style={styles.bookItem}>
            <BookItem book={book} size="small" showPublisher showPublicationDate />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray[600],
  },
  bookList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  bookItem: {
    width: 110,
  },
});
