import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text } from '@/components/common/Text';
import { useQuery } from '@tanstack/react-query';
import { bookApi } from '@/apis/book';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { format } from 'date-fns';

interface Props {
  bookId: number;
}

export function BookInfo({ bookId }: Props) {
  const { data: book } = useQuery({
    queryKey: ['book', bookId],
    queryFn: () => bookApi.getBookDetail(bookId),
    select: response => response.data,
  });

  if (!book) return null;

  const formattedPublicationDate = book.publicationDate
    ? format(new Date(book.publicationDate), 'yyyy년 M월 d일')
    : '';

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: book.imageUrl ?? undefined }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {book.title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {book.authorBooks.map(ab => ab.author.nameInKor).join(', ')} · {book.publisher} ·{' '}
          {formattedPublicationDate}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  image: {
    width: 28,
    height: 40,
    borderRadius: borderRadius.sm,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[900],
  },
  meta: {
    fontSize: 12,
    color: colors.gray[500],
  },
}); 