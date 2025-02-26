import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, FlatList } from 'react-native';
import { Text } from '@/components/common/Text';
import { useQuery } from '@tanstack/react-query';
import { bookApi } from '@/apis/book';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { format } from 'date-fns';
import { RelativeBooksSkeleton } from '@/components/common/Skeleton';
import { BookImage } from '@/components/book/BookImage';
import Icon from 'react-native-vector-icons/Feather';

interface Props {
  bookId: number;
}

export function RelativeBooks({ bookId }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isExpanded, setIsExpanded] = useState(false);

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

  const renderBookItem = (book: any) => (
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
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>다른 번역본</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{books.length}</Text>
        </View>
        {books.length > 5 && (
          <Pressable 
            style={styles.toggleButton} 
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <Text style={styles.toggleButtonText}>
              {isExpanded ? '접기' : '전체보기'}
            </Text>
            <Icon 
              name={isExpanded ? 'chevron-up' : 'grid'} 
              size={16} 
              color={colors.gray[600]} 
            />
          </Pressable>
        )}
      </View>

      {isExpanded ? (
        <FlatList
          data={books}
          renderItem={({ item }) => renderBookItem(item)}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContent}
          style={styles.gridContainer}
        />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {books.map(book => renderBookItem(book))}
        </ScrollView>
      )}
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
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
    marginRight: spacing.xs,
  },
  badge: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.full,
    marginRight: 'auto',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray[600],
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[600],
  },
  scrollContent: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  gridContainer: {
    paddingHorizontal: spacing.lg,
  },
  gridContent: {
    paddingVertical: spacing.xs,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
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
