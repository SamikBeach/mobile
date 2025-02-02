// Start of Selection
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Review } from '@/types/review';
import { User } from '@/types/user';
import { Book } from '@/types/book';

interface FeedProps {
  review: Review;
  user: User;
  book: Book;
}

export const Feed = ({ review, user, book }: FeedProps) => {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image source={{ uri: user.imageUrl ?? '' }} style={styles.avatar} />
          <Text style={styles.date}>{review.createdAt}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.bookInfo}>
          <Image source={{ uri: book.imageUrl ?? '' }} style={styles.bookImage} />
          <View style={styles.bookDetails}>
            <Text style={styles.bookTitle} numberOfLines={2}>
              {book.title}
            </Text>
            <Text style={styles.bookAuthor} numberOfLines={1}>
              {book.authorBooks[0].author.name}
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
          <TouchableOpacity style={styles.actionButton}>
            <Text>좋아요 {review.likeCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text>댓글 {review.commentCount}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
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
  },
  actionButton: {
    marginLeft: 16,
    padding: 8,
  },
});
// End of Selection

// 커밋 메시지: 이미지 URL 관련 타입 에러 수정됨
