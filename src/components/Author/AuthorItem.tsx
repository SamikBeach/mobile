import React from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import { Text } from '@/components/common/Text';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import type { RootStackParamList } from '@/navigation/types';
import { colors, spacing, borderRadius } from '@/styles/theme';

interface Props {
  author: {
    id: number;
    name: string | null;
    nameInKor: string | null;
    imageUrl: string | null;
    description: string | null;
    era?: {
      eraInKor: string;
    };
    bookCount: number;
    likeCount: number;
    isLiked: boolean;
    reviewCount?: number;
    translationCount?: number;
  };
}

export function AuthorItem({ author }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    navigation.navigate('AuthorDetail', { authorId: author.id });
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && { opacity: 0.8 }]}
      onPress={handlePress}>
      <View style={styles.imageWrapper}>
        {author.imageUrl ? (
          <Image source={{ uri: author.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.defaultImage}>
            <Icon name="user" size={24} color={colors.gray[400]} />
          </View>
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.textContent}>
          <View style={styles.header}>
            <View style={styles.nameSection}>
              <Text style={styles.name}>{author.nameInKor?.trim()}</Text>
              <Text style={styles.originalName}>{author.name?.trim()}</Text>
            </View>
            {author.era && (
              <View style={styles.eraBadge}>
                <Text style={styles.eraText}>{author.era.eraInKor}</Text>
              </View>
            )}
          </View>
          <Text style={styles.description} numberOfLines={2}>
            {author.description}
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
            <Text style={styles.statText}>{author.reviewCount ?? 0}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Icon name="book" size={13} color={colors.gray[400]} />
            <Text style={styles.statText}>{author.bookCount}</Text>
          </View>
          {author.translationCount !== undefined && (
            <>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <Icon name="edit-2" size={13} color={colors.gray[400]} />
                <Text style={styles.statText}>{author.translationCount}</Text>
              </View>
            </>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: spacing.lg,
    gap: spacing.lg,
    paddingVertical: spacing.xl,
  },
  imageWrapper: {
    width: 85,
    height: 85,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  defaultImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  textContent: {
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameSection: {
    flex: 1,
    marginRight: spacing.sm,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
    lineHeight: 22,
  },
  originalName: {
    fontSize: 14,
    color: colors.gray[600],
  },
  eraBadge: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  eraText: {
    fontSize: 12,
    color: colors.primary[700],
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: colors.gray[600],
    lineHeight: 20,
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
