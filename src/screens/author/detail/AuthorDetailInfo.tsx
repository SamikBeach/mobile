import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Pressable, Linking } from 'react-native';
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
import { AuthorAvatar } from '@/components/author/AuthorAvatar';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  authorId: number;
  onReviewPress: () => void;
}

export function AuthorDetailInfo({ authorId, onReviewPress }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionHeight = useSharedValue(140); // 초기 높이 값
  const fadeOpacity = useSharedValue(1);

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
      updateAuthorLikeQueryData({ authorId, isOptimistic: true });
    },
    onError: () => {
      if (author) {
        updateAuthorLikeQueryData({
          authorId,
          isOptimistic: false,
          currentStatus: {
            isLiked: author.isLiked,
            likeCount: author.likeCount,
          },
        });
      }
      Toast.show({
        type: 'error',
        text1: '좋아요 처리 중 오류가 발생했습니다.',
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

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
    descriptionHeight.value = withTiming(isExpanded ? 140 : 300, { duration: 300 });
    fadeOpacity.value = withTiming(isExpanded ? 1 : 0, { duration: 200 });
  };

  const animatedDescriptionStyle = useAnimatedStyle(() => {
    return {
      height: descriptionHeight.value,
      overflow: 'hidden',
    };
  });

  const fadeGradientStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeOpacity.value,
    };
  });

  const handleAvatarPress = () => {
    if (author && author.name) {
      Linking.openURL(`https://en.wikipedia.org/wiki/${author.name}`);
    }
  };

  if (isLoading || !author) {
    return <AuthorDetailInfoSkeleton />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Pressable onPress={handleAvatarPress}>
              <AuthorAvatar
                imageUrl={author.imageUrl}
                name={author.nameInKor}
                size={140}
                style={styles.avatar}
              />
            </Pressable>

            <View style={styles.actionsContainer}>
              <LikeButton
                isLiked={author.isLiked}
                likeCount={author.likeCount}
                onPress={handleLikePress}
              />
              <CommentButton commentCount={author.reviewCount} onPress={onReviewPress} />
            </View>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.nameSection}>
              <View style={styles.nameHeader}>
                <Text style={styles.koreanName}>{author.nameInKor}</Text>
              </View>
              <View style={styles.nameRow}>
                <Text style={styles.englishName}>{author.name}</Text>
                <View style={styles.lifespanBadge}>
                  <Text style={styles.lifespanText}>
                    {formatAuthorLifespan(
                      author.bornDate,
                      author.bornDateIsBc,
                      author.diedDate,
                      author.diedDateIsBc,
                    )}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.badgeContainer}>
              {author.genre && (
                <View style={styles.genreBadge}>
                  <Text style={styles.genreText}>
                    {author.genre.genreInKor || author.genre.genreInKor}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {author.description && (
          <View style={styles.descriptionContainer}>
            <Animated.View style={[styles.descriptionContent, animatedDescriptionStyle]}>
              <Text style={styles.description}>{author.description}</Text>
              {!isExpanded && (
                <Animated.View style={[styles.fadeGradient, fadeGradientStyle]}>
                  <LinearGradient
                    colors={['rgba(249, 250, 251, 0)', 'rgba(249, 250, 251, 0.95)']}
                    style={styles.gradient}
                  />
                </Animated.View>
              )}
            </Animated.View>

            {author.description.length > 100 && (
              <TouchableOpacity
                style={styles.expandButton}
                onPress={toggleDescription}
                activeOpacity={0.7}>
                <Text style={styles.expandButtonText}>{isExpanded ? '접기' : '더보기'}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  avatarContainer: {
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    borderRadius: 70,
    backgroundColor: colors.gray[100],
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chatButtonActive: {
    backgroundColor: colors.gray[50],
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[700],
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.sm,
  },
  nameSection: {
    gap: spacing.xs,
  },
  nameHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
  },
  koreanName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.gray[900],
  },
  englishName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[700],
  },
  lifespanBadge: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  lifespanText: {
    fontSize: 13,
    color: colors.gray[600],
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  genreBadge: {
    backgroundColor: colors.blue[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  genreText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.blue[600],
  },
  descriptionContainer: {
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  descriptionContent: {
    position: 'relative',
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.gray[700],
  },
  fadeGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 40,
  },
  expandButton: {
    alignSelf: 'stretch',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  expandButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.blue[600],
  },
  mobileButtonContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  mobileChatButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: '100%',
  },
});
