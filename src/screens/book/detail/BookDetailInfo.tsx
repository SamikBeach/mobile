import React from 'react';
import { View, StyleSheet, Image, Pressable, Linking } from 'react-native';
import { Text } from '@/components/common/Text';
import { Button } from '@/components/common/Button';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';
import { colors, spacing, borderRadius, shadows } from '@/styles/theme';
import type { Book } from '@/types/book';

interface Props {
  book: Book;
}

export function BookDetailInfo({ book }: Props) {
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
              <View style={styles.statItem}>
                <Icon name="heart" size={14} color={colors.gray[500]} />
                <Text style={styles.statText}>{book.likeCount}</Text>
              </View>
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
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
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
    backgroundColor: colors.gray[100],
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
