import React from 'react';
import { View, Image, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/common/Text';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Book } from '@/types/book';
import type { RootStackParamList } from '@/navigation/types';
import { colors, spacing, borderRadius, shadows } from '@/styles/theme';

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
        <View style={styles.meta}>
          <Text style={styles.author} numberOfLines={1}>
            {book.authorBooks.map(author => author.author.nameInKor).join(', ')}
          </Text>
          <Text style={styles.publisher} numberOfLines={1}>
            {book.publisher}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.md,
    ...shadows.sm,
  },
  image: {
    width: 90,
    height: 130,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray[100],
  },
  content: {
    flex: 1,
    gap: spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
    lineHeight: 22,
  },
  meta: {
    gap: spacing.xs,
  },
  author: {
    fontSize: 14,
    color: colors.gray[700],
  },
  publisher: {
    fontSize: 14,
    color: colors.gray[500],
  },
}); 