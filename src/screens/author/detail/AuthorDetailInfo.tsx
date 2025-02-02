import React from 'react';
import { View, StyleSheet, Image, Pressable, Linking } from 'react-native';
import { Text } from '@/components/common/Text';
import { useQuery } from '@tanstack/react-query';
import { authorApi } from '@/apis/author';
import Icon from 'react-native-vector-icons/Feather';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { formatAuthorLifespan } from '@/utils/date';
import { AuthorDetailInfoSkeleton } from '@/components/common/Skeleton/AuthorDetailInfoSkeleton';

interface Props {
  authorId: number;
}

export function AuthorDetailInfo({ authorId }: Props) {
  const { data: author, isLoading } = useQuery({
    queryKey: ['author', authorId],
    queryFn: () => authorApi.getAuthorDetail(authorId),
    select: response => response.data,
  });

  if (isLoading || !author) {
    return <AuthorDetailInfoSkeleton />;
  }

  const handleWikipediaPress = () => {
    if (author.name) {
      Linking.openURL(`https://en.wikipedia.org/wiki/${author.name}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleWikipediaPress}>
          <Image
            source={{ uri: author.imageUrl ?? undefined }}
            style={styles.image}
            resizeMode="cover"
          />
        </Pressable>

        <View style={styles.info}>
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
            <Text style={styles.source}>정보 제공: 위키피디아</Text>
          </View>

          <View style={styles.actions}>
            <Pressable style={styles.actionButton}>
              <Icon
                name="heart"
                size={20}
                color={author.isLiked ? colors.primary[500] : colors.gray[400]}
              />
              <Text style={styles.actionText}>{author.likeCount}</Text>
            </Pressable>
            <Pressable style={styles.actionButton}>
              <Icon name="message-circle" size={20} color={colors.gray[400]} />
              <Text style={styles.actionText}>{author.reviewCount}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleSection: {
    gap: spacing.xs,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.gray[900],
  },
  originalName: {
    fontSize: 16,
    color: colors.gray[500],
  },
  lifespan: {
    fontSize: 15,
    color: colors.gray[400],
  },
  source: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.gray[400],
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  actionText: {
    fontSize: 15,
    color: colors.gray[700],
  },
});
