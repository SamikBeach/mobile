import React from 'react';
import { View, StyleSheet, Pressable, Linking, TouchableOpacity } from 'react-native';
import { Text } from '@/components/common/Text';
import { Button } from '@/components/common/Button';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';
import { colors, spacing } from '@/styles/theme';
import { useMutation, useQuery } from '@tanstack/react-query';
import { bookApi } from '@/apis/book';
import { useBookQueryData } from '@/hooks/useBookQueryData';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { BookDetailInfoSkeleton } from '@/components/common/Skeleton/BookDetailInfoSkeleton';
import { CommentButton } from '@/components/common/CommentButton';
import { LikeButton } from '@/components/common/LikeButton';
import { BookImage } from '@/components/book/BookImage';

interface Props {
  bookId: number;
  onReviewPress: () => void;
}

export function BookDetailInfo({ bookId, onReviewPress }: Props) {
  const { data: book, isLoading } = useQuery({
    queryKey: ['book', bookId],
    queryFn: () => bookApi.getBookDetail(bookId),
    select: response => response.data,
  });

  const { updateBookLikeQueryData } = useBookQueryData();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const currentUser = useCurrentUser();

  const { mutate: toggleLike } = useMutation({
    mutationFn: () => bookApi.toggleBookLike(bookId),
    onMutate: async () => {
      updateBookLikeQueryData({
        bookId: bookId,
        isOptimistic: true,
      });
    },
    onError: () => {
      updateBookLikeQueryData({
        bookId: bookId,
        isOptimistic: false,
        currentStatus: {
          isLiked: book?.isLiked ?? false,
          likeCount: book?.likeCount ?? 0,
        },
      });
    },
  });

  const handleLikePress = () => {
    if (!currentUser) {
      navigation.navigate('Login');
      return;
    }
    toggleLike();
  };

  const formattedPublicationDate = book?.publicationDate
    ? format(new Date(book.publicationDate), 'yyyy년 M월 d일')
    : '';

  const handleBookClick = () => {
    if (book?.isbn) {
      Linking.openURL(`https://www.aladin.co.kr/shop/wproduct.aspx?isbn=${book.isbn}`);
    }
  };

  const handleWriteReviewPress = () => {
    if (!currentUser) {
      navigation.navigate('Login');
      return;
    }

    navigation.navigate('WriteReview', { bookId: bookId });
  };

  const handleAuthorPress = () => {
    if (!book?.authorBooks[0].author.id) return;

    navigation.navigate('AuthorDetail', { authorId: book?.authorBooks[0].author.id });
  };

  if (isLoading || !book) {
    return <BookDetailInfoSkeleton />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleBookClick} style={styles.imageWrapper}>
          <BookImage imageUrl={book.imageUrl} />
        </Pressable>

        <View style={styles.info}>
          <View style={styles.infoContent}>
            <View style={styles.titleSection}>
              <Text style={styles.title} numberOfLines={3}>
                {book.title}
              </Text>
              <TouchableOpacity
                onPress={handleAuthorPress}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={styles.author} numberOfLines={1}>
                  {book.authorBooks
                    .map(ab => ab.author.nameInKor)
                    .join(', ')
                    .trim()}
                </Text>
              </TouchableOpacity>
              <Text style={styles.meta} numberOfLines={2}>
                {book.publisher}
                {book.publisher && formattedPublicationDate && ' · '}
                {formattedPublicationDate}
              </Text>
              <Text style={styles.aladin}>정보제공: 알라딘</Text>
            </View>

            <View style={styles.stats}>
              <LikeButton
                isLiked={book.isLiked}
                likeCount={book.likeCount}
                onPress={handleLikePress}
              />
              <CommentButton commentCount={book.reviewCount} onPress={onReviewPress} />
            </View>
          </View>
        </View>
      </View>

      <Button variant="outline" style={styles.writeButton} onPress={handleWriteReviewPress}>
        <View style={styles.writeButtonContent}>
          <Icon name="edit-2" size={16} color={colors.gray[700]} />
          <Text style={styles.writeButtonText}>
            {currentUser ? '리뷰 작성하기' : '로그인하고 리뷰 작성하기'}
          </Text>
        </View>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  imageWrapper: {},
  info: {
    flex: 1,
    height: 180,
  },
  infoContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleSection: {
    gap: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
    lineHeight: 24,
  },
  author: {
    fontSize: 15,
    color: colors.gray[700],
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 12,
    backgroundColor: colors.gray[200],
    marginHorizontal: spacing.sm,
  },
  statText: {
    fontSize: 14,
    color: colors.gray[600],
  },
  meta: {
    fontSize: 13,
    color: colors.gray[500],
  },
  aladin: {
    fontSize: 13,
    color: colors.gray[400],
  },
  writeButton: {
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderColor: colors.gray[200],
  },
  writeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  writeButtonText: {
    fontSize: 15,
    color: colors.gray[700],
    fontWeight: '600',
  },
});
