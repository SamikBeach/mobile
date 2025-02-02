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
        <Pressable onPress={handleBookClick} style={styles.imageContainer}>
          <Image
            source={{ uri: book.imageUrl ?? undefined }}
            style={styles.image}
            resizeMode="cover"
          />
        </Pressable>

        <View style={styles.info}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.author}>
              {book.authorBooks.map(ab => ab.author.nameInKor).join(', ')}
            </Text>
            <Text style={styles.publisher}>
              {book.publisher}
              {book.publisher && formattedPublicationDate && ' · '}
              {formattedPublicationDate}
            </Text>
          </View>

          <View style={styles.statsContainer}>
            <Pressable style={styles.statButton}>
              <View style={styles.statIconWrapper}>
                <Icon name="heart" size={16} color={colors.gray[600]} />
              </View>
              <Text style={styles.statValue}>{book.likeCount}</Text>
            </Pressable>
            <View style={styles.statDivider} />
            <Pressable style={styles.statButton}>
              <View style={styles.statIconWrapper}>
                <Icon name="message-circle" size={16} color={colors.gray[600]} />
              </View>
              <Text style={styles.statValue}>{book.reviewCount}</Text>
            </Pressable>
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
  imageContainer: {
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
    justifyContent: 'space-between',
  },
  titleSection: {
    gap: spacing.xs,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.gray[900],
    lineHeight: 30,
  },
  author: {
    fontSize: 16,
    color: colors.gray[700],
  },
  publisher: {
    fontSize: 14,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
  },
  statButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  statIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  statDivider: {
    width: 1,
    height: '50%',
    alignSelf: 'center',
    backgroundColor: colors.gray[200],
  },
  statValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray[700],
  },
  writeButton: {
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderColor: colors.gray[200],
  },
  writeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  writeButtonText: {
    fontSize: 15,
    color: colors.gray[700],
    fontWeight: '600',
  },
});
