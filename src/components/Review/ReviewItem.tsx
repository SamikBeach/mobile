import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/common/Text';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import type { RootStackParamList } from '@/navigation/types';
import type { TabParamList } from '@/navigation/TabNavigator';
import { colors, spacing, borderRadius, shadows } from '@/styles/theme';
import { format } from 'date-fns';
import { BookItem } from '../Book/BookItem';
import type { Review } from '@/types/review';

type ReviewItemNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList>,
  BottomTabNavigationProp<TabParamList>
>;

interface Props {
  review: Review;
  showBook?: boolean;
}

export function ReviewItem({ review, showBook = false }: Props) {
  const navigation = useNavigation<ReviewItemNavigationProp>();

  const handlePress = () => {
    navigation.navigate('Review', { reviewId: review.id });
  };

  const handleUserPress = () => {
    navigation.navigate('UserTab', { userId: review.user.id });
  };

  return (
    <View style={styles.container}>
      {showBook && review.book && (
        <View style={styles.bookSection}>
          <BookItem book={review.book} size="small" />
        </View>
      )}
      <Pressable style={styles.content} onPress={handlePress}>
        <View style={styles.header}>
          <Pressable style={styles.userInfo} onPress={handleUserPress}>
            <Text style={styles.username}>{review.user.nickname}</Text>
            <Text style={styles.date}>{format(new Date(review.createdAt), 'yyyy.MM.dd')}</Text>
          </Pressable>
          <View style={styles.rating}>
            <Icon name="star" size={16} color={colors.yellow[500]} />
            <Text style={styles.ratingText}>{review.rating.toFixed(1)}</Text>
          </View>
        </View>
        <Text style={styles.text} numberOfLines={3}>
          {review.content}
        </Text>
        <View style={styles.footer}>
          <View style={styles.stat}>
            <Icon name="thumbs-up" size={14} color={colors.gray[500]} />
            <Text style={styles.statText}>{review.likeCount}</Text>
          </View>
          <View style={styles.stat}>
            <Icon name="message-square" size={14} color={colors.gray[500]} />
            <Text style={styles.statText}>{review.commentCount}</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  bookSection: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  content: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  username: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray[900],
  },
  date: {
    fontSize: 13,
    color: colors.gray[500],
    marginTop: 2,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  ratingText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray[900],
  },
  text: {
    fontSize: 15,
    color: colors.gray[800],
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
    fontSize: 13,
    color: colors.gray[600],
  },
});
