import React from 'react';
import { View, Image, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/common/Text';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import type { Book } from '@/types/book';
import type { RootStackParamList } from '@/navigation/types';
import { colors, spacing, borderRadius, shadows } from '@/styles/theme';

interface Props {
  book: Book;
}

export function BookItem({ book }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    navigation.navigate('BookDetail', { bookId: book.id });
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && { opacity: 0.8 }]}
      onPress={handlePress}>
      <Image source={{ uri: book.imageUrl ?? undefined }} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <View style={styles.textContent}>
          <Text style={styles.title} numberOfLines={2}>
            {book.title}
          </Text>
          <Text style={styles.author} numberOfLines={1}>
            {book.authorBooks.map(author => author.author.nameInKor).join(', ')}
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.lg,
    ...shadows.sm,
  },
  image: {
    width: 85,
    height: 120,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  textContent: {
    gap: spacing.xs,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
    lineHeight: 22,
  },
  author: {
    fontSize: 14,
    color: colors.gray[600],
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
});
