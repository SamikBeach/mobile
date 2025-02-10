import React from 'react';
import { View, StyleSheet, Image, Pressable, Linking } from 'react-native';
import { Text } from '@/components/common/Text';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { formatAuthorLifespan } from '@/utils/date';
import { useMutation, useQuery } from '@tanstack/react-query';
import { authorApi } from '@/apis/author';
import { useAuthorQueryData } from '@/hooks/useAuthorQueryData';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import Toast from 'react-native-toast-message';
import { AuthorDetailInfoSkeleton } from '@/components/common/Skeleton/AuthorDetailInfoSkeleton';
import { LikeButton } from '@/components/common/LikeButton';
import { CommentButton } from '@/components/common/CommentButton';

interface Props {
  authorId: number;
  onReviewPress: () => void;
}

export function AuthorDetailInfo({ authorId, onReviewPress }: Props) {
  const { data: author, isLoading } = useQuery({
    queryKey: ['author', authorId],
    queryFn: () => authorApi.getAuthorDetail(authorId),
    select: response => response.data,
  });

  const { updateAuthorLikeQueryData } = useAuthorQueryData();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const currentUser = useCurrentUser();

  const { mutate: toggleLike } = useMutation({
    mutationFn: () => authorApi.toggleAuthorLike(authorId),
    onMutate: async () => {
      updateAuthorLikeQueryData({
        authorId: authorId,
        isOptimistic: true,
      });
    },
    onError: () => {
      updateAuthorLikeQueryData({
        authorId: authorId,
        isOptimistic: false,
        currentStatus: {
          isLiked: author?.isLiked ?? false,
          likeCount: author?.likeCount ?? 0,
        },
      });
      Toast.show({
        type: 'error',
        text1: '좋아요 처리에 실패했습니다.',
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
    if (author?.name) {
      Linking.openURL(`https://en.wikipedia.org/wiki/${author.name}`);
    }
  };

  if (isLoading) {
    return <AuthorDetailInfoSkeleton />;
  }

  if (!author) return null;

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
              <LikeButton
                isLiked={author.isLiked}
                likeCount={author.likeCount}
                onPress={handleLikePress}
              />
              <CommentButton commentCount={author.reviewCount} onPress={onReviewPress} />
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
  imageWrapper: {},
  image: {
    width: 140,
    height: 140,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
  },
  info: {
    flex: 1,
    paddingVertical: spacing.xs,
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
    gap: spacing.xs,
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
