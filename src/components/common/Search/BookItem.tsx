import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@/components/common';
import { colors, spacing } from '@/styles/theme';
import Icon from 'react-native-vector-icons/Feather';
import { Book } from '@/types/book';
import { BookImage } from '@/components/book/BookImage';

interface Props {
  book: Book;
  onClose: () => void;
  onDelete?: () => void;
  searchValue?: string;
  onPress?: () => void;
}

export default function BookItem({ book, onClose, onDelete, onPress }: Props) {
  const handlePress = () => {
    onClose();
    onPress?.();
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <BookImage imageUrl={book.imageUrl} size="md" />
      <View style={styles.content}>
        <View>
          <Text style={styles.title} numberOfLines={1}>
            {book.title}
          </Text>
          <Text style={styles.author} numberOfLines={1}>
            {book.authorBooks.map(ab => ab.author.nameInKor).join(', ')}
          </Text>
        </View>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Icon name="thumbs-up" size={13} color={colors.gray[400]} />
            <Text style={styles.statText}>{book.likeCount}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Icon name="message-square" size={13} color={colors.gray[400]} />
            <Text style={styles.statText}>{book.reviewCount}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Icon name="book" size={13} color={colors.gray[400]} />
            <Text style={styles.statText}>{book.totalTranslationCount}</Text>
          </View>
        </View>
      </View>
      {onDelete && (
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Icon name="x" size={16} color={colors.gray[400]} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    backgroundColor: colors.white,
  },
  image: {
    width: 64,
    height: 96,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.gray[900],
  },
  author: {
    fontSize: 14,
    color: colors.gray[500],
    marginTop: 4,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: colors.gray[200],
    marginHorizontal: spacing.sm,
  },
  statText: {
    fontSize: 13,
    color: colors.gray[500],
  },
  deleteButton: {
    padding: spacing.sm,
    marginRight: -spacing.sm,
  },
});
