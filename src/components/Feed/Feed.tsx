// Start of Selection
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  NativeSyntheticEvent,
  TextLayoutEventData,
  Pressable,
} from 'react-native';
import { Review } from '@/types/review';
import { UserBase } from '@/types/user';
import { Book } from '@/types/book';
import { formatDate } from '@/utils/date';
import { LikeButton } from '@/components/common/LikeButton';
import { CommentButton } from '@/components/common/CommentButton';
import { UserAvatar } from '@/components/common/UserAvatar';
import { LexicalContent } from '../common/LexicalContent';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useMutation } from '@tanstack/react-query';
import { reviewApi } from '@/apis/review';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useReviewQueryData } from '@/hooks/useReviewQueryData';
import { BookImage } from '@/components/book/BookImage';
import { colors } from '@/styles/theme';

interface Props {
  review: Review;
  user: UserBase;
  book: Book;
  expanded?: boolean;
}

export function Feed({ review, user, book, expanded }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const currentUser = useCurrentUser();

  const { updateReviewLikeQueryData } = useReviewQueryData();

  const onTextLayout = (event: NativeSyntheticEvent<TextLayoutEventData>) => {
    if (!isExpanded) {
      const { lines } = event.nativeEvent;
      // 8줄 이상일 때 더보기 버튼 표시
      if (lines.length >= 8) {
        setIsTruncated(true);
      } else {
        setIsTruncated(false);
      }
    }
  };

  const { mutate: toggleLike } = useMutation({
    mutationFn: () => reviewApi.toggleReviewLike(review.id),
    onMutate: () => {
      updateReviewLikeQueryData({
        reviewId: review.id,
        isOptimistic: true,
      });
    },
    onError: () => {
      updateReviewLikeQueryData({
        reviewId: review.id,
        isOptimistic: false,
        currentStatus: {
          isLiked: review.isLiked ?? false,
          likeCount: review.likeCount,
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

  const handlePress = () => {
    if (!expanded) {
      navigation.navigate('Review', { reviewId: review.id });
    }
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <UserAvatar user={user} showNickname={true} />
          <Text style={styles.date}>{formatDate(review.createdAt)}</Text>
        </View>
      </View>

      <View style={styles.mainContent}>
        {/* 왼쪽: 책 정보 */}
        <View style={styles.bookSection}>
          <BookImage imageUrl={book.imageUrl} size="xl" />
          <Pressable style={styles.bookInfo}>
            <Text style={styles.bookTitle} numberOfLines={2}>
              {book.title}
            </Text>
            {book.authorBooks.length > 0 && (
              <Text style={styles.bookAuthor} numberOfLines={1}>
                {book.authorBooks
                  .map(author => author.author.nameInKor)
                  .join(', ')
                  .trim()}
              </Text>
            )}
            {book.publisher && (
              <Text style={styles.bookPublisher} numberOfLines={1}>
                {book.publisher}
              </Text>
            )}
          </Pressable>
        </View>

        {/* 오른쪽: 리뷰 내용 */}
        <View style={styles.reviewSection}>
          <View style={styles.reviewContent}>
            <Text style={styles.reviewTitle}>{review.title}</Text>
            <View style={styles.reviewTextContainer}>
              <Text
                style={styles.reviewText}
                numberOfLines={isExpanded ? undefined : 8}
                ellipsizeMode="tail"
                onTextLayout={onTextLayout}>
                <LexicalContent content={review.content} isExpanded={isExpanded} />
              </Text>
              {isTruncated && !isExpanded && (
                <TouchableOpacity
                  style={styles.moreButton}
                  onPress={() => setIsExpanded(true)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={styles.moreButtonText}>더보기</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.actions}>
            <LikeButton
              isLiked={review.isLiked ?? false}
              likeCount={review.likeCount}
              onPress={handleLikePress}
            />
            <CommentButton commentCount={review.commentCount} onPress={handlePress} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  date: {
    fontSize: 12,
    color: '#666666',
  },
  mainContent: {
    flexDirection: 'row',
    gap: 20,
  },
  bookSection: {
    width: 120,
    gap: 8,
  },
  bookImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  bookInfo: {
    gap: 4,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[900],
    lineHeight: 18,
  },
  bookAuthor: {
    fontSize: 13,
    color: colors.gray[600],
    lineHeight: 14,
  },
  bookPublisher: {
    fontSize: 13,
    color: colors.gray[500],
    marginTop: 2,
  },
  reviewSection: {
    flex: 1,
    justifyContent: 'space-between',
  },
  reviewContent: {
    flex: 1,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#111827',
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4B5563',
  },
  reviewTextContainer: {
    position: 'relative',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
  moreButton: {
    marginTop: 8,
    paddingVertical: 4,
  },
  moreButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
});
// End of Selection

// 커밋 메시지: 이미지 URL 관련 타입 에러 수정됨
