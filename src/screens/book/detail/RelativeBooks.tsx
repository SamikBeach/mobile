import React, { useState } from 'react';
import { View, StyleSheet, Pressable, FlatList, TouchableOpacity } from 'react-native';
import { Text } from '@/components/common/Text';
import { useQuery } from '@tanstack/react-query';
import { bookApi } from '@/apis/book';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { colors, spacing, borderRadius, shadows } from '@/styles/theme';
import Icon from 'react-native-vector-icons/Feather';
import { BookImage } from '@/components/book/BookImage';
import { Book } from '@/types/book';
import { RelativeBooksSkeleton } from '@/components/common/Skeleton/RelativeBooksSkeleton';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';

interface Props {
  bookId: number;
}

export function RelativeBooks({ bookId }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: books = [], isLoading } = useQuery({
    queryKey: ['book-related', bookId],
    queryFn: () => bookApi.getAllRelatedBooks(bookId),
    select: response => response.data,
  });

  if (isLoading) {
    return <RelativeBooksSkeleton />;
  }

  if (books.length === 0) {
    return null;
  }

  const handleBookPress = (id: number) => {
    navigation.navigate('BookDetail', { bookId: id });
  };

  const renderBookItem = (book: Book) => (
    <Pressable key={book.id} style={styles.bookItem} onPress={() => handleBookPress(book.id)}>
      <View style={styles.coverContainer}>
        <BookImage imageUrl={book.imageUrl} size="xl" />
      </View>
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>
          {book.title}
        </Text>
        {book.authorBooks?.[0]?.author && (
          <Text style={styles.authorName}>{book.authorBooks[0].author.nameInKor}</Text>
        )}
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>연관된 책</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{books.length}</Text>
          </View>
        </View>
        {books.length > 4 && (
          <TouchableOpacity style={styles.toggleButton} onPress={() => setIsExpanded(!isExpanded)}>
            <Text style={styles.toggleButtonText}>{isExpanded ? '접기' : '전체보기'}</Text>
            <Icon name={isExpanded ? 'chevron-down' : 'grid'} size={16} color={colors.gray[500]} />
          </TouchableOpacity>
        )}
      </View>

      {isExpanded ? (
        <Animated.View
          style={styles.gridContainer}
          layout={Layout.duration(300)}
          entering={FadeIn.duration(300)}>
          <FlatList
            data={books}
            renderItem={({ item }) => renderBookItem(item)}
            keyExtractor={item => item.id.toString()}
            numColumns={3}
            contentContainerStyle={styles.gridContent}
            columnWrapperStyle={styles.gridRow}
          />
        </Animated.View>
      ) : (
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          layout={Layout.duration(300)}
          entering={FadeIn.duration(300)}>
          {books.slice(0, 6).map(book => renderBookItem(book))}
        </Animated.ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[500],
  },
  scrollContent: {
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  gridContainer: {
    paddingHorizontal: spacing.lg,
  },
  gridContent: {
    paddingVertical: spacing.sm,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  bookItem: {
    width: 120,
    gap: spacing.xs,
  },
  coverContainer: {
    ...shadows.sm,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  bookInfo: {
    gap: 2,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[900],
    lineHeight: 20,
  },
  authorName: {
    fontSize: 12,
    color: colors.gray[500],
  },
});
