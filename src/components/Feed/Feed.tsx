// Start of Selection
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { Review } from '@/types/review';
import { UserBase } from '@/types/user';
import { Book } from '@/types/book';
import { formatDate } from '@/utils/date';
import { LikeButton } from '@/components/common/LikeButton';
import { CommentButton } from '@/components/common/CommentButton';

interface FeedProps {
  review: Review;
  user: UserBase;
  book: Book;
}

export function Feed({ review, user, book }: FeedProps) {
  const formattedPublicationDate = book.publicationDate
    ? format(new Date(book.publicationDate), 'yyyy년 M월 d일')
    : '';

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image source={{ uri: user.imageUrl ?? undefined }} style={styles.avatar} />
          <Text style={styles.date}>{formatDate(review.createdAt)}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.bookInfo}>
          <Image source={{ uri: book.imageUrl ?? undefined }} style={styles.bookImage} />
          <View style={styles.bookDetails}>
            <Text style={styles.bookTitle} numberOfLines={2}>
              {book.title}
            </Text>
            <Text style={styles.bookAuthor} numberOfLines={1}>
              {book.authorBooks[0]?.author.nameInKor} · {book.publisher} ·{' '}
              {formattedPublicationDate}
            </Text>
          </View>
        </View>

        <View style={styles.reviewContent}>
          <Text style={styles.reviewTitle}>{review.title}</Text>
          <Text style={styles.reviewText} numberOfLines={8}>
            {review.content}
          </Text>
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
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  date: {
    fontSize: 12,
    color: '#666666',
  },
  content: {
    flex: 1,
  },
  bookInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  bookImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  bookDetails: {
    flex: 1,
    marginLeft: 12,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666666',
  },
  reviewContent: {
    marginBottom: 16,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
});
// End of Selection

// 커밋 메시지: 이미지 URL 관련 타입 에러 수정됨
