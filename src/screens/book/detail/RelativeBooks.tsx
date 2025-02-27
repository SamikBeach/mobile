import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Text } from '@/components/common/Text';
import { useQuery } from '@tanstack/react-query';
import { bookApi } from '@/apis/book';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { RelativeBooksSkeleton } from '@/components/common/Skeleton';
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>다른 번역본</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{books.length}</Text>
          </View>
        </View>
        {books.length > 5 && (
          <Pressable style={styles.toggleButton} onPress={() => setIsExpanded(!isExpanded)}>
            <Text style={styles.toggleButtonText}>{isExpanded ? '접기' : '전체보기'}</Text>
            <Icon name={isExpanded ? 'chevron-up' : 'grid'} size={16} color={colors.gray[600]} />
          </Pressable>
        )}
      </View>

      {isExpanded ? (
        <FlatList
          data={books}
          keyExtractor={item => `book-${item.id}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.bookItem}
              onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}>
              <Image
                source={{ uri: item.imageUrl || 'https://via.placeholder.com/120' }}
                style={styles.bookCover}
                resizeMode="cover"
              />
              <Text style={styles.bookTitle} numberOfLines={2}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.booksList}
        />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {books.map(book => (
            <TouchableOpacity
              key={book.id}
              style={styles.bookItem}
              onPress={() => navigation.navigate('BookDetail', { bookId: book.id })}>
              <Image
                source={{ uri: book.imageUrl || 'https://via.placeholder.com/120' }}
                style={styles.bookCover}
                resizeMode="cover"
              />
              <Text style={styles.bookTitle} numberOfLines={2}>
                {book.title}
              </Text>
            </TouchableOpacity>
          ))}
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
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
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
  booksList: {
    paddingVertical: spacing.xs,
  },
  bookItem: {
    width: 120,
  },
  bookCover: {
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[900],
    lineHeight: 20,
  },
});
