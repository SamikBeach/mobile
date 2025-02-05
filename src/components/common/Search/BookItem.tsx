import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text } from '@/components/common';
import { colors, spacing } from '@/styles/theme';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useNavigationContainerRef } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { Book } from '@/types/book';

interface Props {
  book: Book;
  onClose: () => void;
  onDelete?: () => void;
  searchValue?: string;
}

export default function BookItem({ book, onClose, onDelete, searchValue = '' }: Props) {
  const navigation = useNavigation();

  const handlePress = () => {
    onClose();
    navigation.navigate('BookDetail', { bookId: book.id });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image source={{ uri: book.imageUrl ?? undefined }} style={styles.image} />
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
          <View style={styles.stat}>
            <Icon name="thumbs-up" size={12} color={colors.gray[400]} />
            <Text style={styles.statText}>{book.likeCount}</Text>
          </View>
          <View style={styles.stat}>
            <Icon name="message-square" size={12} color={colors.gray[400]} />
            <Text style={styles.statText}>{book.reviewCount}</Text>
          </View>
          <View style={styles.stat}>
            <Icon name="book" size={12} color={colors.gray[400]} />
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
    padding: spacing.lg,
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
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[900],
  },
  author: {
    fontSize: 12,
    color: colors.gray[500],
    marginTop: 4,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: colors.gray[400],
  },
  deleteButton: {
    padding: spacing.sm,
    marginRight: -spacing.sm,
  },
});
