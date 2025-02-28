import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  Pressable,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Text } from '@/components/common/Text';
import { useQuery } from '@tanstack/react-query';
import { authorApi } from '@/apis/author';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { Book } from '@/types/book';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import Icon from 'react-native-vector-icons/Feather';
import { Skeleton } from '@/components/common/Skeleton';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';

interface Props {
  authorId: number;
}

export function AuthorBooks({ authorId }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: author, isLoading: isAuthorLoading } = useQuery({
    queryKey: ['author', authorId],
    queryFn: () => authorApi.getAuthorDetail(authorId),
    select: response => response.data,
  });

  const { data: books = [], isLoading: isBooksLoading } = useQuery({
    queryKey: ['author-books', authorId],
    queryFn: () => authorApi.getAllAuthorBooks(authorId),
    select: response => response.data,
  });

  if (isAuthorLoading && isBooksLoading) {
    return <AuthorBooksSkeleton />;
  }

  if (books.length === 0) {
    return null;
  }

  // 스크롤 모드용 렌더 함수
  const renderScrollBookItem = (book: Book) => (
    <Pressable
      key={book.id}
      style={styles.bookItem}
      onPress={() => navigation.navigate('BookDetail', { bookId: book.id })}>
      <View style={styles.coverContainer}>
        <Image
          source={{ uri: book.imageUrl || 'https://via.placeholder.com/120' }}
          style={styles.bookCover}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.bookTitle} numberOfLines={2}>
        {book.title}
      </Text>
    </Pressable>
  );

  // 그리드 모드용 렌더 함수
  const renderGridBookItem = ({ item }: { item: Book }) => (
    <Pressable
      style={styles.bookItem}
      onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}>
      <View style={styles.coverContainer}>
        <Image
          source={{ uri: item.imageUrl || 'https://via.placeholder.com/110x165' }}
          style={{ width: 110, height: 165, borderRadius: borderRadius.md }}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.bookTitle} numberOfLines={2}>
        {item.title}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{author?.nameInKor.trim()}의 다른 책</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{books.length}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.toggleButton} onPress={() => setIsExpanded(!isExpanded)}>
          <Text style={styles.toggleButtonText}>{isExpanded ? '접기' : '전체보기'}</Text>
          <Icon name={isExpanded ? 'chevron-up' : 'grid'} size={16} color={colors.gray[500]} />
        </TouchableOpacity>
      </View>

      {isExpanded ? (
        <Animated.View
          style={styles.gridContainer}
          layout={Layout.duration(300)}
          entering={FadeIn.duration(300)}>
          <FlatList
            data={books}
            renderItem={renderGridBookItem}
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
          {books.slice(0, 6).map(renderScrollBookItem)}
        </Animated.ScrollView>
      )}
    </View>
  );
}

function AuthorBooksSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Skeleton style={{ width: 150, height: 24, borderRadius: 4 }} />
          <Skeleton style={{ width: 30, height: 20, borderRadius: 10 }} />
        </View>
        <Skeleton style={{ width: 80, height: 30, borderRadius: 6 }} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {[1, 2, 3, 4, 5].map(i => (
          <View key={i} style={styles.bookItem}>
            <Skeleton style={{ width: 120, height: 180, borderRadius: 8 }} />
            <Skeleton style={{ width: 100, height: 16, marginTop: 8, borderRadius: 4 }} />
            <Skeleton style={{ width: 80, height: 12, marginTop: 4, borderRadius: 4 }} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
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
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  bookCover: {
    width: 120,
    height: 180,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[900],
    lineHeight: 20,
  },
});
