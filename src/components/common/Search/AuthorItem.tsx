import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text } from '@/components/common';
import { colors, spacing } from '@/styles/theme';
import Icon from 'react-native-vector-icons/Feather';
import { Author } from '@/types/author';

interface Props {
  author: Author;
  onClose: () => void;
  onDelete?: () => void;
  searchValue?: string;
  onPress?: () => void;
}

export default function AuthorItem({ author, onClose, onDelete, onPress }: Props) {
  const handlePress = () => {
    onClose();
    onPress?.();
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image source={{ uri: author.imageUrl ?? undefined }} style={styles.image} />
      <View style={styles.content}>
        <View>
          <Text style={styles.name} numberOfLines={1}>
            {author.nameInKor.trim()}
          </Text>
          <Text style={styles.originalName} numberOfLines={1}>
            {author.name.trim()}
          </Text>
        </View>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Icon name="thumbs-up" size={13} color={colors.gray[400]} />
            <Text style={styles.statText}>{author.likeCount}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Icon name="message-square" size={13} color={colors.gray[400]} />
            <Text style={styles.statText}>{author.reviewCount}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Icon name="book" size={13} color={colors.gray[400]} />
            <Text style={styles.statText}>{author.bookCount}</Text>
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
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.gray[900],
  },
  originalName: {
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
