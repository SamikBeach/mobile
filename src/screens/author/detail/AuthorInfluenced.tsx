import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Linking, Image } from 'react-native';
import { Text } from '@/components/common/Text';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { useQuery } from '@tanstack/react-query';
import { authorApi } from '@/apis/author';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { AuthorInfluencedSkeleton } from '@/components/common/Skeleton/AuthorInfluencedSkeleton';
import { formatAuthorLifespan } from '@/utils/date';
import { InfluencedAuthor } from '@/types/author';
import Icon from 'react-native-vector-icons/Feather';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  interpolate,
} from 'react-native-reanimated';

interface Props {
  authorId: number;
  authorName: string;
}

function InfluencedAuthorItem({
  author,
  onPress,
}: {
  author: InfluencedAuthor;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.authorItem} onPress={onPress}>
      <Image
        source={{ uri: author.imageUrl ?? undefined }}
        style={styles.authorImage}
        resizeMode="cover"
      />
      <View style={styles.authorInfo}>
        <View style={styles.authorNameRow}>
          <Text style={styles.authorName}>{author.nameInKor}</Text>
          {author.isWikiData && (
            <View style={styles.wikiTag}>
              <Text style={styles.wikiTagText}>Wikipedia</Text>
            </View>
          )}
        </View>
        <Text style={styles.authorLifespan}>
          {formatAuthorLifespan(
            author.bornDate,
            author.bornDateIsBc,
            author.diedDate,
            author.diedDateIsBc,
          )}
        </Text>
      </View>
    </Pressable>
  );
}

export function AuthorInfluenced({ authorId, authorName }: Props) {
  const [isInfluencedExpanded, setIsInfluencedExpanded] = useState(false);
  const [isInfluencedByExpanded, setIsInfluencedByExpanded] = useState(false);

  const influencedRotation = useSharedValue(0);
  const influencedByRotation = useSharedValue(0);

  const influencedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${interpolate(influencedRotation.value, [0, 1], [0, 180])}deg` }],
    };
  });

  const influencedByIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${interpolate(influencedByRotation.value, [0, 1], [0, 180])}deg` }],
    };
  });

  const toggleInfluenced = () => {
    influencedRotation.value = withTiming(isInfluencedExpanded ? 0 : 1, {
      duration: 300,
    });
    setIsInfluencedExpanded(!isInfluencedExpanded);
  };

  const toggleInfluencedBy = () => {
    influencedByRotation.value = withTiming(isInfluencedByExpanded ? 0 : 1, {
      duration: 300,
    });
    setIsInfluencedByExpanded(!isInfluencedByExpanded);
  };

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { data: influenced = [], isLoading: isInfluencedLoading } = useQuery({
    queryKey: ['author-influenced', authorId],
    queryFn: () => authorApi.getInfluencedAuthors(authorId),
    select: response => response.data ?? [],
  });

  const { data: influencedBy = [], isLoading: isInfluencedByLoading } = useQuery({
    queryKey: ['author-influenced-by', authorId],
    queryFn: () => authorApi.getInfluencedByAuthors(authorId),
    select: response => response.data ?? [],
  });

  if (isInfluencedLoading || isInfluencedByLoading) {
    return <AuthorInfluencedSkeleton />;
  }

  const handleAuthorPress = (_author: InfluencedAuthor) => {
    if (_author.isWikiData) {
      Linking.openURL(`https://en.wikipedia.org/wiki/${_author.name}`);
      return;
    }
    navigation.push('AuthorDetail', { authorId: _author.id });
  };

  if (influenced.length === 0 && influencedBy.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {influenced.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{authorName}에게 영향을 준 작가</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{influenced.length}</Text>
            </View>
          </View>
          <Animated.View style={styles.authorList}>
            {influenced.slice(0, isInfluencedExpanded ? undefined : 2).map(_author => (
              <InfluencedAuthorItem
                key={_author.id}
                author={_author}
                onPress={() => handleAuthorPress(_author)}
              />
            ))}
          </Animated.View>
          {influenced.length > 2 && (
            <Pressable style={styles.expandButton} onPress={toggleInfluenced}>
              <View style={styles.expandButtonInner}>
                <View style={styles.expandButtonTextContainer}>
                  <Text style={styles.expandButtonText}>
                    {isInfluencedExpanded ? '접기' : '더보기'}
                  </Text>
                  <Animated.View style={influencedIconStyle}>
                    <Icon name="chevron-down" size={18} color={colors.gray[600]} />
                  </Animated.View>
                </View>
              </View>
            </Pressable>
          )}
        </View>
      )}

      {influencedBy.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{authorName}에게 영향을 받은 작가</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{influencedBy.length}</Text>
            </View>
          </View>
          <Animated.View style={styles.authorList}>
            {influencedBy.slice(0, isInfluencedByExpanded ? undefined : 2).map(_author => (
              <InfluencedAuthorItem
                key={_author.id}
                author={_author}
                onPress={() => handleAuthorPress(_author)}
              />
            ))}
          </Animated.View>
          {influencedBy.length > 2 && (
            <Pressable style={styles.expandButton} onPress={toggleInfluencedBy}>
              <View style={styles.expandButtonInner}>
                <View style={styles.expandButtonTextContainer}>
                  <Text style={styles.expandButtonText}>
                    {isInfluencedByExpanded ? '접기' : '더보기'}
                  </Text>
                  <Animated.View style={influencedByIconStyle}>
                    <Icon name="chevron-down" size={18} color={colors.gray[600]} />
                  </Animated.View>
                </View>
              </View>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  countBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    backgroundColor: colors.gray[100],
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray[600],
  },
  authorList: {
    gap: 0,
  },
  authorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
  },
  authorInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray[900],
  },
  authorLifespan: {
    fontSize: 13,
    color: colors.gray[500],
  },
  wikiTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    backgroundColor: colors.blue[50],
    borderRadius: borderRadius.sm,
  },
  wikiTagText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.blue[600],
  },
  expandButton: {
    width: '100%',
  },
  expandButtonInner: {
    alignItems: 'center',
    position: 'relative',
    height: 44,
    justifyContent: 'center',
  },
  expandButtonLine: {
    display: 'none',
  },
  expandButtonTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
  },
  expandButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray[600],
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  expandIcon: {
    transform: [{ rotate: '0deg' }],
  },
  expandIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
});
