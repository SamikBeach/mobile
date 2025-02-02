import React from 'react';
import { View, Image, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/common/Text';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Book } from '@/types/book';
import type { RootStackParamList } from '@/navigation/types';

interface Props {
  book: Book;
}

export function BookItem({ book }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Pressable
      style={styles.container}
      onPress={() => navigation.navigate('BookDetail', { bookId: book.id })}
    >
      <Image
        source={{ uri: book.imageUrl ?? undefined }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {book.authorBooks.map(author => author.author.nameInKor).join(', ')}
        </Text>
        <Text style={styles.publisher} numberOfLines={1}>
          {book.publisher}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    gap: 16,
  },
  image: {
    width: 80,
    height: 120,
    borderRadius: 4,
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  author: {
    fontSize: 14,
    color: '#4B5563',
  },
  publisher: {
    fontSize: 14,
    color: '#6B7280',
  },
}); 