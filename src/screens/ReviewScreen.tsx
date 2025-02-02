import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useQuery } from '@tanstack/react-query';
import { reviewApi } from '@/apis/review';
import { FeedContent } from '@/components/Feed/FeedContent';
import { UserAvatar } from '@/components/common/UserAvatar';
import { LikeButton } from '@/components/common/LikeButton';
import { CommentButton } from '@/components/common/CommentButton';
import { format } from 'date-fns';

type Props = NativeStackScreenProps<RootStackParamList, 'Review'>;

export function ReviewScreen({ route }: Props) {
  const { reviewId } = route.params;

  const { data: review } = useQuery({
    queryKey: ['review', reviewId],
    queryFn: () => reviewApi.getReviewDetail(reviewId),
    select: response => response.data,
  });

  if (!review) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{review.title}</Text>
            <TouchableOpacity style={styles.bookCard}>
              <Image
                source={{ uri: review.book.imageUrl ?? undefined }}
                style={styles.bookThumbnail}
              />
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle} numberOfLines={1}>
                  {review.book.title}
                </Text>
                <Text style={styles.bookAuthor} numberOfLines={1}>
                  {review.book.authorBooks.map(author => author.author.nameInKor).join(', ')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.userInfo}>
            <UserAvatar user={review.user} size="sm" />
            <Text style={styles.dot}>·</Text>
            <Text style={styles.date}>
              {format(new Date(review.createdAt), 'yyyy년 M월 d일 HH시 mm분')}
            </Text>
          </View>
        </View>

        <View style={styles.reviewContent}>
          <FeedContent content={review.content} isExpanded={true} />
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 20,
  },
  header: {
    gap: 16,
    marginBottom: 32,
  },
  titleContainer: {
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
  bookCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 8,
    maxWidth: '100%',
  },
  bookThumbnail: {
    width: 20,
    height: 28,
    borderRadius: 2,
    backgroundColor: '#F3F4F6',
  },
  bookInfo: {
    flexShrink: 1,
  },
  bookTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  bookAuthor: {
    fontSize: 11,
    color: '#6B7280',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    color: '#D1D5DB',
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
  },
  reviewContent: {
    marginBottom: 32,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
});
