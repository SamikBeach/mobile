// Start of Selection
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  NativeSyntheticEvent,
  TextLayoutEventData,
} from 'react-native';
import { format } from 'date-fns';
import { Review } from '@/types/review';
import { UserBase } from '@/types/user';
import { Book } from '@/types/book';
import { formatDate } from '@/utils/date';
import { LikeButton } from '@/components/common/LikeButton';
import { CommentButton } from '@/components/common/CommentButton';
import { UserAvatar } from '@/components/common/UserAvatar';
import { FeedContent } from './FeedContent';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

interface FeedProps {
  review: Review;
  user: UserBase;
  book: Book;
}

export function Feed({ review, user, book }: FeedProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);

  const formattedPublicationDate = book.publicationDate
    ? format(new Date(book.publicationDate), 'yyyy년 M월 d일')
    : '';

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

  const handlePress = () => {
    navigation.navigate('Review', { reviewId: review.id });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <UserAvatar user={user} showNickname={true} />
          <Text style={styles.date}>{formatDate(review.createdAt)}</Text>
        </View>
      </View>

      <View style={styles.mainContent}>
        {/* 왼쪽: 책 정보 */}
        <View style={styles.bookSection}>
          <Image source={{ uri: book.imageUrl ?? undefined }} style={styles.bookImage} />
          <View style={styles.bookInfo}>
            <Text style={styles.bookTitle} numberOfLines={2}>
              {book.title}
            </Text>
            <Text style={styles.bookAuthor} numberOfLines={2}>
              {book.authorBooks.map(author => author.author.nameInKor).join(', ')} ·{' '}
              {book.publisher} · {formattedPublicationDate}
            </Text>
          </View>
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
                <FeedContent content={review.content} isExpanded={isExpanded} />
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
              onPress={() => {}}
            />
            <CommentButton commentCount={review.commentCount} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  },
  bookImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  bookInfo: {
    maxWidth: 120,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 12,
    color: '#666666',
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
