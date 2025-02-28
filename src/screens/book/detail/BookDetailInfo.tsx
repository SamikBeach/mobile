import React from 'react';
import { View, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { Text } from '@/components/common/Text';
import Icon from 'react-native-vector-icons/Feather';
import { format, isValid, parseISO } from 'date-fns';
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
  onChatToggle: () => void;
  isChatOpen: boolean;
}

export function BookDetailInfo({ bookId, onReviewPress, onChatToggle }: Props) {
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

  const handleAuthorPress = (authorId: number) => {
    navigation.navigate('AuthorDetail', { authorId });
  };

  if (isLoading || !book) {
    return <BookDetailInfoSkeleton />;
  }

  console.warn('book');
  console.log({ book });

  const authorName = book.authorBooks?.[0]?.author?.nameInKor || '작가 미상';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BookImage imageUrl={book.imageUrl} size="xl" />
        <View style={styles.info}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{book.title}</Text>
            <Pressable onPress={() => handleAuthorPress(book.authorBooks[0].author.id)}>
              <Text style={styles.author}>{authorName}</Text>
            </Pressable>
          </View>
          <View style={styles.stats}>
            <LikeButton
              isLiked={book.isLiked}
              likeCount={book.likeCount}
              onPress={handleLikePress}
            />
            <View style={styles.statDivider} />
            <CommentButton commentCount={book.reviewCount} onPress={onReviewPress} />
          </View>
        </View>
      </View>

      <View style={styles.metaSection}>
        <Text style={styles.meta}>
          {book.publisher}
          {book.publicationDate &&
            isValid(parseISO(book.publicationDate)) &&
            ` · ${format(parseISO(book.publicationDate), 'yyyy.MM.dd')}`}
        </Text>
      </View>

      {book.description && (
        <View style={styles.descriptionSection}>
          <Text style={styles.description}>{book.description}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.chatButton} onPress={onChatToggle} activeOpacity={0.7}>
        <View style={styles.buttonContent}>
          <Icon name="message-circle" size={20} color={colors.gray[700]} />
          <Text style={styles.buttonText}>{`${authorName}와(과) 대화하기`}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleSection: {
    gap: spacing.xs,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.gray[900],
    lineHeight: 24,
  },
  originalTitle: {
    fontSize: 15,
    color: colors.gray[600],
  },
  author: {
    fontSize: 15,
    color: colors.gray[700],
    textDecorationLine: 'underline',
  },
  metaSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionSection: {
    gap: spacing.xs,
  },
  description: {
    fontSize: 15,
    color: colors.gray[700],
    lineHeight: 22,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
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
  chatButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[700],
  },
  reviewButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
});
