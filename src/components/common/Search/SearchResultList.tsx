import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '@/components/common';
import { colors, spacing } from '@/styles/theme';
import BookItem from './BookItem';
import AuthorItem from './AuthorItem';
import { Book } from '@/types/book';
import { Author } from '@/types/author';

interface Props {
  books: Book[];
  authors: Author[];
  onClose: () => void;
  searchValue: string;
}

export default function SearchResultList({ books, authors, onClose, searchValue }: Props) {
  return (
    <ScrollView style={styles.container}>
      {books.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>도서</Text>
          {books.map(book => (
            <BookItem key={book.id} book={book} onClose={onClose} searchValue={searchValue} />
          ))}
        </View>
      )}

      {authors.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>작가</Text>
          {authors.map(author => (
            <AuthorItem
              key={author.id}
              author={author}
              onClose={onClose}
              searchValue={searchValue}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    paddingVertical: spacing.sm,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray[500],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
});
