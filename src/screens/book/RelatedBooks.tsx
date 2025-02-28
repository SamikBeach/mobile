import React from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { Text } from '@/components/common/Text';
import { useQuery } from '@tanstack/react-query';
import { bookApi } from '@/apis/book';
import { colors, spacing } from '@/styles/theme';
import { BookCard } from '@/components/book/BookCard';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, RouteProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { Header } from '@/components/common/Header';
import { Empty } from '@/components/common/Empty';
import { BookListSkeleton } from '@/components/common/Skeleton/BookListSkeleton';

type RelatedBooksRouteProp = RouteProp<RootStackParamList, 'RelatedBooks'>;

export function RelatedBooks() {
  const route = useRoute<RelatedBooksRouteProp>();
  const { bookId } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { data: books = [], isLoading } = useQuery({
    queryKey: ['book-related', bookId],
    queryFn: () => bookApi.getAllRelatedBooks(bookId),
    select: response => response.data,
  });

  const handleBookPress = (id: number) => {
    navigation.navigate('BookDetail', { bookId: id });
  };

  const renderItem = ({ item }) => (
    <Pressable onPress={() => handleBookPress(item.id)}>
      <BookCard book={item} />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Header title="연관된 책" />
      
      {isLoading ? (
        <BookListSkeleton />
      ) : books.length === 0 ? (
        <Empty icon="book" message="연관된 책이 없습니다" />
      ) : (
        <FlatList
          data={books}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  list: {
    padding: spacing.lg,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
}); 