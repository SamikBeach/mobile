import React from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import { Text } from '@/components/common/Text';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import type { Author } from '@/types/author';
import type { AuthorStackParamList } from '@/navigation/types';
import { colors, spacing, borderRadius, shadows } from '@/styles/theme';

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
  };
}

export function AuthorItem({ author }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<AuthorStackParamList, 'AuthorDetail'>>();

  const handlePress = () => {
    navigation.navigate('AuthorDetail', { authorId: author.id });
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
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
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Icon name="book" size={14} color={colors.gray[500]} />
            <Text style={styles.statText}>{author.bookCount}</Text>
          </View>
          <View style={styles.stat}>
            <Icon 
              name={author.isLiked ? "heart" : "heart"} 
              size={14} 
              color={author.isLiked ? colors.primary[500] : colors.gray[500]} 
            />
            <Text style={styles.statText}>{author.likeCount}</Text>
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
    padding: spacing.md,
    gap: spacing.md,
    ...shadows.sm,
  },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    ...shadows.sm,
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
    marginBottom: 2,
  },
  originalName: {
    fontSize: 13,
    color: colors.gray[500],
  },
  eraBadge: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
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
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
    fontSize: 13,
    color: colors.gray[700],
  },
}); 