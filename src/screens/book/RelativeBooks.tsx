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

interface Props {
  bookId: number;
}

export function RelativeBooks({ bookId }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const { data: books = [] } = useQuery({
    queryKey: ['relative-books', bookId],
    queryFn: () => bookApi.getAllRelatedBooks(bookId),
    select: response => response.data,
  });

  if (books.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>이 책의 다른 번역서</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{books.length}</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {books.map(book => (
          <Pressable
            key={book.id}
            style={styles.bookItem}
            onPress={() => navigation.push('BookDetail', { bookId: book.id })}
          >
            <Image
              source={{ uri: book.imageUrl ?? undefined }}
              style={styles.bookImage}
              resizeMode="cover"
            />
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
    gap: spacing.sm,
  },
  title: {
    fontSize: 16,
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
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray[600],
  },
  scrollContent: {
    gap: spacing.md,
    paddingRight: spacing.lg,
  },
  bookItem: {
    width: 110,
  },
  bookImage: {
    width: 110,
    height: 160,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
  },
  bookInfo: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  bookTitle: {
    fontSize: 13,
    color: colors.gray[900],
    lineHeight: 18,
  },
  bookPublisher: {
    fontSize: 12,
    color: colors.gray[500],
  },
}); 