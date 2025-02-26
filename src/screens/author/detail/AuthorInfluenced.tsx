import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Linking, Image, ListRenderItem } from 'react-native';
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
import Animated, { Layout, Easing } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Feather';

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
  const lifespan = formatAuthorLifespan(
    author.bornDate,
    author.bornDateIsBc,
    author.diedDate,
    author.diedDateIsBc,
  );

  return (
    <Pressable style={styles.authorItem} onPress={onPress}>
      {author.isWikiData ? (
        <View style={[styles.authorImage, styles.authorImageFallback]}>
          <Icon name="user" size={24} color={colors.gray[400]} />
        </View>
      ) : (
        <Image
          source={{ uri: author.imageUrl ?? undefined }}
          style={styles.authorImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.authorInfo}>
        <View style={styles.authorNameRow}>
          <Text style={styles.authorName}>{author.nameInKor}</Text>
          {author.isWikiData && (
            <View style={styles.wikiTag}>
              <Text style={styles.wikiTagText}>Wikipedia</Text>
            </View>
          )}
        </View>
        {lifespan && <Text style={styles.authorLifespan}>{lifespan}</Text>}
      </View>
    </Pressable>
  );
}

export function AuthorInfluenced({ authorId, authorName }: Props) {
  const [isInfluencedExpanded, setIsInfluencedExpanded] = useState(false);
  const [isInfluencedByExpanded, setIsInfluencedByExpanded] = useState(false);

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

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const animationConfig = Layout.duration(300).easing(Easing.inOut(Easing.ease));

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

  const renderAuthorItem: ListRenderItem<InfluencedAuthor> = ({ item }) => (
    <Animated.View layout={animationConfig}>
      <InfluencedAuthorItem author={item} onPress={() => handleAuthorPress(item)} />
    </Animated.View>
  );

  const renderFooter = (isExpanded: boolean, onPress: () => void, length: number) => {
    if (length <= 2) return null;
    return (
      <Pressable style={styles.expandButton} onPress={onPress}>
        <Text style={styles.expandButtonText}>{isExpanded ? '접기' : '더보기'}</Text>
      </Pressable>
    );
  };

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
          <Animated.FlatList<InfluencedAuthor>
            data={influenced.slice(0, isInfluencedExpanded ? undefined : 2)}
            renderItem={renderAuthorItem}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.authorList}
            layout={animationConfig}
            ListFooterComponent={() =>
              renderFooter(
                isInfluencedExpanded,
                () => setIsInfluencedExpanded(!isInfluencedExpanded),
                influenced.length,
              )
            }
          />
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
          <Animated.FlatList<InfluencedAuthor>
            data={influencedBy.slice(0, isInfluencedByExpanded ? undefined : 2)}
            renderItem={renderAuthorItem}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.authorList}
            layout={animationConfig}
            ListFooterComponent={() =>
              renderFooter(
                isInfluencedByExpanded,
                () => setIsInfluencedByExpanded(!isInfluencedByExpanded),
                influencedBy.length,
              )
            }
          />
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
    gap: spacing.xs,
  },
  authorItem: {
    height: 56,
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
    alignSelf: 'center',
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
  },
  expandButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray[600],
  },
  authorImageFallback: {
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
});
