import React from 'react';
import { View, Image, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/common/Text';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Book } from '@/types/book';
import type { RootStackParamList } from '@/navigation/types';
import { colors, spacing, borderRadius, shadows } from '@/styles/theme';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/Feather';

interface Props {
  book: Book;
  size?: 'medium' | 'small' | 'xsmall';
  showPublisher?: boolean;
  showPublicationDate?: boolean;
}

export function BookItem({
  book,
  size = 'medium',
  showPublisher = false,
  showPublicationDate = false,
}: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    navigation.push('BookDetail', { bookId: book.id });
  };

  const imageSize = {
    medium: { width: 140, height: 200 },
    small: { width: 110, height: 160 },
    xsmall: { width: 90, height: 130 },
  }[size];

  return (
    <Pressable onPress={handlePress}>
      <View style={[styles.container, { width: imageSize.width }]}>
        <Image
          source={{ uri: book.imageUrl ?? undefined }}
          style={[styles.image, imageSize]}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={[styles.title, size !== 'medium' && styles.smallTitle]} numberOfLines={2}>
            {book.title}
          </Text>
          {showPublisher && book.publisher && (
            <Text style={styles.publisher} numberOfLines={1}>
              {book.publisher}
            </Text>
          )}
          {showPublicationDate && book.publicationDate && (
            <Text style={styles.date}>{format(new Date(book.publicationDate), 'yyyy.MM')}</Text>
          )}
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Icon name="thumbs-up" size={12} color={colors.gray[500]} />
              <Text style={styles.statText}>{book.likeCount}</Text>
            </View>
            <View style={styles.stat}>
              <Icon name="message-square" size={12} color={colors.gray[500]} />
              <Text style={styles.statText}>{book.reviewCount}</Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  image: {
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
  },
  info: {
    gap: spacing.xs,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray[900],
    lineHeight: 20,
  },
  smallTitle: {
    fontSize: 14,
  },
  publisher: {
    fontSize: 13,
    color: colors.gray[500],
  },
  date: {
    fontSize: 13,
    color: colors.gray[500],
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
    fontSize: 12,
    color: colors.gray[500],
  },
});
