import React from 'react';
import { View, StyleSheet, Image, Pressable, Linking } from 'react-native';
import { Text } from '@/components/common/Text';
import Icon from 'react-native-vector-icons/Feather';
import { colors, spacing, borderRadius, shadows } from '@/styles/theme';
import { formatAuthorLifespan } from '@/utils/date';
import { useMutation } from '@tanstack/react-query';
import { authorApi } from '@/apis/author';
import type { Author } from '@/types/author';
import { useAuthorQueryData } from '@/hooks/useAuthorQueryData';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface Props {
  author: Author;
  onReviewPress: () => void;
}

export function AuthorDetailInfo({ author, onReviewPress }: Props) {
  const { updateAuthorLikeQueryData } = useAuthorQueryData();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const currentUser = useCurrentUser();

  const { mutate: toggleLike } = useMutation({
    mutationFn: () => authorApi.toggleAuthorLike(author.id),
    onMutate: async () => {
      updateAuthorLikeQueryData({
        authorId: author.id,
        isOptimistic: true,
      });
    },
    onError: () => {
      updateAuthorLikeQueryData({
        authorId: author.id,
        isOptimistic: false,
        currentStatus: {
          isLiked: author.isLiked,
          likeCount: author.likeCount,
        },
      });
    },
  });

  const handleLikePress = () => {
    if (!currentUser) {
      navigation.navigate('Login');
      return;
    }
    toggleLike();
  };

  const handleWikipediaPress = () => {
    if (author.name) {
      Linking.openURL(`https://en.wikipedia.org/wiki/${author.name}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleWikipediaPress} style={styles.imageWrapper}>
          <Image
            source={{ uri: author.imageUrl ?? undefined }}
            style={styles.image}
            resizeMode="cover"
          />
        </Pressable>

        <View style={styles.info}>
          <View style={styles.infoContent}>
            <View style={styles.titleSection}>
              <Text style={styles.name}>{author.nameInKor?.trim()}</Text>
              <Text style={styles.originalName}>{author.name?.trim()}</Text>
              <Text style={styles.lifespan}>
                {formatAuthorLifespan(
                  author.bornDate,
                  author.bornDateIsBc,
                  author.diedDate,
                  author.diedDateIsBc,
                )}
              </Text>
              <Text style={styles.source}>정보제공: 위키피디아</Text>
            </View>

            <View style={styles.stats}>
              <Pressable style={styles.statItem} onPress={handleLikePress}>
                <Icon
                  name={author.isLiked ? 'thumbs-up' : 'thumbs-up'}
                  size={14}
                  color={author.isLiked ? colors.red[500] : colors.gray[500]}
                />
                <Text style={[styles.statText, author.isLiked && { color: colors.red[500] }]}>
                  {author.likeCount}
                </Text>
              </Pressable>
              <View style={styles.statDivider} />
              <Pressable style={styles.statItem} onPress={onReviewPress}>
                <Icon name="message-circle" size={14} color={colors.gray[500]} />
                <Text style={styles.statText}>{author.reviewCount}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {author.description && (
        <Text style={styles.description} numberOfLines={3}>
          {author.description}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  imageWrapper: {
    ...shadows.md,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
  },
  info: {
    flex: 1,
    height: 120,
  },
  infoContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleSection: {
    gap: spacing.xs,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.gray[900],
    lineHeight: 24,
  },
  originalName: {
    fontSize: 15,
    color: colors.gray[600],
  },
  lifespan: {
    fontSize: 14,
    color: colors.gray[500],
  },
  source: {
    fontSize: 13,
    color: colors.gray[400],
  },
  description: {
    fontSize: 15,
    color: colors.gray[700],
    lineHeight: 22,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 12,
    backgroundColor: colors.gray[200],
    marginHorizontal: spacing.sm,
  },
  statText: {
    fontSize: 14,
    color: colors.gray[600],
  },
});
