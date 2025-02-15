import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, Pressable, Switch, Platform } from 'react-native';
import { Text } from '@/components/common/Text';
import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { bookApi } from '@/apis/book';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { ReviewItem } from '@/components/review/ReviewItem';
import type { Review } from '@/types/review';
import type { PaginatedResponse } from '@/types/common';
import type { AxiosResponse } from 'axios';
import { ReviewItemSkeleton } from '@/components/common/Skeleton';
import { BookDetailInfo } from './BookDetailInfo';
import { RelativeBooks } from './RelativeBooks';
import { Empty } from '@/components/common/Empty';
import Icon from 'react-native-vector-icons/Feather';
import Animated, { Layout } from 'react-native-reanimated';
import { useAtom } from 'jotai';
import { includeOtherTranslationsAtom } from '@/atoms/book';

interface Props {
  bookId: number;
}

export function BookDetailScreenContent({ bookId }: Props) {
  const [includeOtherTranslations, setIncludeOtherTranslations] = useAtom(
    includeOtherTranslationsAtom,
  );
  const flatListRef = useRef<FlatList>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery<
    AxiosResponse<PaginatedResponse<Review>>,
    Error
  >({
    queryKey: ['book-reviews', bookId, includeOtherTranslations],
    queryFn: ({ pageParam = 1 }) =>
      bookApi.searchBookReviews(
        bookId,
        {
          page: pageParam as number,
          limit: 20,
        },
        includeOtherTranslations,
      ),
    getNextPageParam: param => {
      const nextParam = param.data.links.next;
      const query = nextParam?.split('?')[1];
      const pageParam = query
        ?.split('&')
        .find(q => q.startsWith('page'))
        ?.split('=')[1];

      return pageParam;
    },
    initialPageParam: 1,
    placeholderData: keepPreviousData,
  });

  const { data: book } = useQuery({
    queryKey: ['book', bookId, includeOtherTranslations],
    queryFn: () => bookApi.getBookDetail(bookId, includeOtherTranslations),
    select: response => response.data,
  });

  const reviews = data?.pages.flatMap(page => page.data.data) ?? [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleReviewPress = () => {
    flatListRef.current?.scrollToIndex({
      index: 0,
      animated: true,
      viewPosition: 0,
    });
  };

  useEffect(() => {
    if (!isLoading && flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: false });
    }
  }, [isLoading]);

  const ListHeaderComponent = (
    <View style={styles.listHeader}>
      <BookDetailInfo bookId={bookId} onReviewPress={handleReviewPress} />
      <RelativeBooks bookId={bookId} />
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>리뷰</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{book?.reviewCount ?? 0}</Text>
            </View>
          </View>
          <View style={styles.toggleContainer}>
            <Pressable
              style={styles.toggleContainer}
              onPress={() => setIncludeOtherTranslations(prev => !prev)}>
              <Switch
                value={includeOtherTranslations}
                onValueChange={setIncludeOtherTranslations}
                trackColor={{ false: colors.gray[200], true: colors.gray[900] }}
                thumbColor={colors.white}
                ios_backgroundColor={colors.gray[200]}
                style={Platform.select({
                  ios: {
                    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                  },
                })}
              />
              <Text style={styles.toggleLabel}>다른 번역본 리뷰 포함</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );

  const ListEmptyComponent = (
    <View style={styles.emptyContainer}>
      <Empty
        icon={<Icon name="message-square" size={48} color={colors.gray[400]} />}
        message="아직 리뷰가 없어요"
        description="첫 번째 리뷰를 작성해보세요"
      />
    </View>
  );

  return (
    <Animated.FlatList
      ref={flatListRef}
      data={reviews}
      renderItem={({ item }) => (
        <View style={styles.reviewItemContainer}>
          {isLoading ? (
            <ReviewItemSkeleton />
          ) : (
            <ReviewItem
              review={item}
              showBookInfo={includeOtherTranslations && item.book.id !== bookId}
            />
          )}
        </View>
      )}
      itemLayoutAnimation={Layout.springify()}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      keyExtractor={item => item.id.toString()}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={isFetchingNextPage ? <ReviewItemSkeleton /> : null}
      contentContainerStyle={styles.reviewList}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  header: {
    gap: spacing.md,
    padding: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    cursor: 'pointer',
  },
  toggleLabel: {
    fontSize: 14,
    color: colors.gray[600],
  },
  emptyContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginHorizontal: spacing.lg,
  },
  reviewList: {
    paddingBottom: spacing.lg,
  },
  separator: {
    height: 1,
    backgroundColor: colors.gray[100],
  },
  listHeader: {
    gap: spacing.xl,
  },
  reviewItemContainer: {
    paddingHorizontal: spacing.lg,
  },
});
