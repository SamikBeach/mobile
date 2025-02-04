import React from 'react';
import { View, StyleSheet, Image, Pressable, Linking } from 'react-native';
import { Text } from '@/components/common/Text';
import { Button } from '@/components/common/Button';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';
import { colors, spacing, borderRadius, shadows } from '@/styles/theme';
import { useMutation } from '@tanstack/react-query';
import { bookApi } from '@/apis/book';
import type { Book } from '@/types/book';
import { useBookQueryData } from '@/hooks/useBookQueryData';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface Props {
  book: Book;
}

export function BookDetailInfo({ book }: Props) {
  const { updateBookLikeQueryData } = useBookQueryData();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const currentUser = useCurrentUser();

  const { mutate: toggleLike } = useMutation({
    mutationFn: () => bookApi.toggleBookLike(book.id),
    onMutate: async () => {
      updateBookLikeQueryData({
        bookId: book.id,
        isOptimistic: true,
      });
    },
    onError: () => {
      updateBookLikeQueryData({
        bookId: book.id,
        isOptimistic: false,
        currentStatus: {
          isLiked: book.isLiked,
          likeCount: book.likeCount,
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

  const formattedPublicationDate = book.publicationDate
    ? format(new Date(book.publicationDate), 'yyyy년 M월 d일')
    : '';

  const handleBookClick = () => {
    if (book.isbn) {
      Linking.openURL(`https://www.aladin.co.kr/shop/wproduct.aspx?isbn=${book.isbn}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleBookClick} style={styles.imageWrapper}>
          <Image
            source={{ uri: book.imageUrl ?? undefined }}
            style={styles.image}
            resizeMode="cover"
          />
        </Pressable>

        <View style={styles.info}>
          <View style={styles.infoContent}>
            <View style={styles.titleSection}>
              <Text style={styles.title} numberOfLines={3}>
                {book.title}
              </Text>
              <Text style={styles.author} numberOfLines={1}>
                {book.authorBooks
                  .map(ab => ab.author.nameInKor)
                  .join(', ')
                  .trim()}
              </Text>
              <Text style={styles.meta} numberOfLines={2}>
                {book.publisher}
                {book.publisher && formattedPublicationDate && ' · '}
                {formattedPublicationDate}
              </Text>
              <Text style={styles.aladin}>정보제공: 알라딘</Text>
            </View>

            <View style={styles.stats}>
              <Pressable style={styles.statItem} onPress={handleLikePress}>
                <Icon
                  name={book.isLiked ? 'heart' : 'heart'}
                  size={14}
                  color={book.isLiked ? colors.primary[500] : colors.gray[500]}
                />
                <Text style={[styles.statText, book.isLiked && { color: colors.primary[500] }]}>
                  {book.likeCount}
                </Text>
              </Pressable>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Icon name="message-circle" size={14} color={colors.gray[500]} />
                <Text style={styles.statText}>{book.reviewCount}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <Button variant="outline" style={styles.writeButton}>
        <View style={styles.writeButtonContent}>
          <Icon name="edit-2" size={16} color={colors.gray[700]} />
          <Text style={styles.writeButtonText}>리뷰 작성하기</Text>
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
  imageWrapper: {
    ...shadows.md,
  },
  image: {
    width: 120,
    height: 180,
    borderRadius: borderRadius.md,
  },
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
