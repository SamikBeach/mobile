import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '@/components/common';
import { colors, spacing } from '@/styles/theme';
import BookItem from './BookItem';
import AuthorItem from './AuthorItem';
import { Book } from '@/types/book';
import { Author } from '@/types/author';
import { useMutation } from '@tanstack/react-query';
import { userApi } from '@/apis/user';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { RootStackParamList } from '@/navigation/types';

interface Props {
  books: Book[];
  authors: Author[];
  onClose: () => void;
  searchValue: string;
}

export default function SearchResultList({ books, authors, onClose, searchValue }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();

  const { mutate: saveSearch } = useMutation({
    mutationFn: (params: { bookId?: number; authorId?: number }) => userApi.saveSearch(params),
    onError: () => {
      console.error('Failed to save search history');
    },
    onSuccess: () => {
      // 검색 기록이 변경되었으므로 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['recentSearches'] });
    },
  });

  const handleItemClick = ({ bookId, authorId }: { bookId?: number; authorId?: number }) => {
    saveSearch({ bookId, authorId });

    if (bookId) {
      navigation.navigate('BookDetail', { bookId });
    } else if (authorId) {
      navigation.navigate('AuthorDetail', { authorId });
    }
    onClose();
  };

  return (
    <ScrollView style={styles.container}>
      {books.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>도서</Text>
          {books.map(book => (
            <BookItem
              key={book.id}
              book={book}
              onClose={onClose}
              searchValue={searchValue}
              onPress={() => handleItemClick({ bookId: book.id })}
            />
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
              onPress={() => handleItemClick({ authorId: author.id })}
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
