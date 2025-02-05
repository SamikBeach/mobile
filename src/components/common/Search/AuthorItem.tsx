import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text } from '@/components/common';
import { colors, spacing } from '@/styles/theme';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { Author } from '@/types/author';
import { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { TabParamList } from '@/navigation/types';

interface Props {
  author: Author;
  onClose: () => void;
  onDelete?: () => void;
  searchValue?: string;
}

type AuthorItemNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList>,
  BottomTabNavigationProp<TabParamList>
>;

export default function AuthorItem({ author, onClose, onDelete }: Props) {
  const navigation = useNavigation<AuthorItemNavigationProp>();

  const handlePress = () => {
    onClose();
    navigation.navigate('AuthorDetail', { authorId: author.id });
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
          <View style={styles.stat}>
            <Icon name="thumbs-up" size={12} color={colors.gray[400]} />
            <Text style={styles.statText}>{author.likeCount}</Text>
          </View>
          <View style={styles.stat}>
            <Icon name="message-square" size={12} color={colors.gray[400]} />
            <Text style={styles.statText}>{author.reviewCount}</Text>
          </View>
          <View style={styles.stat}>
            <Icon name="book" size={12} color={colors.gray[400]} />
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
    padding: spacing.lg,
    backgroundColor: colors.white,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[900],
  },
  originalName: {
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
