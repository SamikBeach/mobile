import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Text } from '@/components/common/Text';
import { useQuery } from '@tanstack/react-query';
import { authorApi } from '@/apis/author';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { InfluencedAuthor } from '@/types/author';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import Icon from 'react-native-vector-icons/Feather';
import { formatAuthorLifespan } from '@/utils/date';
import { Linking } from 'react-native';
import { InfluencedAuthorsSkeleton } from './InfluencedAuthorsSkeleton';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';

interface Props {
  authorId: number;
}

export function AuthorInfluenced({ authorId }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isInfluencedExpanded, setIsInfluencedExpanded] = useState(false);
  const [isInfluencedByExpanded, setIsInfluencedByExpanded] = useState(false);

  const { data: author } = useQuery({
    queryKey: ['author', authorId],
    queryFn: () => authorApi.getAuthorDetail(authorId),
    select: response => response.data,
  });

  const { data: influenced = [], isLoading: isInfluencedLoading } = useQuery({
    queryKey: ['author-influenced', authorId],
    queryFn: () => authorApi.getInfluencedAuthors(authorId),
    select: response => response.data,
  });

  const { data: influencedBy = [], isLoading: isInfluencedByLoading } = useQuery({
    queryKey: ['author-influenced-by', authorId],
    queryFn: () => authorApi.getInfluencedByAuthors(authorId),
    select: response => response.data,
  });

  if (isInfluencedLoading || isInfluencedByLoading || !author) {
    return <InfluencedAuthorsSkeleton />;
  }

  if (influenced.length === 0 && influencedBy.length === 0) {
    return null;
  }

  const handleAuthorPress = (_author: InfluencedAuthor) => {
    if (_author.isWikiData) {
      Linking.openURL(`https://en.wikipedia.org/wiki/${_author.name}`);
    } else {
      navigation.navigate('AuthorDetail', { authorId: _author.id });
    }
  };

  return (
    <View style={styles.container}>
      {influenced.length > 0 && (
        <View style={styles.section}>
          <View style={styles.header}>
            <View style={styles.titleSection}>
              <Text style={styles.title} numberOfLines={2}>
                {author.nameInKor.trim()}에게 영향을 준 작가
              </Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{influenced.length}</Text>
              </View>
            </View>
            {influenced.length > 3 && (
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setIsInfluencedExpanded(!isInfluencedExpanded)}>
                <Text style={styles.toggleButtonText}>
                  {isInfluencedExpanded ? '접기' : '전체보기'}
                </Text>
                <Icon
                  name={isInfluencedExpanded ? 'chevron-down' : 'grid'}
                  size={16}
                  color={colors.gray[500]}
                />
              </TouchableOpacity>
            )}
          </View>

          <View style={[styles.authorGrid, { paddingHorizontal: spacing.lg }]}>
            {isInfluencedExpanded ? (
              <Animated.View layout={Layout.duration(300)} entering={FadeIn.duration(300)}>
                <FlatList
                  data={influenced}
                  keyExtractor={item => `influenced-${item.id}`}
                  renderItem={({ item }) => (
                    <InfluencedAuthorItem author={item} onPress={handleAuthorPress} />
                  )}
                />
              </Animated.View>
            ) : (
              <Animated.View layout={Layout.duration(300)} entering={FadeIn.duration(300)}>
                <FlatList
                  data={influenced.slice(0, 3)}
                  keyExtractor={item => `influenced-${item.id}`}
                  renderItem={({ item }) => (
                    <InfluencedAuthorItem author={item} onPress={handleAuthorPress} />
                  )}
                />
              </Animated.View>
            )}
          </View>
        </View>
      )}

      {influencedBy.length > 0 && (
        <View style={styles.section}>
          <View style={styles.header}>
            <View style={styles.titleSection}>
              <Text style={styles.title} numberOfLines={2}>
                {author.nameInKor.trim()}에게 영향을 받은 작가
              </Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{influencedBy.length}</Text>
              </View>
            </View>
            {influencedBy.length > 3 && (
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setIsInfluencedByExpanded(!isInfluencedByExpanded)}>
                <Text style={styles.toggleButtonText}>
                  {isInfluencedByExpanded ? '접기' : '전체보기'}
                </Text>
                <Icon
                  name={isInfluencedByExpanded ? 'chevron-down' : 'grid'}
                  size={16}
                  color={colors.gray[500]}
                />
              </TouchableOpacity>
            )}
          </View>

          <View style={[styles.influencedByGrid, { paddingHorizontal: spacing.lg }]}>
            {isInfluencedByExpanded ? (
              <Animated.View layout={Layout.duration(300)} entering={FadeIn.duration(300)}>
                <FlatList
                  data={influencedBy}
                  keyExtractor={item => `influenced-by-${item.id}`}
                  numColumns={1}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <InfluencedAuthorItem author={item} onPress={handleAuthorPress} />
                  )}
                />
              </Animated.View>
            ) : (
              <Animated.View layout={Layout.duration(300)} entering={FadeIn.duration(300)}>
                <FlatList
                  data={influencedBy.slice(0, 3)}
                  keyExtractor={item => `influenced-by-${item.id}`}
                  numColumns={1}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <InfluencedAuthorItem author={item} onPress={handleAuthorPress} />
                  )}
                />
              </Animated.View>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

function InfluencedAuthorItem({
  author,
  onPress,
}: {
  author: InfluencedAuthor;
  onPress: (author: InfluencedAuthor) => void;
}) {
  const lifespan = formatAuthorLifespan(
    author.bornDate,
    author.bornDateIsBc,
    author.diedDate,
    author.diedDateIsBc,
  );

  return (
    <TouchableOpacity style={styles.authorItem} onPress={() => onPress(author)} activeOpacity={0.7}>
      <Image
        source={{
          uri: author.imageUrl || 'https://via.placeholder.com/32',
        }}
        style={styles.authorImage}
      />
      <View style={styles.authorInfo}>
        <View style={styles.authorNameRow}>
          <Text style={styles.authorName} numberOfLines={1}>
            {author.nameInKor}
          </Text>
          {author.isWikiData && (
            <View style={styles.wikiTag}>
              <Text style={styles.wikiTagText}>Wikipedia</Text>
            </View>
          )}
        </View>
        {lifespan && <Text style={styles.authorLifespan}>{lifespan}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.md,
    gap: spacing.xl,
  },
  section: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
    flexShrink: 1,
  },
  badge: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.full,
    marginTop: 4,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray[600],
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: spacing.sm,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[500],
  },
  authorGrid: {
    gap: spacing.md,
  },
  influencedByGrid: {
    gap: spacing.md,
  },
  authorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray[100],
    shadowColor: colors.gray[400],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 1,
    elevation: 1,
    marginBottom: spacing.sm,
  },
  authorImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray[100],
  },
  authorInfo: {
    flex: 1,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[900],
  },
  authorLifespan: {
    fontSize: 12,
    color: colors.gray[500],
  },
  wikiTag: {
    backgroundColor: colors.blue[50],
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  wikiTagText: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.blue[600],
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[100],
    marginHorizontal: spacing.lg,
  },
});
