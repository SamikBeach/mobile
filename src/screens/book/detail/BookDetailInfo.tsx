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
        <Pressable onPress={handleBookClick}>
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

          <View style={styles.actions}>
            <View style={styles.stats}>
              <Button variant="outline" style={styles.statButton}>
                <Icon name="heart" size={16} color={colors.gray[500]} />
                <Text style={styles.statText}>{book.likeCount}</Text>
              </Button>
              <Button variant="outline" style={styles.statButton}>
                <Icon name="message-circle" size={16} color={colors.gray[500]} />
                <Text style={styles.statText}>{book.reviewCount}</Text>
              </Button>
            </View>
            <Button style={styles.writeButton}>
              <Icon name="edit-2" size={16} color={colors.white} />
              <Text style={styles.writeButtonText}>리뷰 쓰기</Text>
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    gap: spacing.lg,
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
    fontSize: 20,
    fontWeight: '600',
    color: colors.gray[900],
  },
  author: {
    fontSize: 15,
    color: colors.gray[700],
  },
  publisher: {
    fontSize: 14,
    color: colors.gray[500],
  },
  actions: {
    gap: spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statButton: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  statText: {
    fontSize: 14,
    color: colors.gray[700],
  },
  writeButton: {
    flexDirection: 'row',
    gap: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  writeButtonText: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '500',
  },
}); 