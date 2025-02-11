import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/common/Text';
import { useQuery } from '@tanstack/react-query';
import { authorApi } from '@/apis/author';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { format } from 'date-fns';
import { AuthorBooksSkeleton } from '@/components/common/Skeleton';
import { BookImage } from '@/components/book/BookImage';
import Icon from 'react-native-vector-icons/Feather';

interface Props {
  authorId: number;
}

export function AuthorBooks({ authorId }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { data: books = [], isLoading } = useQuery({
    queryKey: ['author-books', authorId],
    queryFn: () => authorApi.getAllAuthorBooks(authorId),
    select: response => response.data,
  });

  const { data: author } = useQuery({
    queryKey: ['author', authorId],
    queryFn: () => authorApi.getAuthorDetail(authorId),
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
        <Text style={styles.title}>{author?.nameInKor.trim()}의 다른 책</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{books.length}</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {books.map(book => (
          <Pressable
            key={book.id}
            style={styles.bookItem}
            onPress={() => navigation.push('BookDetail', { bookId: book.id })}>
            <View style={styles.imageContainer}>
              <BookImage imageUrl={book.imageUrl} />
            </View>
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle} numberOfLines={2}>
                {book.title}
              </Text>
              <Text style={styles.bookPublisher}>
                {book.publisher}
                {book.publicationDate && (
                  <>
                    {' · '}
                    {format(new Date(book.publicationDate), 'yyyy.MM')}
                  </>
                )}
              </Text>
              <View style={styles.stats}>
                <View style={styles.statItem}>
                  <Icon name="thumbs-up" size={13} color={colors.gray[400]} />
                  <Text style={styles.statText}>{book.likeCount}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                  <Icon name="message-square" size={13} color={colors.gray[400]} />
                  <Text style={styles.statText}>{book.reviewCount}</Text>
                </View>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  badge: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray[600],
  },
  scrollContent: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  bookItem: {
    width: 120,
  },
  imageContainer: {
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
  },
  bookInfo: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[900],
    lineHeight: 20,
  },
  bookPublisher: {
    fontSize: 12,
    color: colors.gray[500],
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing['2xs'],
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: colors.gray[200],
    marginHorizontal: spacing.sm,
  },
  statText: {
    fontSize: 12,
    color: colors.gray[500],
  },
});
