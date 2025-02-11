import React from 'react';
import { View, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { Text } from '@/components/common/Text';
import { useQuery } from '@tanstack/react-query';
import { bookApi } from '@/apis/book';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { format } from 'date-fns';
import { RelativeBooksSkeleton } from '@/components/common/Skeleton';

interface Props {
  bookId: number;
}

export function RelativeBooks({ bookId }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { data: books = [], isLoading } = useQuery({
    queryKey: ['relative-books', bookId],
    queryFn: () => bookApi.getAllRelatedBooks(bookId),
    select: response => response.data,
  });

  if (isLoading) {
    return <RelativeBooksSkeleton />;
  }

  if (books.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>다른 번역본</Text>
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
              <Image
                source={{ uri: book.imageUrl ?? undefined }}
                style={styles.bookImage}
                resizeMode="cover"
              />
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
    gap: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
    paddingHorizontal: spacing.lg,
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
  bookImage: {
    width: 120,
    height: 180,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
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
});
